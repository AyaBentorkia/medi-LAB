const {User, AnalysisReport, AnalysisRequest} = require('../models/');
const reportService = require('../services/AnalysisReportService');
const AppError = require('../utils/AppError');
const path = require('path');
const fs = require('fs');
const {
  cloudinaryUploadReport,
  cloudinaryRemoveRawFile,
} = require("../utils/cloudinary");
const cloudinary = require('cloudinary');
const AnalysisReportService = require('../services/AnalysisReportService');

const createReport = async (req, res, next) => {
  try {
    const report = await reportService.createReport(req.params.id,req.user.id);
    return res.status(201).json({
      success: true,
      report: report
    });
  } catch (error) {
    console.log(error)
         if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ message: 'Server Error' });
    
  }
};

const getAllReports = async (req, res, next) => {
  try {
    const { reports, total } = await reportService.getAllReports(req.query);
    return res.status(200).json({
      success: true,
      reports,
      total
    });
  } catch (error) {
    console.log(error)
         if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ message: 'Server Error' });
    
  }
};

const getReportById = async (req, res, next) => {
  try {
    const report = await reportService.getReportById(req.params.id);
    return res.status(200).json({
      success: true,
      report
    });
  } catch (error) {
    console.log(error)
         if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ message: 'Server Error' });
    
  }
};

const GetReportByRequestId = async (req, res, next) => {
  try {
    const report = await reportService.getReportByRequestId(req.params.id);
    return res.status(200).json({
      success: true,
      report
    });
  } catch (error) {
         if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ message: 'Server Error' });
    
  }
};

const getReportByPatient = async (req, res, next) => {
  try {
    const {reports,total} = await reportService.getPatientReports(req.user.id,req.query);
    return res.status(200).json({
      success: true,
      reports,
      total
    });
  } catch (error) {
    console.log(error)
         if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ message: 'Server Error' });
    
  }
};

const downloadReport = async (req, res, next) => {
  try {
    const { filePath, fileName, mimeType } = await reportService.downloadReport(req.params.id);
    
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', mimeType);
    
    res.sendFile(filePath);
  } catch (error) {
    console.log(error)
         if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ message: 'Server Error' });
    
  }
};
/**-----------------------------------------------
 * @desc    Report Upload
 * @route   
 * @method  POST
 * @access  private (only Labo tech)
 ------------------------------------------------*/
 const ReportUploadCtrl = async (req, res) => {
    try{
        // 1. Validation
    if (!req.file) {
        console.log("ici a file 1");

        return res.status(400).json({ message: "no file provided" });
      }
    
      // 2. Get the path to the image
      const FilePath = path.join(__dirname, `../uploads/${req.file.filename}`);
      console.log("ici a 2 file path : ",FilePath);

      // 3. Upload to cloudinary
      const result = await cloudinaryUploadReport(FilePath);

      // 4. Get the user from DB
      const analysisRequest= await AnalysisRequest.findByPk(req.params.id,
        {
          include:[
            {model:User,
              as:'patient',
            attributes: ['id']
            }
          ]
        }
      );
const patient = analysisRequest.patient?.id;
      console.log("user : ",patient);
      let analysisReport= await AnalysisReport.findOne({where:{AnalysisRequestId:analysisRequest.id}})

    
      // 5. Delete the old profile photo if exist
      if (analysisReport && analysisReport.publicId !== null) {
        await cloudinaryRemoveRawFile(analysisReport.publicId);
      }
      console.log("id public : ",analysisReport.publicId)
    
    // 6. Update or create the report
    if (analysisReport) {
      // Mettre à jour le rapport existant
      analysisReport = await analysisReport.update({
        fileUrl: result.secure_url,
        publicId: result.public_id,
        fileName: `${analysisRequest.id}_report${path.extname(req.file.originalname)}`
      });
    } else {
      // Créer un nouveau rapport
      analysisReport = await AnalysisReport.create({
        AnalysisRequestId: analysisRequest.id,
        fileUrl: result.secure_url,
        publicId: result.public_id,
        fileName: `${analysisRequest.id}_${analysisRequest.patient?.firstname}${analysisRequest.patient.lastname}_report${path.extname(req.file.originalname)}`,
        uploadedBy: req.user.id // Assuming you have user info in req.user
      });
    }
      const downloadUrl = cloudinary.url(result.public_id, {
        resource_type: 'raw',
        type: 'upload',
        flags: 'attachment',
        secure: true,
        sign_url: false // À activer en production si nécessaire
      });
      // 8. Remvoe image from the server
      fs.unlinkSync(FilePath);
      // 7. Send response to client
      res.status(200).json({
      message: "Rapport téléchargé avec succès",
      report: {
        url: result.secure_url,
        downloadUrl: downloadUrl,
        publicId: result.public_id,
        fileName: analysisReport.fileName
      }
    });
      
    }
    catch(error){
        console.log(error.message)
        return res.status(600).json({ status: "error", message: error.message });
    }
    
  };
  /**
 * @desc Delete user
 * @route /users/:id
 * @method delete
 * @access private (only admin)
 */
const DeleteReport = async (req, res) => {
    try {
        const reportId = req.params.id;
        const report = await AnalysisReportService.deleteReport(reportId);
        if (!report) res.status(404).json({ message: "Rapport non trouvé" });
        return res.status(200).json({ message: "Rapport supprimé avec succès" });
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ message: 'Server Error' });
    }
}
module.exports = {
  createReport,
  getAllReports,
  getReportById,
  downloadReport,
  ReportUploadCtrl,
  getReportByPatient,
  DeleteReport,
  GetReportByRequestId
  
};
