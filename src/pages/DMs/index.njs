import Nullstack from 'nullstack';
import Chat from '../../components/Chat';
import Sidebar from '../../components/Sidebar';

class DMs extends Nullstack {
  state = {
    dmList: [],
    messageList: [],
    drawerOpen: false,
    dming: null,
  };

  async initiate({ params }) {
    const id = params.id;
    if (id) {
      const dm = await this.getDmById({ id });
      this.state.dming = dm;
      this.state.messageList = dm.messages;
    }
  }

  async hydrate() {
    try {
      const user = JSON.parse(sessionStorage.getItem('user'));
      this.state.dmList = await this.getDMs({ id: user.id });
    } catch (error) {
      console.error(error);
    }
  }

  static async getDmById({ database, id }) {
    return await database.dm.findUnique({
      where: { id },
      include: {
        users: { select: { id: true, username: true, avatar: true } },
        messages: {
          include: {
            author: {
              select: { id: true, username: true, avatar: true },
            },
          },
        },
      },
    });
  }

  static async getDMs({ database, userId }) {
    return await database.dm.findMany({
      where: {
        users: {
          has: userId,
        },
      },
      include: {
        users: { select: { id: true, username: true, avatar: true } },
        messages: true,
      },
    });
  }

  static async getDmMessages({ database, dmId }) {
    return await database.message.findMany({
      where: {
        dmId,
      },
    });
  }

  static async createDmMessage({ database, message, dm }) {
    return await database.message.create({
      data: {
        authorId: message.authorId,
        text: message.data.text || '',
        audio: message.data.audio || '',
        attachment: message.data.attachment || '',
        dmId: dm.id,
      },
    });
  }

  handleOpenDrawer() {
    this.state.drawerOpen = true;
  }

  handleCloseDrawer() {
    this.state.drawerOpen = false;
  }

  async handleSelectDM({ dm }) {
    this.state.dming = dm;
    this.state.messageList = await this.getDmById({ id: dm.id }).then(
      ({ messages }) => messages
    );
  }

  async handleSendDM({ message }) {
    this.createDmMessage({ message, dm: this.state.dming });
  }

  render() {
    return (
      <div class="page-container">
        <Sidebar
          people={this.state.dmList}
          drawerOpen={this.state.drawerOpen}
          onCloseDrawer={this.handleCloseDrawer}
          onSelectDM={this.handleSelectDM}
        />
        {this.state.dming !== null && (
          <Chat
            currentRoom={this.state.dming}
            messageList={this.state.messageList}
            onSendChat={(message) => {
              this.handleSendDM({ message });
            }}
            drawerOpen={this.state.drawerOpen}
            onOpenDrawer={this.handleOpenDrawer}
            onCloseDrawer={this.handleCloseDrawer}
          />
        )}
      </div>
    );
  }
}

export default DMs;
