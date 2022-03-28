// External
import Nullstack from 'nullstack';

// Components
import MessageComponent from '../MessageComponent';

// Styles
import './styles.scss';

class MessageList extends Nullstack {
  // Renders
  renderMessage({ author, text, at, audioSrc, attachment }) {
    return (
      <MessageComponent
        author={author}
        text={text}
        at={at}
        audioSrc={audioSrc}
        attachment={attachment}
      />
    );
  }

  render({ messageList }) {
    return (
      <div class="messages-container">
        {messageList.map(({ author, createdAt, text, audio, attachment }) => (
          <Message
            author={author}
            text={text}
            at={createdAt}
            audioSrc={audio}
            attachment={attachment}
          />
        ))}
      </div>
    );
  }
}

export default MessageList;
