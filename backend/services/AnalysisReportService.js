const { where } = require("sequelize");
const {AnalysisRequest,User,AnalysisResult,Sample,AnalysisReport}= require("../models");
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
      
      // Informations de la demande
      doc.fontSize(14).font('Helvetica-Bold').text('Informations de la demande:');
      doc.fontSize(12).font('Helvetica');
      doc.text(`ID Demande: ${analysisRequest.id}`);
      doc.text(`Date de création: ${new Date(analysisRequest.createdAt).toLocaleDateString()}`);
      doc.text(`Statut: ${analysisRequest.status}`);
      doc.moveDown();
      
      // Informations patient
      if (analysisRequest.patient) {
        doc.fontSize(14).font('Helvetica-Bold').text('Informations patient:');
        doc.fontSize(12).font('Helvetica');
        doc.text(`Nom: ${analysisRequest.patient.lastname}`);
        doc.text(`Prénom: ${analysisRequest.patient.firstname}`);
        doc.text(`CIN: ${analysisRequest.patient.CIN}`);
        doc.text(`Date de naissance: ${new Date(analysisRequest.patient.birth_date).toLocaleDateString()}`);
        doc.moveDown();
      }
      
      // Titre section résultats
      doc.fontSize(14).font('Helvetica-Bold').text('Résultats des analyses:');
      doc.moveDown();

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
      const tableTop = doc.y;
      const firstColumn = 50;
      const secondColumn = 250;
      const thirdColumn = 350;
      const fourthColumn = 450;
      
      // En-tête du tableau
      doc.font('Helvetica-Bold');
      doc.text('Analyse', firstColumn, tableTop);
      doc.text('Valeur', secondColumn, tableTop);
      doc.text('Valeur standard', thirdColumn, tableTop);
      doc.text('Commentaire', fourthColumn, tableTop);
      
      // Ligne de séparation de l'en-tête
      doc.moveTo(firstColumn, tableTop + 20).lineTo(550, tableTop + 20).stroke();
      
      // Remplissage des données du tableau
      let yPosition = tableTop + 30;
      doc.font('Helvetica');
      
      results.forEach((result, index) => {
        // Gestion des sauts de page
        if (yPosition > 700) {
          doc.addPage();
          yPosition = 50;
        }
        
        // Nom de l'analyse (avec gestion du texte trop long)
        const analysisName = result.analysisType.title;
        doc.text(analysisName, firstColumn, yPosition, { width: 180, align: 'left' });
        
        // Valeur
        doc.text(result.resultValue, secondColumn, yPosition, { width: 90, align: 'left' });
        
        // Valeur standard
        const standardValue = result.analysisType.StandardValue || 'N/A';
        doc.text(standardValue, thirdColumn, yPosition, { width: 90, align: 'left' });
        
        // Commentaire
        const comment = result.comment || '-';
        doc.text(comment, fourthColumn, yPosition, { width: 100, align: 'left' });
        
        // Ligne de séparation entre les lignes
        doc.moveTo(firstColumn, yPosition + 15).lineTo(550, yPosition + 15).stroke();
        
        yPosition += 20;
      });
      
      // Pied de page
      doc.addPage(); // Nouvelle page pour le pied de page
      doc.fontSize(10).text(`Rapport généré le: ${new Date().toLocaleDateString()}`, 50, 50);
      doc.text(`Technicien: ${technician.firstname} ${technician.lastname}`, 50, 65);
      
      doc.end();
      
      writeStream.on('finish', () => {
        resolve({
          filePath,
          fileName,
          fileUrl: `/uploads/reports/${fileName}`
        });
      });
      
      writeStream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
}
 // Récupérer tous les rapports
  async getAllReports(query) {
    try {
      const { page, limit} = query;
                               const pageQ = parseInt(page) || 1; // Page actuelle
                          const limitQ = parseInt(limit) || 5;
                          const skip = (pageQ - 1) * limitQ;
                          let filtre={};
                         const total = await AnalysisRequest.count({ where: filtre });
      
      const reports= await AnalysisReport.findAll({
        offset: skip,
                limit: limitQ
      });

      return {
        reports,
        total
      };
    } catch (error) {
      throw new AppError('Erreur lors de la récupération des rapports: ' + error.message, 500);
    }
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
}

module.exports = AnalysisReportService;
