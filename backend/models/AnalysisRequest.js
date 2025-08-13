const { Sequelize, DataTypes } = require('sequelize');
module.exports=(Sequelize,DataTypes)=>{
const AnalysisRequest=Sequelize.define('AnalysisRequest',{
    PatientId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: 'Users',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    SecretaryId:{
         type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: 'Users',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    status:{
        type: DataTypes.ENUM('En attente', 'En cours', 'Terminé'),
        allowNull: false,
        defaultValue: 'En attente',
    },
    note:{
        type: DataTypes.TEXT,
        allowNull: true,
    },
     SamplingDate:{
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
    },
 {
    tableName: 'AnalysisRequests',
    timestamps: true,
  });
  AnalysisRequest.associate = (models) => {
    // Relation avec Patient
    AnalysisRequest.belongsTo(models.User, {
      foreignKey: 'PatientId',
      as: 'patient',
    });
  // Relation avec la secrétaire
    AnalysisRequest.belongsTo(models.User, {
      foreignKey: 'SecretaryId',
      as: 'secretary',
    });
    // Relation many-to-many avec TypeAnalyse via table pivot
    AnalysisRequest.belongsToMany(models.AnalysisType, {
      through: 'AnalysisRequestAnalysisType',
      foreignKey: 'AnalysisRequestId',
      otherKey: 'AnalysisTypeId',
      as: 'analysisTypes',
      timestamps: false,
    });
     // Relation many-to-many avec Sample via table pivot
    AnalysisRequest.belongsToMany(models.Sample, {
      through: 'AnalysisRequestSample',
      foreignKey: 'AnalysisRequestId',
      otherKey: 'SampleId',
      as: 'samples',
      timestamps: false,
    });
    AnalysisRequest.hasMany(models.AnalysisResult, {
  foreignKey: 'AnalysisRequestId',
  as: 'results'
});


   
}
  return AnalysisRequest;

}
