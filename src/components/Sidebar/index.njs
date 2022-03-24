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

  render({ selectedRoom, rooms, onChangeRoom, onCreateRoom, drawerOpen, onCloseDrawer, user }) {
    return (
      <aside class="sidebar" aria-hidden={String(!drawerOpen)} onclick={onCloseDrawer}>
        <header class="sidebar-header">
          <img src={user?.avatar} />
          <b>{user?.nickname || ''}</b>
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
