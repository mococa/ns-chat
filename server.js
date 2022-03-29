import { PrismaClient } from '@prisma/client';
import Nullstack from 'nullstack';
import Application from './src';

const context = Nullstack.start(Application);

const { server } = context;
server.port = 3000;
server.maximumPayloadSize = '5mb';
server.cors = {
  origin: '*',
  optionsSuccessStatus: 200,
};

context.start = async function start() {
  const prisma = new PrismaClient();
  const roomsAmount = await prisma.room.count();
  if (!roomsAmount) {
    console.log('Creating General room');
    await prisma.room.create({
      data: {
        id: '2642d33b-692e-45e8-9d03-c0d3f5f38e31',
        name: 'General',
        secret: false,
      },
    });
  }

  context.database = prisma;
};

export default context;
