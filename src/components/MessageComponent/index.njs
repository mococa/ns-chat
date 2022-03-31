// External
import Nullstack from 'nullstack';

// Helpers
import { formatDate } from '../../helpers/formatDate';
import { createAvatar } from '../../helpers/createAvatar';

// Styles
import './styles.scss';

class MessageComponent extends Nullstack {
  // States
  state = {
    showPopup: false,
  };

  // On First Render
  hydrate({ self }) {
    const message = self.element;
    // Todo: Only scroll if user's scroll is 100% on bottom
    message.scrollIntoView({ behavior: 'smooth' });
  }

  static async createSendDm({ database, usersIDs }) {
    const dm = await database.dm
      .findMany({
        where: {
          users: { every: { OR: usersIDs.map((id) => ({ id })) } },
        },
      })
      .then((dms) => dms[0]);

    if (dm) return dm;

    return await database.dm.create({
      data: {
        users: { connect: usersIDs.map((id) => ({ id })) },
        messages: {
          create: [
            {
              authorId: usersIDs[1],
              text: 'hey',
            },
          ],
        },
      },
    });
  }

  // Handlers
  handleHidePopup({ clearSelection }) {
    clearSelection();
  }

  async handleCreateDM({ author, user, router }) {
    const dmCreated = await this.createSendDm({
      usersIDs: [author.id, user.id],
    });
    router.path = `/dm/${dmCreated.id}`;
  }

  renderPopup(context) {
    const { author, user } = context;
    const isDM = window.location.pathname.includes('/dm');
    return (
      <div class="message-popup" onclick={this.handleHidePopup}>
        <header>{author.username}</header>
        <footer>
          {author.id !== user.id && !isDM && (
            <button
              onclick={async () => {
                // Handle create dm message
                this.handleCreateDM();
              }}
            >
              Send hi!
            </button>
          )}
        </footer>
      </div>
    );
  }

  render({ author, text, at, audioSrc, attachment, selected, onSelect }) {
    return (
      <div class="message">
        <img
          src={createAvatar(author.avatar)}
          alt={author.username}
          onclick={onSelect}
        />
        <div class="message-content">
          <strong onclick={onSelect}>
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
        {selected && <Popup />}
      </div>
    );
  }
}

export default MessageComponent;
