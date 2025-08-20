
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { 
    UpdateUser,
    GetUserProfileById,
    logout,} = require('../controllers/UserController');
const { RegisterUser, LoginUser } = require('../controllers/AuthController');
const { 
    VerifyToken
}= require('../middleware/AuthMiddleware');
const { ValidateUpdateUser } = require('../services/UserService');
const { ValidateLoginUser ,ValidateUser} = require('../services/AuthService');
const { GetAnalysisRequestById, GetAllAnalysisRequests } = require('../controllers/AnalysisRequestController');

// Routes for user management
router.post('/login', LoginUser);
router.post('/register',RegisterUser);
router.put('/users', VerifyToken, UpdateUser);
router.get('/users/profile', VerifyToken,GetUserProfileById);
router.get('/analysis-requests/:id', VerifyToken, GetAnalysisRequestById);
router.get('/analysis-requests', VerifyToken, GetAllAnalysisRequests);
router.get('/users', VerifyToken, UserController.GetAllUsers);
router.get('/users/:id', VerifyToken, UserController.GetUserById);



module.exports = router;
