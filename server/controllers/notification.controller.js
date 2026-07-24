import prisma from '../lib/prisma.js';

const fmt = (obj) => obj ? { ...obj, _id: obj.id } : null;

export const getNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    res.json(notifications.map(fmt));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await prisma.notification.findFirst({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    const updated = await prisma.notification.update({
      where: { id: req.params.id },
      data: { status: 'read' }
    });
    res.json(fmt(updated));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user.id, status: 'unread' },
      data: { status: 'read' }
    });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notification = await prisma.notification.findFirst({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    await prisma.notification.delete({ where: { id: req.params.id } });
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const clearAllNotifications = async (req, res) => {
  try {
    await prisma.notification.deleteMany({ where: { userId: req.user.id } });
    res.json({ message: 'All notifications cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Utility function to create notifications (internal use)
export const createNotification = async ({ userId, user, title, description, type, link, metadata }) => {
  try {
    const targetUserId = userId || user;
    if (!targetUserId) return null;

    const notification = await prisma.notification.create({
      data: {
        userId: targetUserId,
        title,
        description,
        type: type || 'system',
        link: link || null,
        metadata: metadata || null,
      }
    });

    // Broadcast live over WebSocket instantly!
    if (global.io) {
      global.io.emit('notification_received', {
        ...notification,
        _id: notification.id
      });
    }
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};
