const {User} = require("../models");
const AppError = require("../utils/AppError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const joi = require("joi");

//Validation de User
function ValidateUser(obj){
    const ALLOWED_ROLES = ['Admin', 'Patient', "Secrétaire d'accueil",'Technicien de laboratoire'];
    const schema=joi.object({
      CIN:joi.string().required(),
        firstname:joi.string().trim().required(),
        lastname:joi.string().trim().required(),
        email:joi.string().trim().email().required(),
        password:joi.string().min(8).required(),
        phoneNumber:joi.string().required(),
        adress:joi.string(),
        city:joi.string(),
        birth_date:joi.date(),
        gender:joi.string().valid('Feminine', 'Masculin').default('Masculin'),
        role:joi.string().valid(...ALLOWED_ROLES).default('Patient').required(),
    })
    return schema.validate(obj);
}
//Validation de login de user
function validateLoginUser(obj) {
    const ALLOWED_ROLES = ['Admin', 'Patient', "Secrétaire d'accueil",'Technicien de laboratoire'];
    const schema = joi.object({
        email:joi.string().trim().email().required(),
        password:joi.string().min(8).required(),
        role:joi.string().valid(...ALLOWED_ROLES).required(),
    });
    return schema.validate(obj);
  }

class AuthService {

  async register(userData) {
        const {error}=ValidateUser(userData);
        if(error){
            throw new AppError(error?.details[0].message || 'erreur de validation',400);}
        const {firstname,lastname,email,password,phoneNumber,adress,city,birth_date,gender,role,CIN}=userData;

        let user= await User.findOne({ where: { email } });
        if(user) throw new AppError("utilisateur deja existe avec cet email ",409);
        user= await User.findOne({where:{phoneNumber}})
                if(user) throw new AppError("utilisateur deja existe avec ce numero de telephone ",409);

        user= await User.findOne({where:{CIN}})
        if(user) throw new AppError("utilisateur deja existe avec ce numero de CIN ",409);


        const passwordHashed= await bcrypt.hash(password, 10);
        const newUser = await User.create({
            firstname,
            lastname,
            email,
            password: passwordHashed,
            phoneNumber,
            adress,
            city,
            birth_date,
            gender,
            role,
            CIN
        });
        return newUser;
  }

  async login(email, password, role) {
      if(!email || !password) {
        throw new AppError('Email et mot de passe requis', 400);
      }
      const {error}=validateLoginUser({email,password,role});
      if(error){
            throw new AppError(error.details[0].message,400);
        }
      const user = await User.findOne({ where: { email ,role} });
      if (!user ) {
        throw new AppError('user invalide', 401);
      }
      const isMatch= await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw new AppError('mot de passe invalide', 401);
      }

      const accessToken = jwt.sign(
        {
          userInfo: {
            id: user.id,
            role: user.role
          }
        },
        process.env.JWT_SECRET_KEY,
        {expiresIn: '1d'}
      );

      return {user,accessToken};
  
  }
}
module.exports = new AuthService();