import { Server } from 'socket.io';

export const createWebsocketsServer = async (context) => {
  if (context.io) return;
  const ws = new Server(context.server, { cors: { origin: '*' } }); // Todo: Change origin on deployed app
  context.io = ws;
};
