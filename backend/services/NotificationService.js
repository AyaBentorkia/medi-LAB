const {Notification} = require('../models/');

class NotificationService {

    async createNotification ( userId ) {
        const message= `un nouveau demande d'analyse est ajouté`
        const notification = new Notification({ userId,message });
        return await notification.save();
    };

    async getNotificationsByUser  (userId) {
  return await Notification.findByPk( userId );
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
