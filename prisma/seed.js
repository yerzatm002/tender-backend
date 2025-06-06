const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('12345678', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Админ',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN'
    }
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      name: 'Заказчик',
      email: 'customer@example.com',
      password: hashedPassword,
      role: 'CUSTOMER'
    }
  });

  const supplier = await prisma.user.upsert({
    where: { email: 'supplier@example.com' },
    update: {},
    create: {
      name: 'Поставщик',
      email: 'supplier@example.com',
      password: hashedPassword,
      role: 'SUPPLIER'
    }
  });

  console.log('✅ Seed completed:', { admin, customer, supplier });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
