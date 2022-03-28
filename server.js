import { PrismaClient } from '@prisma/client';
import Nullstack from 'nullstack';
import Application from './src';

const context = Nullstack.start(Application);

const { server } = context;
server.port = 3000;
server.maximumPayloadSize = '5mb';
server.cors = {
  origin: '*',
  optionsSuccessStatus: 200
}

context.start = async function start() {
  const prisma = new PrismaClient();
  context.database = prisma;
}

export default context;
