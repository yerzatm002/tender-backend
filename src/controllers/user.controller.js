const prisma = require('../prisma/client');

exports.getAllUsers = async (req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true }
  });
  res.json(users);
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, createdAt: true }
  });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
};

exports.updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const updated = await prisma.user.update({
    where: { id },
    data: { role }
  });
  res.json({ message: 'Role updated', user: updated });
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  await prisma.user.delete({ where: { id } });
  res.json({ message: 'User deleted' });
};
