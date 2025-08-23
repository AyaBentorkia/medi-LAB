const NotificationService = require('../services/NotificationService');
const AppError = require('../utils/AppError');

const createNotification = async (req, res, next) => {
  try {
    const Notification = await NotificationService.createNotification(req.user.id,req.body);
    return res.status(201).json({
      success: true,
      data: Notification
    });
  } catch (error) {
    console.log(error)
         if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ message: 'Server Error' });
    
  }
};

const getAllNotifications = async (req, res, next) => {
  try {
    const notifications = await NotificationService.getAllNotifications();
    return res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.log(error)
         if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ message: 'Server Error' });
    
  }
};

const getNotificationsByUser = async (req, res, next) => {
  try {
            const userId = req.user.id;
    const Notification = await NotificationService.getNotificationsByUser(userId);
    return res.status(200).json({
      success: true,
      Notification
    });
  } catch (error) {
    console.log(error)
         if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ message: 'Server Error' });
    
  }
};


module.exports = {
  createNotification,
  getAllNotifications,
  getNotificationsByUser,
};
