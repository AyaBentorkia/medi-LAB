
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { 
    UpdateUser,
    GetUserProfileById,
    logout,} = require('../controllers/UserController');
const { RegisterUser, LoginUser } = require('../controllers/AuthController');
const { verifyAdmin,
    verifySecretaire,
    verifyTechnicienLabo,
    verifyAccountStatus,
    VerifyToken
}= require('../middleware/AuthMiddleware');
const { ValidateUpdateUser } = require('../services/UserService');
const { ValidateLoginUser ,ValidateUser} = require('../services/AuthService');

// Routes for user management
router.post('/login', LoginUser);
router.post('/register',RegisterUser);
router.put('/users', VerifyToken, UpdateUser);
router.get('/users/profile', VerifyToken,GetUserProfileById);

module.exports = router;
