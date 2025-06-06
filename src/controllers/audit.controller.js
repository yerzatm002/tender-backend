const prisma = require('../prisma/client');

exports.getLogs = async (req, res) => {
  const logs = await prisma.auditLog.findMany({
    include: {
      user: { select: { id: true, email: true, role: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 100
  });

  res.json(logs);
};
