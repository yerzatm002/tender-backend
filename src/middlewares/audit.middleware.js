const prisma = require('../prisma/client');

module.exports = async (req, res, next) => {
  const userId = req.user?.id;
  if (userId) {
    await prisma.auditLog.create({
      data: {
        userId,
        action: `${req.method} ${req.originalUrl}`
      }
    });
  }
  next();
};
