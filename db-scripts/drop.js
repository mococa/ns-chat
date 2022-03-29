/* eslint-disable no-undef */
const { PrismaClient } = require('@prisma/client');

const tables = ['user', 'room', 'message'];

const drop = async () => {
  const prisma = new PrismaClient();

  try {
    for (const table of tables) {
      await prisma[table].deleteMany({});
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  } finally {
    //await prisma.disconnect();
  }
};

drop();
