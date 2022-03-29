import Nullstack from 'nullstack';
import Application from './src';

const context = Nullstack.start(Application);

context.start = async function start() {
  // https://nullstack.app/application-startup
}

export default context;
