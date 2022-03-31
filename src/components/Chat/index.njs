// External
import Nullstack from 'nullstack';

// Components
import MessageInput from '../MessageInput';
import Messages from '../MessageList';
import RoundButton from '../RoundButton';

// Icons
import Burger from '../../assets/icons/burger';

// Styles
import './styles.scss';
import { v4 } from 'uuid';

class Chat extends Nullstack {
  // States
  state = {
    showingDrawer: false,
  };

  // Handlers
  handleOnSendChat({ messageList, messageData, user }) {
    if (!messageData?.text) {
      if (!messageData?.audio && !messageData?.attachmemt) return;
    }

    const payload = () => ({
      authorId: user.id,
      author: user,
      data: messageData,
    });

    messageList.push({
      id: v4(),
      authorId: user.id,
      author: user,
      text: messageData.text || '',
      audio: messageData.audio || '',
      attachment: messageData.attachment || '',
      createdAt: new Date(),
    });

    return payload();
  }

  // Renders
  renderHeader({ room, onOpenDrawer }) {
    return (
      <header class="chat-header">
        <RoundButton onclick={onOpenDrawer}>
          <Burger />
        </RoundButton>
        <b>{room?.name}</b>
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
