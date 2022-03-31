import Nullstack from 'nullstack';
import { Server } from 'socket.io';
import { io } from 'socket.io-client';
import Chat from '../../components/Chat';
import Sidebar from '../../components/Sidebar';

class DMs extends Nullstack {
  state = {
    socket: null,
    dmList: [],
    messageList: {},
    drawerOpen: false,
    dming: null,
  };

  terminate() {
    this.state.socket?.disconnect();
    this.state.socket?.close();
  }

  async initiate({ params }) {
    const id = params.id;
    if (id) {
      const dm = await this.getDmById({ id });
      this.state.dming = dm;
      this.state.messageList[dm.id] = dm.messages;
    }
  }

  createSocket({ user }) {
    if (this.state.socket) return;

    const socket = io({ path: '/dms' });

    socket.on(user.id, (payload) => {
      if (!this.state.messageList[payload.dmId])
        this.state.messageList[payload.dmId] = [];
      this.state.messageList[payload.dmId].push(payload);
    });

    this.state.socket = socket;
  }

  async hydrate() {
    try {
      const user = JSON.parse(sessionStorage.getItem('user'));
      this.createSocket({ user });
      this.state.dmList = await this.getDMs({ userId: user.id });
      await this.listenDMs({ userId: user.id });
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
          some: {
            id: userId,
          },
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
      include: {
        author: { select: { id: true, username: true, avatar: true } },
      },
    });
  }

  static async listenDMs(context) {
    if (context.dmIO) return;
    const ws = new Server(context.server, { path: '/dms' });
    ws.on('connect', (socket) => {
      console.log(`New DM connection: ${socket.id}`);
      socket.on(
        'dm',
        ({ id, dmId, author, text, audio, attachment, createdAt, to }) => {
          const message = { text, audio, attachment };
          ws.emit(to, {
            id,
            ...message,
            author,
            dmId,
            createdAt: new Date(createdAt),
          });
        }
      );
    });
    /*({ dmId, to, from, message }) => {
        ws.emit(to, { dmId, from, message });
      });
    });*/
    context.dmIO = ws;
  }

  handleOpenDrawer() {
    this.state.drawerOpen = true;
  }

  handleCloseDrawer() {
    this.state.drawerOpen = false;
  }

  async handleSelectDM({ dm }) {
    this.state.dming = dm;
    this.state.messageList[dm.id] = await this.getDmById({ id: dm.id }).then(
      ({ messages }) => messages
    );
  }

  async handleSendDM({ message, user: me }) {
    const to = this.state.dming?.users.find((user) => user.id !== me.id)?.id;
    // const from = me.id;
    const createdMessage = await this.createDmMessage({
      message,
      dm: this.state.dming,
    });

    this.state.socket.emit('dm', { ...createdMessage, to });
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
            messageList={this.state.messageList[this.state.dming.id]}
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
