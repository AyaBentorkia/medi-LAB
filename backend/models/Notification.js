const { Sequelize, DataTypes } = require('sequelize');

// modèle fichier résultat global
module.exports=(Sequelize,DataTypes)=>{
const Notification = Sequelize.define('Notification', {
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

}, {
  tableName: 'Notifications',
  timestamps: true,
});

Notification.associate = models => {
  Notification.belongsTo(models.User, { foreignKey: 'SecretaryId' });
};
return Notification;
}