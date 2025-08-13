const { Sequelize, DataTypes } = require('sequelize');

// modèle fichier résultat global
module.exports=(Sequelize,DataTypes)=>{
const AnalysisReport = Sequelize.define('AnalysisReport', {
  SecretaryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Users', key: 'id' },
    onDelete: 'CASCADE',
  },
  message: {
    type: DataTypes.STRING, // URL ou chemin du fichier
    allowNull: false,
  },
  isRead:{
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
  
}, {
  tableName: 'AnalysisResultFiles',
  timestamps: true,
});

AnalysisReport.associate = models => {
  AnalysisReport.belongsTo(models.AnalysisRequest, { foreignKey: 'AnalysisRequestId' });
  AnalysisReport.belongsTo(models.User, { foreignKey: 'uploadedBy' });
};
return AnalysisReport;
}