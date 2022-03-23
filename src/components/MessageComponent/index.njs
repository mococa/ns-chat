import Nullstack from 'nullstack';
import { formatDate } from '../../helpers/formatDate';
import './styles.scss';

class MessageComponent extends Nullstack {
  // Front-end run-once method
  hydrate({ self }) {
    const message = self.element;
    // Todo: Only scroll if user's scroll is 100% on bottom
    message.scrollIntoView({ behavior: 'smooth' });
  }

  render({ author, text, at, audioSrc, file }) {
    return (
      <div class="message">
        <img src={author.img} alt={author.name} />
        <div class="message-content">
          <strong>
            {author.name}
            <span class="message-time">{formatDate(at)}</span>
          </strong>
          <span>{text}</span>
          {audioSrc && <audio controls src={audioSrc} />}
          {file && (
            <a href={file} target="_blank" rel="noopener noreferrer">
              Attachment
            </a>
          )}
        </div>
      </div>
    );
  }
}

export default MessageComponent;
