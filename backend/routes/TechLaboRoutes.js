
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { 
    UpdateAnalysisRequestStatus,
    DeleteAnalysisRequest} = require('../controllers/AnalysisRequestController');
const { verifyTechnicienLabo,
}= require('../middleware/AuthMiddleware');

// Routes for user management
router.patch('/analysis-requests/:id', verifyTechnicienLabo, UpdateAnalysisRequestStatus);
module.exports = router;