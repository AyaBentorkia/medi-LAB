const {Notification} = require('../models/');

class NotificationService {

    async createNotification ( userId ) {
        const message= `un nouveau demande d'analyse est ajouté`
        const notification = new Notification({SecretaryId: userId,message });
        return await notification.save();
    };

    async getNotificationsByUser  (userId) {
  const notifications= await Notification.findByPk( userId );
  return notifications;
};
 async getAllNotifications  () {
  const notifications= await Notification.findAll({ order: [['createdAt', 'DESC']]});
  return notifications;
};

    async markAsRead (userId)  {
      const result = await Notification.updateMany(
        { userId, isRead: false },
        { $set: { isRead: true } }
    );

    

    return result;
};
}
module.exports = new NotificationService();
