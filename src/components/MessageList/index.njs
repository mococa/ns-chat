import Nullstack from 'nullstack';
import MessageComponent from '../MessageComponent';

import './styles.scss';

class MessageList extends Nullstack {
  renderMessage({ author, text, at, audioSrc, file }) {
    return (
      <MessageComponent
        author={author}
        text={text}
        at={at}
        audioSrc={audioSrc}
        file={file}
      />
    );
  }

  render({ messageList }) {
    return (
      <div class="messages-container">
        {messageList.map(({ author, data, at }) => (
          <Message
            author={author}
            text={data.message}
            at={at}
            audioSrc={data.audio}
            file={data.file}
          />
        ))}
      </div>
    );
  }
}

export default MessageList;
