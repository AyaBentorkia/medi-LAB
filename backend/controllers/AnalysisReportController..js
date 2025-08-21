const reportService = require('../services/AnalysisReportService');
const AppError = require('../utils/AppError');

const createReport = async (req, res, next) => {
  try {
    const report = await reportService.createReport(req.body);
    return res.status(201).json({
      success: true,
      data: report
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
    const { results, total } = await reportService.getAllReports(req.query);
    return res.status(200).json({
      success: true,
      results,
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

module.exports = {
  createReport,
  getAllReports,
  getReportById,
  downloadReport
};
