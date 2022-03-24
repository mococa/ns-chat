import Nullstack from 'nullstack';
import { v4 } from 'uuid';
import { createAvatar } from '../../helpers/createAvatar';

// Components
import MessageInput from '../MessageInput';
import Messages from '../MessageList';
import RoundButton from '../RoundButton';

// Icons
import Burger from '../../assets/icons/burger.njs'

// Styles
import './styles.scss';

//const createSocket = io('http://localhost:3000/');

class Chat extends Nullstack {
  state = {
    showingDrawer: false
  }

  handleOnSendChat({ messageList, messageData, user }) {
    //alert(user.nickname)
    if (!messageData?.message) {
      if (!messageData?.audio && !messageData?.file) return;
    }

    const payload = (local) => ({
      author: {
        name: local ? 'Me' : user?.nickname || JSON.parse(sessionStorage.getItem('user')).nickname,
        img: user?.avatar || JSON.parse(sessionStorage.getItem('user')).avatar,
      },
      data: messageData,
      at: String(new Date()),
      id: v4()
    });

    messageList.push(payload(true));
    return payload();
  }

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

  render({ username, onSendChat, messageList, currentRoom, onOpenDrawer, drawerOpen, onCloseDrawer }) {
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
