import Nullstack from 'nullstack';
import { Server } from 'socket.io';
import io from 'socket.io-client';
import { v4 } from 'uuid';
import { createAvatar } from '../../helpers/createAvatar';

// Components
import MessageInput from '../MessageInput';
import Messages from '../MessageList';

// Styles
import './styles.scss';

//const createSocket = io('http://localhost:3000/');

class Chat extends Nullstack {
  handleOnSendChat({ messageList, messageData, username }) {
    if (!messageData?.message) {
      if (!messageData?.audio && !messageData?.file) return;
    }

    const payload = (local) => ({
      author: {
        name: local ? 'Me' : username,
        img: createAvatar(username),
      },
      data: messageData,
      at: String(new Date()),
      id: v4()
    });

    messageList.push(payload(true));
    return payload();
  }

  render({ username, onSendChat, messageList }) {
    return (
      <main class="chat-container">
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
