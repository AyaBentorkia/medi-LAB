const User = require('../models/User');
const AppError = require('../utils/AppError');
const UserService = require('../services/UserService');
/**
 * @desc Get All Users
 * @route /users
 * @method get
 * @access private (only admin)
 */
const GetAllUsers= async (req, res) => {
    try {
        const { users, total } = await UserService.getAllUsers(req.query);
        return res.status(200).json({ message: "Users trouvés", users, total });
    } catch (error) {
        console.log(error)
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ message: 'Server Error' });
    }
}
/**
 * @desc Get user profile by id 
 * @route /users/:id
 * @method get
 * @access private only admin
 */
const GetUserProfileById = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await UserService.getUserProfileById(userId);
        return res.status(200).json({ message: "User trouvé", user });
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ message: 'Server Error' });
    }
}
/**
 * @desc Get user by id 
 * @route /users/:id
 * @method get
 * @access private only admin
 */
const GetUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await UserService.getUserById(userId);
        return res.status(200).json({ message: "User trouvé", user });
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ message: 'Server Error' });
    }
}
/**
 * @desc Update user
 * @route /profile/:id
 * @method put
 * @access private 
 */
const UpdateUser= async (req, res) => {
    try {
        const userId = req.user.id;
        const updatedUser = await UserService.updateUser(userId, req.body);
        return res.status(200).json({ message: "User mis à jour avec succès", updatedUser });
    } catch (error) {
        console.log(error)
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ message: 'Server Error' });
    }
}
/**
 * @desc Manage user status
 * @route /usersStatus/:id
 * @method put
 * @access private (only admin)
 */
const ManageUserStatus = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log("userId : ",userId);
        console.log("status",req.body.status);
        const response = await UserService.manageUserStatus(userId, req.body.status);
        return res.status(200).json({ message: response.message,status:response.status });
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ message: 'Server Error' });
    }
}

/**
 * @desc Delete user
 * @route /users/:id
 * @method delete
 * @access private (only admin)
 */
const DeleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await UserService.getUserById(userId);
        if (!user) throw new AppError(404, 'User non trouvé');
        await User.destroy({ where: { id: userId } });
        return res.status(200).json({ message: "User supprimé avec succès" });
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ message: 'Server Error' });
    }
}
/**
 * @desc Reset user password
 * @route /users/reset-password
 * @method post
 * @access public
 */
const ResetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const response = await UserService.resetPassword(email, newPassword);
        return res.status(200).json({ message: response.message });
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ message: 'Server Error' });
    }
}
const logout = (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error('Error logging out user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = {
    GetAllUsers,
    GetUserById,
    UpdateUser,
    DeleteUser,
    ResetPassword,
    ManageUserStatus,
    logout,
    GetUserProfileById,
}
