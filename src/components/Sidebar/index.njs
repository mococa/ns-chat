import Nullstack from 'nullstack';
import RoundButton from '../RoundButton';
import Plus from '../../assets/icons/plus';
import { createAvatar } from '../../helpers/createAvatar';
import './styles.scss';

class Sidebar extends Nullstack {
  handleCreateRoom({ onCreateRoom }) {
    const roomName = prompt('New temporary room\nEnter room name:');
    if (roomName) onCreateRoom({ roomName });
  }

  render({ selectedRoom, rooms, onChangeRoom, onCreateRoom }) {
    return (
      <aside class="sidebar">
        <header class="sidebar-header">
          <img src={createAvatar('')} />
          <b>MyKewlNickname</b>
        </header>

        <div class="rooms">
          <header>
            <b>Rooms</b>
            <RoundButton onclick={() => this.handleCreateRoom(onCreateRoom)}>
              <Plus />
            </RoundButton>
          </header>
          {rooms.map((room) => (
            <div
              class="room"
              //href={`/chat/${room}`}
              onclick={() => onChangeRoom({ room })}
              aria-current={String(room === selectedRoom)}
            >
              {room}
            </div>
          ))}
        </div>
      </aside>
    );
  }
}

export default Sidebar;
