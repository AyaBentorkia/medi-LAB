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
    default:''
  },
  publicId:{ 
    type:DataTypes.STRING,
    default:null,
  },
  fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    uploadedBy:{
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    }

}, {
  tableName: 'AnalysisReports',
  timestamps: true, 
});

AnalysisReport.associate = models => {
  AnalysisReport.belongsTo(models.AnalysisRequest, { foreignKey: 'AnalysisRequestId', as:'request' });
  AnalysisReport.belongsTo(models.User, { foreignKey: 'uploadedBy', as:'technician' });
};
return AnalysisReport;
}