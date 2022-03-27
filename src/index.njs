// External
import Nullstack from 'nullstack';

// Pages
import Home from './pages/Home';
import Chats from './pages/Chats';

// Styles
import './styles.scss';

class Application extends Nullstack {
  // On server start
  prepare({ page }) {
    page.locale = 'en-US';
    page.title = 'Chat App';
    page.description = 'Nullstack Chat App';
  }

  // Renders
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
