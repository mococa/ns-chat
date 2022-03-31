// External
import Nullstack from 'nullstack';

// Pages
import Home from './pages/Home';
import Chats from './pages/Chats';
import DMs from './pages/DMs';

// Styles
import './styles.scss';

class Application extends Nullstack {
  // On server start
  prepare({ page }) {
    page.locale = 'en-US';
    page.title = 'Chat App';
    page.description = 'Nullstack Chat App';
  }

  // On first render
  async hydrate(context) {
    try {
      if (sessionStorage.getItem('user')) {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (!user?.id) return;
        context.user = user;
        if (context.path === '/') {
          context.path = '/chat';
        }
      }
    } catch (error) {
      console.error(error);
      sessionStorage.removeItem('user');
    }
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
          <Home route="/create-account" />
          <Chats route="/chat/:room" />
          <DMs route="/dm/:id" />
        </main>
      </>
    );
  }
}

export default Application;
