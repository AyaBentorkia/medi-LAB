const { where } = require("sequelize");
const PDFDocument = require('pdfkit'); // Ajout de l'import manquant
const fs = require('fs');
const path = require('path');
const {AnalysisRequest,AnalysisType,User,AnalysisResult,Sample,AnalysisReport}= require("../models");
const AppError = require("../utils/AppError");

class AnalysisReportService {

  async createReport(requestId, technician) {
       return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const fileName = `rapport_${requestId}_${Date.now()}.pdf`;
      const filePath = path.join(__dirname, '../uploads/reports', fileName);
      
      // Créer le dossier s'il n'existe pas
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);
      
      // Extraire les données de la demande
      const analysisRequest = await AnalysisRequest.findByPk(requestId, {
        include: [
          {
            model: User,
            as: 'patient',
            attributes: ['firstname', 'lastname', 'birth_date', 'CIN', 'email']
          },
          {
            model: AnalysisType,
            as: 'analysisTypes',
            attributes: ['id', 'title', 'description', 'StandardValue', 'unite']
          },
          {
            model: Sample,
            as: 'samples',
            attributes: ['id', 'title']
          }
        ]
      });

      if (!analysisRequest) {
        throw new AppError('Demande d\'analyse introuvable', 404);
      }

      // En-tête du document
      doc.fontSize(20).font('Helvetica-Bold').text('RAPPORT D\'ANALYSES MÉDICALES', { align: 'center' });
      doc.moveDown();

      // --- Infos demande & patient côte à côte ---
const leftX = 50;
const rightX = 300;
let currentY = doc.y;
      
      // Informations de la demande
      doc.fontSize(14).font('Helvetica-Bold').text('Informations de la demande:', leftX, currentY);
doc.fontSize(12).font('Helvetica')
   .text(`ID Demande: ${analysisRequest.id}`, leftX, doc.y)
   .text(`Date de création: ${new Date(analysisRequest.createdAt).toLocaleDateString()}`, leftX, doc.y)
   .text(`Statut: ${analysisRequest.status}`, leftX, doc.y);
      
      // Informations patient
      if (analysisRequest.patient) {
        doc.fontSize(14).font('Helvetica-Bold').text('Informations patient:', rightX, currentY);
doc.fontSize(12).font('Helvetica')
   .text(`Nom: ${analysisRequest.patient.lastname}`, rightX, doc.y)
   .text(`Prénom: ${analysisRequest.patient.firstname}`, rightX, doc.y)
   .text(`CIN: ${analysisRequest.patient.CIN}`, rightX, doc.y)
   .text(`Date de naissance: ${new Date(analysisRequest.patient.birth_date).toLocaleDateString()}`, rightX, doc.y);

      }
      doc.moveDown(2);
      // Titre section résultats
      doc.fontSize(14).font('Helvetica-Bold').text('Résultats des analyses:',leftX);
doc.moveDown(1);

      // Extraire les résultats des analyses
      const results = await AnalysisResult.findAll({
        where: { AnalysisRequestId: requestId },
        include: [
          {
            model: AnalysisType,
            as: 'analysisType',
            attributes: ['id', 'title', 'StandardValue', 'unite']
          }
        ]
      });

      // Configuration du tableau
      const tableTop = doc.y + 5;  // << petit offset pour éviter chevauchement
const colX = {
  analysis: 50,
  value: 220,
  standard: 320,
  comment: 440,
};
const colWidths = {
  analysis: 150,
  value: 80,
  standard: 120,
  comment: 120,
};

      
      // En-tête du tableau
    doc.font('Helvetica-Bold');
doc.text('Analyse', colX.analysis, tableTop, { width: colWidths.analysis });
doc.text('Valeur', colX.value, tableTop, { width: colWidths.value });
doc.text('Valeur standard', colX.standard, tableTop, { width: colWidths.standard });
doc.text('Commentaire', colX.comment, tableTop, { width: colWidths.comment });

      
      // Ligne de séparation de l'en-tête
doc.moveTo(colX.analysis, tableTop + 18).lineTo(560, tableTop + 18).stroke();      // Remplissage des données du tableau
      let yPosition = tableTop + 25;
      doc.font('Helvetica');
      
      results.forEach((result, index) => {
        // Gestion des sauts de page
        if (yPosition > 700) {
          doc.addPage();
          yPosition = 50;
        }
        
        // Nom de l'analyse (avec gestion du texte trop long)
        const analysisName = result.analysisType.title;
  const value = result.resultValue;
  const standardValue = result.analysisType.StandardValue || 'N/A';
  const comment = result.comment || '-';

  
  // Calcul de la hauteur nécessaire par cellule
  const analysisHeight = doc.heightOfString(analysisName, { width: colWidths.analysis });
  const valueHeight = doc.heightOfString(value, { width: colWidths.value });
  const standardHeight = doc.heightOfString(standardValue, { width: colWidths.standard });
  const commentHeight = doc.heightOfString(comment, { width: colWidths.comment });

  // Prendre la plus grande hauteur pour la ligne
const rowHeight = Math.max(
    doc.heightOfString(analysisName, { width: colWidths.analysis }),
    doc.heightOfString(value, { width: colWidths.value }),
    doc.heightOfString(standardValue, { width: colWidths.standard }),
    doc.heightOfString(comment, { width: colWidths.comment }),
    20
  );
  // Affichage des cellules
   doc.fontSize(12).text(analysisName, colX.analysis, yPosition, { width: colWidths.analysis });
  doc.fontSize(11).text(value, colX.value, yPosition, { width: colWidths.value });
  doc.fontSize(11).text(standardValue, colX.standard, yPosition, { width: colWidths.standard });
  doc.fontSize(11).text(comment, colX.comment, yPosition, { width: colWidths.comment });

  doc.moveTo(colX.analysis, yPosition + rowHeight).lineTo(560, yPosition + rowHeight).stroke();
  yPosition += rowHeight + 5;
      });
      
      // Pied de page
     doc.fontSize(10);
doc.text(`Rapport généré le: ${new Date().toLocaleDateString()}`, 50, doc.page.height - 80);
doc.text(`Technicien: ${technician?.firstname || ''} ${technician?.lastname || ''}`, 50, doc.page.height - 65);
      
      doc.end();
      
      writeStream.on('finish',  async () => {
  try {
    // Sauvegarder dans la table
    const report = await AnalysisReport.create({
      AnalysisRequestId: requestId,
      uploadedBy: technician, // attention: si technician = req.user.id ou un objet → adapter
      fileName,
      filePath,
      fileUrl: `/uploads/reports/${fileName}`
    });

    resolve(report);
  } catch (dbError) {
    reject(dbError);
  }
});
      
      writeStream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
}
 // Récupérer tous les rapports
  async getAllReports(query) {
      const { page, limit} = query;
                          //      const pageQ = parseInt(page) || 1; // Page actuelle
                          // const limitQ = parseInt(limit) || 5;
                          // const skip = (pageQ - 1) * limitQ;
                          let filtre={};
                         const total = await AnalysisReport.count({ where: filtre});
      const reports= await AnalysisReport.findAll({
        // offset: skip,
        //         limit: limitQ,
                 include: [
      {
        model: AnalysisRequest,
        as: "request",
        attributes:['id'],
        include: [
          {
            model: User,
            as: "patient",
            attributes: ["CIN", "firstname", "lastname","email"]
          }
        ]
      },
      {
        model: User,
        as: "technician", // qui a uploadé le rapport
        attributes: ["id", "firstname", "lastname"]
      }
    ]
      });

      return {
        reports,
        total
      };
 
  }

  // Récupérer un rapport par ID
  async getReportById(id) {
    try {
      const report = await AnalysisReport.findByPk(id);

      if (!report) {
        throw new AppError('Rapport non trouvé', 404);
      }

      return report;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erreur lors de la récupération du rapport: ' + error.message, 500);
    }
  }

  // Télécharger un rapport (backend)
  async downloadReport(id) {
    try {
      const report = await AnalysisReport.findByPk(id);
      
      if (!report) {
        throw new AppError('Rapport non trouvé', 404);
      }

      const filePath = path.join(__dirname, '../uploads/reports', report.fileName);
      
      // Vérifier si le fichier existe
      if (!fs.existsSync(filePath)) {
        throw new AppError('Fichier rapport introuvable', 404);
      }

      return {
        filePath,
        fileName: report.fileName,
        mimeType: 'application/pdf'
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erreur lors du téléchargement du rapport: ' + error.message, 500);
    }
  }

  async getPatientReports(PatientId,query){
    const { page, limit} = query;
                               const pageQ = parseInt(page) || 1; // Page actuelle
                          const limitQ = parseInt(limit) || 10;
                          const skip = (pageQ - 1) * limitQ;
                          let filtre={};
                         const total = await AnalysisReport.count({ where: filtre});
    const analysisRequest= await AnalysisRequest.findOne({where:{PatientId}});
    if(!analysisRequest) throw new AppError("Aucun demande trouvé ",404)
    const reports= await AnalysisReport.findAll({where:{AnalysisRequestId:analysisRequest.id},
      include: [
      {
        model: AnalysisRequest,
        as: "request",
        attributes:['id'],
        include: [
          {
            model: User,
            as: "patient",
            attributes: ["CIN", "firstname", "lastname"]
          }
        ]
      },
      {
        model: User,
        as: "technician", // qui a uploadé le rapport
        attributes: ["id", "firstname", "lastname"]
      }
    ]
      });
    return {
      reports,
      total
    };
  }
  // Supprimer un rapport
  async deleteReport(id) {
    try {
      // Trouver le rapport
      const report = await AnalysisReport.findByPk(id);
      
      if (!report) {
        throw new AppError('Rapport non trouvé', 404);
      }

      // Supprimer le fichier physique s'il existe
      const filePath = path.join(__dirname, '../uploads/reports', report.fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Supprimer le fichier Cloudinary si publicId existe
      if (report.publicId) {
        try {
          await cloudinaryRemoveRawFile(report.publicId);
        } catch (cloudinaryError) {
          console.warn('Erreur lors de la suppression Cloudinary:', cloudinaryError.message);
          // On continue même si Cloudinary échoue
        }
      }

      // Supprimer l'enregistrement de la base de données
      await report.destroy();

      return { message: 'Rapport supprimé avec succès' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Erreur lors de la suppression du rapport: ' + error.message, 500);
    }
  }

  // Supprimer plusieurs rapports
  async deleteMultipleReports(ids) {
    try {
      const results = [];
      
      for (const id of ids) {
        try {
          const result = await this.deleteReport(id);
          results.push({ id, success: true, message: result.message });
        } catch (error) {
          results.push({ 
            id, 
            success: false, 
            message: error.message 
          });
        }
      }

      return results;
    } catch (error) {
      throw new AppError('Erreur lors de la suppression multiple: ' + error.message, 500);
    }
  }

  // Vérifier si un rapport existe
  async reportExists(id) {
    try {
      const count = await AnalysisReport.count({ where: { id } });
      return count > 0;
    } catch (error) {
      throw new AppError('Erreur lors de la vérification: ' + error.message, 500);
    }
  }
}


module.exports = new AnalysisReportService();
