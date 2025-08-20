
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { 
     CreateAnalysisRequest,
    GetAnalysisRequests,
    GetAnalysisRequestById,
    UpdateAnalysisRequest,
    UpdateAnalysisRequestStatus,
    DeleteAnalysisRequest,
    GetAllAnalysisRequests} = require('../controllers/AnalysisRequestController');
const { verifySecretaire,
}= require('../middleware/AuthMiddleware');
const { ValidateAnalysisRequest } = require('../services/AnalysisRequestService');
const { CreateAnalysisType, GetAnalysisTypes } = require('../controllers/AnalysisTypeController');
const { GetSamples, GetSampleById } = require('../controllers/SampleController');

// Routes for user management
router.get('/users', verifySecretaire, UserController.GetAllUsers);
router.get('/users/:id', verifySecretaire, UserController.GetUserById);
router.post('/analysis-requests', verifySecretaire, CreateAnalysisRequest);
router.get('/analysis-requests', verifySecretaire, GetAnalysisRequests);
router.get('/analysis-requests', verifySecretaire, GetAllAnalysisRequests);
router.get('/analysis-requests/:id', verifySecretaire, GetAnalysisRequestById);
router.patch('/analysis-requests/:id', verifySecretaire, UpdateAnalysisRequest);
router.delete('/analysis-requests/:id', verifySecretaire, DeleteAnalysisRequest);

router.get('/analysis-types', verifySecretaire, GetAnalysisTypes);
router.get('/samples/:id', verifySecretaire, GetSampleById);


router.get('/samples', verifySecretaire, GetSamples);
module.exports = router;