import Nullstack from 'nullstack';
import Application from './src/Application';

//const io = socketIo(server);

const context = Nullstack.start(Application);

const { server } = context;
server.port = 3000;
server.maximumPayloadSize = '5mb';
server.cors = {
  origin: '*',
  optionsSuccessStatus: 200
}

context.start = async function start() {
  // https://nullstack.app/application-startup
}

export default context;
