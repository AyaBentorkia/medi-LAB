const {User}= require('../models');
const AppError = require('../utils/AppError');
const {Op} = require('sequelize');
const joi = require('joi');
const bcrypt = require('bcrypt');

function ValidateUpdateUser(obj){
   const ALLOWED_ROLES = ['Admin', 'Patient', "Secrétaire d'accueil",'Technicien de laboratoire'];
       const schema=joi.object({
           firstname:joi.string().trim(),
           lastname:joi.string().trim(),
           password:joi.string().min(8),
           phoneNumber:joi.string(),
           adress:joi.string(),
           city:joi.string(),
           birth_date:joi.date(),
           gender:joi.string().valid('Feminine', 'Masculin').default('Masculin'),
           role:joi.string().valid(...ALLOWED_ROLES).default('Patient'),
           CIN: joi.string(),
       })
    return schema.validate(obj);
}

class UserService {

    async getAllUsers(query) {
            const { page, limit, status, role, search } = query;
             const pageQ = parseInt(page) || 1; // Page actuelle
        // const limitQ = parseInt(limit) || 0;
        // const skip = (pageQ - 1) * limitQ;
        let filtre={};
         
        if (status) filtre.status = { [Op.like]: `%${status}%` };
        if (role) filtre.role = { [Op.like]: `%${role}%` };
        if (search) {
    filtre[Op.or] = [
      { firstname: { [Op.like]: `%${search}%` } },
      { lastname: { [Op.like]: `%${search}%` } },
      { CIN: { [Op.like]: `%${search}%` } },
      { phoneNumber: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } }
    ];
  }
        const total = await User.count({ where: filtre });

            const users = await User.findAll({
                where: filtre,
                // offset: skip,
                // limit: limitQ,
                attributes: { exclude: ['password'] },
            });
            return {users, total};
    }

    async getUserById(userId) {
        
            if(!userId) throw new AppError('User ID est requis',400);
            const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] }
            });
            if(!user) throw new AppError('User non trouvé',404);
            return user;
      
    }
    async getUserProfileById(userId) {
            if(!userId) throw new AppError('User ID est requis',400);
            const user = await User.findByPk(userId);
            if(!user) throw new AppError('User non trouvé',404);
            return user;
      
    }
    

    async updateUser(userId, userData) {
            const {firstname,lastname,phoneNumber,adress,city,birth_date,gender,role,CIN}=userData;
            const {password,...otherData}=userData;
            const {error}= ValidateUpdateUser({firstname,lastname,password,phoneNumber,adress,city,birth_date,gender,role,CIN});
             if(error){
            throw new AppError(error.details[0].message,400);
            }

            const user= await User.findByPk(userId);
            if(!user) throw new AppError(404, 'User non trouvé');

             if(userData.password && !userData.password.startsWith('$2b$')) {
                userData.password =await bcrypt.hash(userData.password,10);
                user.set(userData);
            }
            else {
                user.set(otherData);
            }
            
            const updatedUser= await user.save();
            return updatedUser;
            // const [updated] = await User.update({
            //     firstname,
            //     lastname,
            //     password,
            //     phoneNumber,
            //     adress,
            //     city,
            //     birth_date,
            //     gender,
            //     role,
            // }, {
            //     where: { id: userId }
            // });
        
    }
    async manageUserStatus(userId, status) {
            if(!userId || !status) throw new AppError(400, 'User ID et status sont requis');
            const user = await User.findByPk(userId);
            if(!user) throw new AppError(404, 'User non trouvé');
            user.status = status;
            await user.save();
            return { message: `User status mis à jour en ${status}`,status };
        
    }

    async resetPassword(email, newPassword) {
        try {
            if(!email || !newPassword) throw new AppError(400, 'Email et nouveau mot de passe sont requis');
            const user = await User.findOne({ where: { email } });
            if(!user) throw new AppError(404, 'User non trouvé');
            const passwordHashed = await bcrypt.hash(newPassword, 10);
            user.password = passwordHashed;
            await user.save();
            return { message: 'Mot de passe réinitialisé avec succès' };
        } catch (error) {
            throw new Error('Server error ');
        }
    }

    async deleteUser(userId) {
        try {
             const UserToDelete=await User.findByPk(userId);
            if(!UserToDelete) throw new AppError(404, 'User non trouvé');

            const deleted = await User.destroy({
                where: { id: userId }
            });
            return deleted;
        } catch (error) {
            throw new Error('Server error ');
        }
    }
}

module.exports = new UserService();