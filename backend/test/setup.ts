import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

module.exports = async () => {
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();
};
s