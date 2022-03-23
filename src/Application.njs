import Nullstack from 'nullstack';
import './Application.scss';

import Home from './pages/Home';
import Chats from './pages/Chats';

class Application extends Nullstack {
  prepare({ page }) {
    page.locale = 'en-US';
    page.title = 'Chat App';
    page.description = 'Nullstack Chat App';
  }

  renderHead() {
    return <head></head>;
  }

  render() {
    return (
      <>
        <Head />
        <main>
          <Home route="/" />
          <Chats route="/chat/:room" />
        </main>
      </>
    );
  }
}

export default Application;
