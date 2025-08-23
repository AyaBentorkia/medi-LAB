const express = require('express');
const router = express.Router();
const { getReportByPatient} = require('../controllers/AnalysisReportController.');
const {VerifyToken}= require('../middleware/AuthMiddleware')

router.get('/reports', VerifyToken, getReportByPatient);

module.exports= router;