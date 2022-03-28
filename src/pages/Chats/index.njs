// External
import Nullstack from 'nullstack';
import { Server } from 'socket.io';
import { io } from 'socket.io-client';

// Components
import Chat from '../../components/Chat';
import Sidebar from '../../components/Sidebar';

// Styles
import './styles.scss';

class ChatsPage extends Nullstack {
  // States
  state = {
    user: null,
    rooms: [],
    socket: null,
    messageList: [],
    selectedRoom: '2642d33b-692e-45e8-9d03-c0d3f5f38e31',
    drawerOpen: false,
  };

  // On Unmount
  terminate() {
    this.state.socket?.disconnect();
    this.state.socket?.close();
  }

  // On First Render
  async hydrate(context) {
    try {
      const sessionUser = sessionStorage.getItem('user');
      if (!sessionUser) throw Error('');

      const user = JSON.parse(sessionUser);
      context.user = user;

      const rooms = await this.getRooms();

      this.state.selectedRoom = rooms.find(
        (room) => room.id === context.params.room
      );
      this.state.user = user;
      this.state.rooms = rooms;

      await this.handleClientJoinRoom({ room: this.state.selectedRoom });
    } catch (err) {
      console.error({ err });
      context.router.path = '/';
    }
  }

  // Server-side methods
  static async createRoom({ database, roomName }) {
    const createdRoom = await database.room.create({
      data: {
        name: roomName,
      },
    });
    return createdRoom;
  }

  static async getRooms({ database }) {
    return await database.room.findMany();
  }

  static async getMessages({ database, roomId }) {
    return await database.message.findMany({
      where: { roomId },
      include: { author: { select: { username: true, avatar: true } } },
    });
  }

  static async createMessage({ database, message }) {
    return database.message.create({
      data: message,
      include: { author: { select: { username: true, avatar: true } } },
    });
  }

  static async getRoomMessages({ database, roomId }) {
    const room = await database.room.findUnique({
      where: { id: roomId },
      include: {
        messages: {
          include: { author: { select: { username: true, avatar: true } } },
        },
      },
    });
    return room.messages;
  }

  static async joinRoom(context) {
    const roomName = context.room.name;
    const roomId = context.room.id;

    const messages = await this.getRoomMessages({
      database: context.database,
      roomId,
    });

    if (!context.messageList) context.messageList = {};
    if (!context.messageList[roomName])
      context.messageList[roomName] = messages;

    if (context.io) return;

    const ws = new Server(context.server, { cors: { origin: '*' } }); // Todo: Change origin on deployed app
    ws.on('connect', async (socket) => {
      console.log(`new connection: ${socket.id}`);

      socket.on('join room', (room) => {
        socket.join(room);
        socket.emit('joined', context.messageList[room.name]);
      });

      socket.on('create room', (room, secret) => {
        if (!secret) socket.broadcast.emit('new room', room);
        socket.join(room);
        socket.emit('joined', context.messageList[room.name]);
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
        context.messageList[room.name].push(createdMessage);
        socket.to(room).emit('new message', createdMessage);
      });
    });

    context.io = ws;
  }

  // Handlers
  async handleClientJoinRoom({ room, environment }) {
    this.state.messageList = [];
    this.state.selectedRoom = room;

    const { production } = environment;
    const socket =
      this.state.socket ||
      io(production ? 'https://nschat.ml/' : 'http://192.168.0.2:3000');

    socket.on('new message', (message) => {
      if (this.state.messageList.map(({ id }) => id).includes(message.id))
        return;

      this.state.messageList = [...this.state.messageList, message];
    });

    socket.on('new room', (room) => {
      this.state.rooms.push(room);
    });

    socket.on('joined', (messages) => {
      this.state.messageList = messages;
    });

    await this.joinRoom({ room });

    window.history.pushState(room.id, 'Chat', `/chat/${room.id}`);

    socket.emit('join room', this.state.selectedRoom);

    this.state.socket = socket;
  }

  async handleChangeRoom({ room }) {
    await this.handleClientJoinRoom({ room });
  }

  async handleCreateRoom({ roomName, secret = false }) {
    if (!secret) {
      const createdRoom = await this.createRoom({
        roomName,
      });
      this.state.rooms.push(createdRoom);
      this.state.selectedRoom = createdRoom;
    }
    this.state.socket.emit('create room', roomName, secret);
    await this.handleClientJoinRoom({ room: roomName });
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
          username={this.state.socket?.id}
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
