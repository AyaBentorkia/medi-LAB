// models/AnalysisResult.js
module.exports = (sequelize, DataTypes) => {
  const AnalysisResult = sequelize.define('AnalysisResult', {
    AnalysisRequestId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'AnalysisRequests',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    AnalysisTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'AnalysisTypes',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    resultValue: {
      type: DataTypes.STRING, // on laisse STRING car certains résultats ne sont pas numériques (ex: "Positif", "Négatif")
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    TechnicianId: {
      type: DataTypes.INTEGER, // l'ID du technicien qui valide
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
      },
    }
  }, {
    tableName: 'AnalysisResults',
    timestamps: true,
  });

  AnalysisResult.associate = (models) => {
    AnalysisResult.belongsTo(models.AnalysisRequest, { foreignKey: 'AnalysisRequestId', as: 'request' });
    AnalysisResult.belongsTo(models.AnalysisType, { foreignKey: 'AnalysisTypeId', as: 'analysisType' });
    AnalysisResult.belongsTo(models.User, { foreignKey: 'validatedBy', as: 'validator' });
  };

  return AnalysisResult;
};
