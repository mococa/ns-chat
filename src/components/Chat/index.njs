// External
import Nullstack from 'nullstack';
import { v4 } from 'uuid';

// Helpers
import { createAvatar } from '../../helpers/createAvatar';

// Components
import MessageInput from '../MessageInput';
import Messages from '../MessageList';
import RoundButton from '../RoundButton';

// Icons
import Burger from '../../assets/icons/burger.njs';

// Styles
import './styles.scss';

class Chat extends Nullstack {
  // States
  state = {
    showingDrawer: false,
  };

  // Handlers
  handleOnSendChat({ messageList, messageData, user }) {
    if (!messageData?.message) {
      if (!messageData?.audio && !messageData?.file) return;
    }

    const payload = (local) => ({
      author: {
        name: local
          ? 'Me'
          : user?.nickname ||
            JSON.parse(sessionStorage.getItem('user')).nickname,
        img:
          createAvatar(user?.avatar) ||
          createAvatar(JSON.parse(sessionStorage.getItem('user')).avatar),
      },
      data: messageData,
      at: String(new Date()),
      id: v4(),
    });

    messageList.push(payload(true));
    return payload();
  }

  // Renders
  renderHeader({ room, onOpenDrawer }) {
    return (
      <header class="chat-header">
        <RoundButton onclick={onOpenDrawer}>
          <Burger />
        </RoundButton>
        <b>{room}</b>
      </header>
    );
  }

  render({
    username,
    onSendChat,
    messageList,
    currentRoom,
    onOpenDrawer,
    drawerOpen,
    onCloseDrawer,
  }) {
    return (
      <main class="chat-container" onclick={drawerOpen && onCloseDrawer}>
        <Header room={currentRoom} onOpenDrawer={onOpenDrawer} />
        <Messages messageList={messageList} />
        <MessageInput
          onSend={({ data: messageData }) => {
            const payload = this.handleOnSendChat({
              messageList,
              messageData,
              username,
            });
            onSendChat(payload);
          }}
        />
      </main>
    );
  }
}

export default Chat;
