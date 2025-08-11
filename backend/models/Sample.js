const { Sequelize, DataTypes } = require('sequelize');
module.exports=(Sequelize,DataTypes)=>{
const Sample=Sequelize.define('Sample',{
    title:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    
    },
 {
    tableName: 'Samples',
    timestamps: true,
  });

   Sample.associate = (models) => {
    Sample.belongsToMany(models.AnalysisRequest, {
      through: 'AnalysisRequestSample',
      foreignKey: 'SampleId',
      otherKey: 'AnalysisRequestId',
      as: 'analysisRequests',
      timestamps: false,
    });
  };


  return Sample;
}
  
