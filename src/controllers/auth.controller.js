const bcrypt = require('bcrypt');
const prisma = require('../prisma/client');
const { generateToken } = require('../utils/jwt');

exports.register = async (req, res) => {
  const { email, password, name, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { email, password: hashed, name, role }
    });
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(400).json({ error: 'Email already in use' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = generateToken(user);
  res.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
};

exports.getMe = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, email: true, name: true, role: true }
  });
  res.json(user);
};

exports.updateProfile = async (req, res) => {
  const { name } = req.body;
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { name }
  });
  res.json({ message: 'Profile updated', user });
};

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });

  const match = await bcrypt.compare(oldPassword, user.password);
  if (!match) return res.status(400).json({ error: 'Old password incorrect' });

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: req.user.id },
    data: { password: hashed }
  });
  res.json({ message: 'Password updated' });
};

exports.logout = async (req, res) => {
  // JWT logout обычно на клиенте, но можно просто сообщить:
  res.json({ message: 'Logged out (client must remove token)' });
};