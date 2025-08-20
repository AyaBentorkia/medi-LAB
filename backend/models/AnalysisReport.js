const { Sequelize, DataTypes } = require('sequelize');

// modèle fichier résultat global
module.exports=(Sequelize,DataTypes)=>{
const AnalysisReport = Sequelize.define('AnalysisReport', {
  AnalysisRequestId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'AnalysisRequests', key: 'id' },
    onDelete: 'CASCADE',
  },
  fileUrl: {
    type: DataTypes.STRING, // URL ou chemin du fichier
    allowNull: false,
  },

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