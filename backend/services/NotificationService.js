const {Notification,User,NotificationUser} = require('../models/');
const AppError = require('../utils/AppError');

class NotificationService {

    async createNotification ( userId ) {
        const message= `un nouveau demande d'analyse est ajouté`
        const notification = await Notification.create({SecretaryId: userId,message });

        const technicians = await User.findAll({where:{role: 'Technicien de laboratoire'}})
        if(technicians.length < 1) throw new AppError("liste des techniciens est vide",400);
        // tu crées une notif par user
        for (const tech of technicians) {
          await NotificationUser.create({
            NotificationId: notification.id,
            TechnicianId: tech.id
          });
        }
        return notification;

    };

    async getNotificationsByUser  (userId) {
  const notifications= await Notification.findByPk( userId );
  return notifications;
};
 async getAllNotifications  () {
  const notifications= await Notification.findAll({ order: [['createdAt', 'DESC']]});
  return notifications;
};
async getAllNotificationUsers  (TechnicianId) {
  const notifications= await NotificationUser.findAll({where:{TechnicianId}, order: [['createdAt', 'DESC']]});
  return notifications;
};

    async markAsRead (TechnicianId)  {
      const notifications = await NotificationUser.update(
  { isRead: true },
  { where: { TechnicianId, isRead: false } }
);
    

    return notifications;
};
}
module.exports = new NotificationService();
