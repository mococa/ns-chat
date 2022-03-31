// External
import Nullstack from 'nullstack';

// Components
import MessageComponent from '../MessageComponent';

// Styles
import './styles.scss';

class MessageList extends Nullstack {
  // States
  state = {
    selectedMessage: null,
  };

  // Handlers
  handleClearSelection() {
    this.state.selectedMessage = null;
  }

  // Renders
  renderMessage({ id, author, text, at, audioSrc, attachment, selected }) {
    return (
      <MessageComponent
        author={author}
        text={text}
        at={at}
        audioSrc={audioSrc}
        attachment={attachment}
        onSelect={() => {
          this.state.selectedMessage = id;
        }}
        clearSelection={this.handleClearSelection}
        selected={selected}
      />
    );
  }

  render({ messageList }) {
    return (
      <div
        class="messages-container"
        onclick={({ event }) => {
          if (
            this.state.selectedMessage &&
            !['strong', 'img'].includes(event.target.localName)
          )
            this.handleClearSelection();
        }}
      >
        {messageList?.map(
          ({ id, author, createdAt, text, audio, attachment }) => (
            <Message
              id={id}
              author={author}
              text={text}
              at={createdAt}
              audioSrc={audio}
              attachment={attachment}
              selected={id === this.state.selectedMessage}
            />
          )
        )}
      </div>
    );
  }
}

export default MessageList;
