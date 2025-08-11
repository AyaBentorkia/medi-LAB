const { Sequelize, DataTypes } = require('sequelize');
module.exports=(Sequelize,DataTypes)=>{
const AnalysisType=Sequelize.define('AnalysisType',{
    title:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    description:{
        type: DataTypes.STRING,
        allowNull: true,
    },
     StandardValue:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    unite: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price:{
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
            min: 0,
        },
        defaultValue: 0,
    },
  },
 {
    tableName: 'AnalysisTypes',
    timestamps: true,
  });

  AnalysisType.associate = (models) => {
    AnalysisType.belongsToMany(models.AnalysisRequest, {
      through: 'AnalysisRequestAnalysisType',
      foreignKey: 'AnalysisTypeId',
      otherKey: 'AnalysisRequestId',
      as: 'analysisRequests',
      timestamps: false,
    });
  }; 

  return AnalysisType;
}
  
