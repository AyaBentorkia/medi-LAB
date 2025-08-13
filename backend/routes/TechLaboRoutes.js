
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { 
    GetAnalysisRequestById,
    UpdateAnalysisRequestStatus,
    DeleteAnalysisRequest} = require('../controllers/AnalysisRequestController');
const { verifyTechnicienLabo,
}= require('../middleware/AuthMiddleware');
const {
  createMultipleResults,
  getResultsByRequestId,
  updateResult,
  deleteResult,
} = require('../controllers/AnalysisResultController');

// Routes for analysis-request management
router.get('/analysis-requests/:id', verifyTechnicienLabo, GetAnalysisRequestById);
router.patch('/analysis-requests/:id', verifyTechnicienLabo, UpdateAnalysisRequestStatus);

// Routes for result management
router.post('/results/:id', verifyTechnicienLabo, createMultipleResults);
router.get('/results/:requestId', verifyTechnicienLabo, getResultsByRequestId);
router.put('/results/:id', verifyTechnicienLabo, updateResult);
router.delete('/results/:id', verifyTechnicienLabo, deleteResult);

module.exports = router;