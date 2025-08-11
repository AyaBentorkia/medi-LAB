// modèle fichier résultat global
const AnalysisResultFile = sequelize.define('AnalysisResultFile', {
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
  uploadedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Users', key: 'id' },
  },
}, {
  tableName: 'AnalysisResultFiles',
  timestamps: true,
});

AnalysisResultFile.associate = models => {
  AnalysisResultFile.belongsTo(models.AnalysisRequest, { foreignKey: 'AnalysisRequestId' });
  AnalysisResultFile.belongsTo(models.User, { foreignKey: 'uploadedBy' });
};
