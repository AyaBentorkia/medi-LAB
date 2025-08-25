const AuthService = require("../services/AuthService")
const User= require("../models/User");
const AppError = require("../utils/AppError");
/**
 * @desc register User
 * @route /register
 * @method POST
 * @access public
 */
const RegisterUser= async (req, res)=> {
    try {
        const user= await AuthService.register(req.body);
        return res.status(200).json({ message: "User est créé", user });
    } catch (error) {
        if (error instanceof AppError) {
            console.log(error.message)
        return res.status(error.statusCode).json({ error: error.message });
        }
        console.log(error.message)
        return res.status(500).json({ message: 'Server Error' });
    }
}
/**
 * @desc Login User
 * @route /login
 * @method post
 * @access public 
 */
const LoginUser= async (req, res)=> {
    try {
        const {email, password, role} = req.body;
        const user= await AuthService.login(email, password, role);
        return res.status(200).json({ message: "User connecté avec succès", user });
    } catch (error) {
                console.log(error)

        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ message: 'Server Error' });
    }
}

const Logout= async(req,res)=>{
    try {
        res.clearCookie('token');
        res.status(200).json({ success: true, message: "Logout successful" });
    } catch (error) {
        console.error('Error logging out user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    RegisterUser,
    LoginUser,
    Logout
}