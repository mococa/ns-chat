// External
import Nullstack from 'nullstack';
import { Server } from 'socket.io';
import { io } from 'socket.io-client';

// Components
import Chat from '../../components/Chat';
import Sidebar from '../../components/Sidebar';

// Helpers
import { changeUrl } from '../../helpers/changeUrl';

// Styles
import './styles.scss';

class ChatsPage extends Nullstack {
  // States
  state = {
    user: null,
    rooms: [],
    socket: null,
    messageList: [],
    selectedRoom: null,
    drawerOpen: false,
  };

  // On Unmount
  terminate() {
    this.state.socket?.disconnect();
    this.state.socket?.close();
  }

  async initiate() {
    await this.getIntoRoomByUrl();
  }

  async getIntoRoomByUrl(context) {
    const id = context.params?.room;
    console.log(`[${new Date().toLocaleTimeString()}] fetching room by url...`);
    const room = id
      ? await this.findRoom({ id })
      : await this.getRooms().then((rooms) => rooms[0]);
    console.log(
      `[${new Date().toLocaleTimeString()}] visiting ${room.name} by url`
    );
    this.state.selectedRoom = room;
  }

  // On First Render
  async hydrate(context) {
    try {
      const sessionUser = sessionStorage.getItem('user');
      if (!sessionUser) throw Error('');

      const user = JSON.parse(sessionUser);
      context.user = user;

      if (!user) throw new Error('No user');

      const rooms = await this.getRooms();
      this.state.rooms = rooms;

      this.state.user = user;

      await this.handleClientJoinRoom({ room: this.state.selectedRoom });
    } catch (err) {
      console.error({ err });
      context.router.path = '/';
    }
  }

  // Server-side methods
  static async createRoom({ database, roomName, secret = false }) {
    const createdRoom = await database.room.create({
      data: {
        name: secret ? 'Secret Room' : roomName,
        secret,
      },
    });
    return createdRoom;
  }

  static async getRooms({ database }) {
    return await database.room.findMany({ where: { secret: false } });
  }

  static async findRoom({ database, id }) {
    return await database.room.findUnique({ where: { id } });
  }

  static async createMessage({ database, message }) {
    return database.message.create({
      data: message,
      include: {
        author: { select: { id: true, username: true, avatar: true } },
      },
    });
  }

  static async getRoomMessages({ messageList, database, roomId }) {
    const messages = await database.message.findMany({
      take: -20,
      where: { roomId },
      include: {
        author: {
          select: { id: true, username: true, avatar: true },
        },
      },
    });
    if (!messageList)
      messageList = {
        [roomId]: messages,
      };
    return messages;
  }

  static async joinRoom(context) {
    if (!context.messageList) context.messageList = {};
    if (context.io) return;

    const ws = new Server(context.server, {
      path: '/rooms',
      connectTimeout: 1000,
      cors: { origin: '*' },
    }); // Todo: Change origin on deployed app
    ws.on('connect', async (socket) => {
      console.log(`new connection: ${socket.id}`);

      socket.on('join room', async (room) => {
        socket.join(room.id);
        if (!context.messageList[room.id]?.length)
          context.messageList[room.id] = await this.getRoomMessages({
            database: context.database,
            roomId: room.id,
          });
        socket.emit('joined', context.messageList[room.id]);
      });

      socket.on('create room', (room, secret) => {
        if (!secret) socket.broadcast.emit('new room', room);
        socket.join(room.id);
        context.messageList[room.id] = [];
        socket.emit('joined', []);
      });

      socket.on('send message', async ({ message, room }) => {
        if (!message) return console.log('no message to push');
        if (!room) return console.log('no room to send message');

        const createdMessage = await this.createMessage({
          database: context.database,
          message: {
            authorId: message.authorId,
            text: message.data.text || '',
            audio: message.data.audio || '',
            attachment: message.data.attachment || '',
            roomId: room.id,
          },
        });

        context.messageList[room.id]?.push(createdMessage);
        socket.to(room.id).emit('new message', createdMessage);
      });
    });

    context.io = ws;
  }

  // Handlers
  async handleClientJoinRoom({ room }) {
    this.state.messageList = [];

    //const { production } = environment;
    const socket = this.state.socket || io.connect({ path: '/rooms' });

    socket.on('new message', (message) => {
      if (this.state.messageList.map(({ id }) => id).includes(message.id))
        return;

      this.state.messageList = [...this.state.messageList, message];
    });

    socket.on('new room', (room) => {
      if (this.state.rooms.find((_room) => _room.id === room.id)) return;
      this.state.rooms.push(room);
    });

    socket.on('joined', (messages) => {
      this.state.messageList = messages;
    });

    await this.joinRoom({ room });

    changeUrl(room.id, `/chat/${room.id}`);

    socket.emit('join room', this.state.selectedRoom);

    this.state.socket = socket;
  }

  async handleChangeRoom({ room }) {
    this.state.selectedRoom = room;
    await this.handleClientJoinRoom({ room });
  }

  async handleCreateRoom({ roomName, secret = false }) {
    const createdRoom = await this.createRoom({
      roomName,
      secret,
    });

    if (!secret) {
      this.state.socket.emit('create room', createdRoom, secret);

      const rooms = [...this.state.rooms, createdRoom];

      this.state.rooms = [...new Set(rooms.map((room) => room.id))].map((id) =>
        rooms.find((room) => room.id === id)
      );
    }

    this.state.selectedRoom = createdRoom;

    await this.handleClientJoinRoom({ room: createdRoom });
  }

  handleCloseDrawer() {
    this.state.drawerOpen = false;
  }

  handleOpenDrawer() {
    this.state.drawerOpen = true;
  }

  render() {
    return (
      <div class="page-container">
        <Sidebar
          rooms={this.state.rooms}
          selectedRoom={this.state.selectedRoom}
          onChangeRoom={this.handleChangeRoom}
          onCreateRoom={this.handleCreateRoom}
          drawerOpen={this.state.drawerOpen}
          onCloseDrawer={this.handleCloseDrawer}
        />
        <Chat
          currentRoom={this.state.selectedRoom}
          messageList={this.state.messageList}
          onSendChat={(message) => {
            this.state.socket.emit('send message', {
              message,
              room: this.state.selectedRoom,
            });
          }}
          drawerOpen={this.state.drawerOpen}
          onOpenDrawer={this.handleOpenDrawer}
          onCloseDrawer={this.handleCloseDrawer}
        />
      </div>
    );
  }
}

export default ChatsPage;
