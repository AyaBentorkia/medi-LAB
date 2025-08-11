
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { 
     CreateAnalysisRequest,
    GetAnalysisRequests,
    GetAnalysisRequestById,
    UpdateAnalysisRequest,
    UpdateAnalysisRequestStatus,
    DeleteAnalysisRequest} = require('../controllers/AnalysisRequestController');
const { verifySecretaire,
}= require('../middleware/AuthMiddleware');
const { ValidateAnalysisRequest } = require('../services/AnalysisRequestService');

// Routes for user management
router.post('/analysis-requests', verifySecretaire, CreateAnalysisRequest);
router.get('/analysis-requests', verifySecretaire, GetAnalysisRequests);
router.get('/analysis-requests/:id', verifySecretaire, GetAnalysisRequestById);
router.patch('/analysis-requests/:id', verifySecretaire, UpdateAnalysisRequest);
router.delete('/analysis-requests/:id', verifySecretaire, DeleteAnalysisRequest);


module.exports = router;