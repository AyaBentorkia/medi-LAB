const { Sequelize, DataTypes } = require('sequelize');
module.exports=(Sequelize,DataTypes)=>{
const User=Sequelize.define('User',{
    CIN:{
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    firstname:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastname:{
        type: DataTypes.STRING,
        allowNull: false,
    },
   
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true},
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [8, 100] 
        },
    },
      phoneNumber: {
        type: DataTypes.STRING,
        unique: true,
      },
      adress: {
        type: DataTypes.STRING,
      },
      city:{
        type:DataTypes.STRING,
      },
      birth_date: {
        type: DataTypes.DATEONLY,
      },
      gender: {
        type: DataTypes.ENUM('Feminine', 'Masculin'),
        defaultValue: 'Masculin',
      },
      role: {
        type: DataTypes.ENUM('Admin', 'Patient', "Secrétaire d'accueil",'Technicien de laboratoire'),
        allowNull: false,
        defaultValue:'Patient',
      },   
      status:{
        type:DataTypes.ENUM("Activé","Desactivé"),
        allowNull: false,
        defaultValue:"Activé",
      }   
    },
   
  );
  User.associate = (models) => {
  User.hasMany(models.AnalysisRequest, {
    foreignKey: 'PatientId',
    as: 'patientRequests', // alias utilisé pour accéder aux demandes d’un patient
  });
  User.hasMany(models.AnalysisRequest, {
    foreignKey: 'SecretaryId',
    as: 'secretaryRequests', // alias utilisé pour accéder aux demandes d’une secrétaire
  });
};
  return User;
}

  
