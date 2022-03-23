import Nullstack from 'nullstack';
import { Server } from 'socket.io';
import { io } from 'socket.io-client';

// Components
import Chat from '../../components/Chat';
import Sidebar from '../../components/Sidebar';
import { createWebsocketsServer } from '../../helpers/createWsServer';

// Styles
import './styles.scss';

//const socket = io('http://localhost:3000/');

class ChatsPage extends Nullstack {
  state = {
    rooms: [],
    socket: null,
    messageList: [],
    selectedRoom: 'General',
  };

  terminate() {
    this.state.socket?.disconnect();
    this.state.socket?.close();
  }

  async clientJoinRoom({ room }) {
    this.state.messageList = [];
    this.state.selectedRoom = room;

    const socket = this.state.socket;

    socket.emit('join room', room);

    socket.on('new message', (message) => {
      this.state.messageList.push(message);
    });

    socket.on('new room', (roomName) => {
      this.state.rooms.push(roomName);
    });

    socket.on('joined', (messages) => {
      this.state.messageList = messages;
    });

    await this.joinRoom({ roomName: room });
    window.history.pushState(room, 'Chat', `/chat/${room}`);
  }

  initiate({ params }) {
    this.state.selectedRoom = params.room;
  }

  async hydrate() {
    const socket = io('http://localhost:3000');
    this.state.socket = socket;
    const rooms = await this.getRooms();
    this.state.rooms = rooms;
    await this.clientJoinRoom({ room: this.state.selectedRoom });
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
        socket.emit(
          'joined',
          context.messageList[room]?.map((message) => {
            if (message.author.name === socket.id) message.author.name = 'Me';
            return message;
          }) || []
        );
      });

      socket.on('create room', (room) => {
        socket.broadcast.emit('new room', room);
      });

      socket.on('send message', ({ message, room }) => {
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

  render() {
    return (
      <div class="page-container">
        <Sidebar
          rooms={this.state.rooms}
          selectedRoom={this.state.selectedRoom}
          onChangeRoom={this.handleChangeRoom}
          onCreateRoom={this.handleCreateRoom}
        />
        <Chat
          username={this.state.socket?.id}
          messageList={this.state.messageList}
          onSendChat={(payload) => {
            this.state.socket.emit(`send message`, {
              message: payload,
              room: this.state.selectedRoom,
            });
          }}
        />
      </div>
    );
  }
}

export default ChatsPage;
