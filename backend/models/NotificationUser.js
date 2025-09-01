const { Sequelize, DataTypes } = require('sequelize');
const {User, Notification} = require('./');

// NotificationUser.js
module.exports = (Sequelize, DataTypes) => {
  const NotificationUser = Sequelize.define('NotificationUser', {
    TechnicianId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onDelete: 'CASCADE',
    },
    NotificationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Notifications', key: 'id' },
      onDelete: 'CASCADE',
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  }, {
    tableName: 'NotificationUsers',
    timestamps: true,
  });
NotificationUser.associate = models => {
    NotificationUser.belongsTo(models.Notification, { foreignKey: 'NotificationId' });
  NotificationUser.belongsTo(models.User, { foreignKey: 'TechnicianId' });
};
return NotificationUser;
};
