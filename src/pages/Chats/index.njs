import Nullstack from 'nullstack';
import { Server } from 'socket.io';
import { io } from 'socket.io-client';

// Components
import Chat from '../../components/Chat';
import Sidebar from '../../components/Sidebar';
import { mapMessages } from '../../helpers/mapMessages';

// Styles
import './styles.scss';

//const socket = io('http://localhost:3000/');

class ChatsPage extends Nullstack {
  state = {
    user: null,
    rooms: [],
    socket: null,
    messageList: [],
    selectedRoom: 'General',
    drawerOpen: false
  };

  terminate() {
    this.state.socket?.disconnect();
    this.state.socket?.close();
  }

  async clientJoinRoom({ room, environment }) {
    this.state.messageList = [];
    this.state.selectedRoom = room;

    const { production } = environment;
    const socket = this.state.socket || io(production ? 'https://nschat.ml/' : 'http://192.168.0.2:3000');

    socket.on('new message', (message) => {
      if (this.state.messageList.map(({ id }) => id).includes(message.id)) return;

      this.state.messageList = [...this.state.messageList, message];
    });

    socket.on('new room', (roomName) => {
      this.state.rooms.push(roomName);
    });

    socket.on('joined', (messages) => {
      this.state.messageList = messages;
    });

    await this.joinRoom({ roomName: room });
    window.history.pushState(room, 'Chat', `/chat/${room}`);

    socket.emit('join room', this.state.selectedRoom);

    this.state.socket = socket;
  }

  async initiate({ params }) {
    this.state.selectedRoom = params.room;
  }

  async hydrate(context) {
    try {
      const sessionUser = sessionStorage.getItem('user');
      if (!sessionUser) throw Error('');

      const user = JSON.parse(sessionUser);
      context.user = user;

      const rooms = await this.getRooms();

      this.state.user = user;
      this.state.rooms = rooms;

      await this.clientJoinRoom({ room: this.state.selectedRoom });
    } catch (err) {
      context.router.path = '/'
    }
  }

  static async joinRoom(context) {
    const { roomName } = context;
    if (!context.messageList) context.messageList = {};
    if (!context.messageList[roomName]) context.messageList[roomName] = [];

    if (context.io) return;

    const ws = new Server(context.server, { cors: { origin: '*' } }); // Todo: Change origin on deployed app
    ws.on('connect', (socket) => {
      console.log(`new connection: ${socket.id}`);

      socket.on('join room', (room) => {
        socket.join(room);
        socket.room = room;
        socket.emit('joined', mapMessages(context.messageList, room, socket.id));
      });

      socket.on('create room', (room) => {
        socket.broadcast.emit('new room', room);
        socket.join(room);
        socket.room = room;
        socket.emit('joined', mapMessages(context.messageList, room, socket.id));
      });

      socket.on('send message', ({ message, room }) => {
        if (!message) return console.log('no message to push')
        if (!room) return console.log('no room to send message')

        context.messageList[room].push(message);
        socket.to(room).emit('new message', message);
      });
    });

    context.io = ws;
  }
  static async getRooms(context) {
    if (!context.roomsList) context.roomsList = ['General'];
    return context.roomsList;
  }

  static async createRoom(context) {
    context.roomsList.push(context.roomName);
    return context.roomsList;
  }

  async handleChangeRoom({ room }) {
    await this.clientJoinRoom({ room });
  }

  async handleCreateRoom({ roomName }) {
    const rooms = await this.createRoom({ roomName });
    this.state.rooms = rooms;
    this.state.socket.emit('create room', roomName);
    await this.clientJoinRoom({ room: roomName });
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
