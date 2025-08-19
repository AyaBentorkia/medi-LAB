
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { GetAllUsers,
    GetUserById,
    DeleteUser,
    ResetPassword,
    ManageUserStatus,
    GetUserProfileById,
    logout,} = require('../controllers/UserController');
const { RegisterUser } = require('../controllers/AuthController');
const { verifyAdmin,
    VerifyToken
}= require('../middleware/AuthMiddleware');
const { ValidateUpdateUser } = require('../services/UserService');
const { ValidateLoginUser ,ValidateUser} = require('../services/AuthService');

const { CreateAnalysisType,
    GetAnalysisTypes,
    GetAnalysisTypeById,
    UpdateAnalysisType,
    DeleteAnalysisType}= require('../controllers/AnalysisTypeController');
const {ValidateAnalysisType,ValidateAnalysisUpdateType}= require("../services/AnalysisTypeService");

const {GetSamples,
    GetSampleById,
    GetSampleByTitle,
    UpdateSample,
    DeleteSample,
    CreateSample}= require('../controllers/SampleController');
const { GetAnalysisRequestById } = require('../controllers/AnalysisRequestController');

// Routes for user management
router.get('/users/:id', verifyAdmin, GetUserById);
router.post('/createUser', verifyAdmin, RegisterUser);
router.get('/users', verifyAdmin, GetAllUsers);
router.get('/profile', VerifyToken,GetUserProfileById);
router.delete('/users/:id', verifyAdmin, DeleteUser);
router.patch('/users/:id', verifyAdmin, ManageUserStatus);

//Routes for analysis types management
router.post('/analysis-types', verifyAdmin, CreateAnalysisType);
router.get('/analysis-types', verifyAdmin, GetAnalysisTypes);
router.get('/analysis-types/:id', verifyAdmin, GetAnalysisTypeById);
router.put('/analysis-types/:id', verifyAdmin, UpdateAnalysisType);
router.delete('/analysis-types/:id', verifyAdmin, DeleteAnalysisType);
//Routes for sample management
router.post('/samples', verifyAdmin, CreateSample);
router.get('/samples', verifyAdmin, GetSamples);
router.get('/samples/:id', verifyAdmin, GetSampleById);
router.get('/samples/title/:title', verifyAdmin, GetSampleByTitle);
router.patch('/samples/:id', verifyAdmin, UpdateSample);
router.delete('/samples/:id', verifyAdmin, DeleteSample);

router.get('/analysis-requests/:id', verifyAdmin, GetAnalysisRequestById);


module.exports = router;
