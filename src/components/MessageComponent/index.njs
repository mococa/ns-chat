// External
import Nullstack from 'nullstack';
import { createAvatar } from '../../helpers/createAvatar';

// Helpers
import { formatDate } from '../../helpers/formatDate';

// Styles
import './styles.scss';

class MessageComponent extends Nullstack {
  // On First Render
  hydrate({ self }) {
    const message = self.element;
    // Todo: Only scroll if user's scroll is 100% on bottom
    message.scrollIntoView({ behavior: 'smooth' });
  }

  render({ author, text, at, audioSrc, attachment }) {
    return (
      <div class="message">
        <img src={createAvatar(author.avatar)} alt={author.username} />
        <div class="message-content">
          <strong>
            {author.username}
            <span class="message-time">{formatDate(at)}</span>
          </strong>
          <span>{text}</span>
          {audioSrc && <audio controls src={audioSrc} />}
          {attachment && (
            <a href={attachment} target="_blank" rel="noopener noreferrer">
              Attachment
            </a>
          )}
        </div>
      </div>
    );
  }
}

export default MessageComponent;
