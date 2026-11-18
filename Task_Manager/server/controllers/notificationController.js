import mongoose from 'mongoose';
import { Notification } from '../models/Notification.js';
import { checkRemindersForUser } from '../services/reminderScheduler.js';

// @desc    Get all notifications for the authenticated user
// @route   GET /api/notifications
export async function getNotifications(req, res, next) {
  try {
    const userId = req.user._id;

    // Optional on-the-fly reminder check
    if (req.query.sync === 'true') {
      await checkRemindersForUser(userId);
    }

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      user: userId,
      read: false,
    });

    res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Mark a specific notification as read
// @route   PATCH /api/notifications/:id/read
export async function markAsRead(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid notification identifier format.',
      });
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: userId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found or access denied.',
      });
    }

    const unreadCount = await Notification.countDocuments({
      user: userId,
      read: false,
    });

    res.status(200).json({
      success: true,
      message: 'Notification marked as read.',
      unreadCount,
      data: notification,
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Mark all notifications as read for current user
// @route   PATCH /api/notifications/read-all
export async function markAllAsRead(req, res, next) {
  try {
    const userId = req.user._id;

    const result = await Notification.updateMany(
      { user: userId, read: false },
      { read: true }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read.',
      modifiedCount: result.modifiedCount,
      unreadCount: 0,
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Delete a specific notification
// @route   DELETE /api/notifications/:id
export async function deleteNotification(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid notification identifier format.',
      });
    }

    const deleted = await Notification.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found or access denied.',
      });
    }

    const unreadCount = await Notification.countDocuments({
      user: userId,
      read: false,
    });

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully.',
      unreadCount,
      data: deleted,
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Clear all notifications for the user
// @route   DELETE /api/notifications
export async function clearAllNotifications(req, res, next) {
  try {
    const userId = req.user._id;

    await Notification.deleteMany({ user: userId });

    res.status(200).json({
      success: true,
      message: 'All notifications have been cleared.',
      unreadCount: 0,
      data: [],
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Trigger on-demand check for reminders
// @route   POST /api/notifications/check
export async function checkReminders(req, res, next) {
  try {
    const userId = req.user._id;

    await checkRemindersForUser(userId);

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      user: userId,
      read: false,
    });

    res.status(200).json({
      success: true,
      message: 'Reminders checked successfully.',
      count: notifications.length,
      unreadCount,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
}
