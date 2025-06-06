const prisma = require('../prisma/client');
const sendEmail = require('../utils/mailer');

async function notify({ userId, type = 'SYSTEM', message }) {
  await prisma.notification.create({
    data: { userId, message, type }
  });

  if (type === 'EMAIL') {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    await sendEmail(user.email, 'Tender Notification', message);
  }
}

module.exports = { notify };
