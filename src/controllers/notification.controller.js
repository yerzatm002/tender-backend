const prisma = require('../prisma/client');

exports.getNotifications = async (req, res) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' }
  });
  res.json(notifications);
};

exports.markAsRead = async (req, res) => {
  const { id } = req.params;

  const notification = await prisma.notification.findUnique({ where: { id } });

  if (!notification || notification.userId !== req.user.id) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const updated = await prisma.notification.update({
    where: { id },
    data: { read: true }
  });

  res.json({ message: 'Marked as read', notification: updated });
};
