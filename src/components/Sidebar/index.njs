import Nullstack from 'nullstack';
import RoundButton from '../RoundButton';
import Plus from '../../assets/icons/plus';
import { createAvatar } from '../../helpers/createAvatar';
import './styles.scss';
import { v4 } from 'uuid';

class Sidebar extends Nullstack {
  state = {
    user: null
  }

  handleCreateRoom({ onCreateRoom }) {
    const roomName = prompt('New temporary room\nEnter room name:');
    if (roomName) onCreateRoom({ roomName });
  }

  handleLogoff({ user, router }) {
    user = null;
    sessionStorage.removeItem('user');
    router.path = '/'
  }

  render({ selectedRoom, rooms, onChangeRoom, onCreateRoom, drawerOpen, onCloseDrawer, user }) {
    return (
      <aside class="sidebar" aria-hidden={String(!drawerOpen)} onclick={onCloseDrawer}>
        <header class="sidebar-header">
          <img src={createAvatar(user?.avatar || '')} />
          <b>{user?.nickname || ''}</b>
        </header>

        <div class="rooms">
          <header>
            <b>Rooms</b>
            <RoundButton onclick={() => this.handleCreateRoom(onCreateRoom)}>
              <Plus />
            </RoundButton>
          </header>
          <div class="room-list">
            {rooms.map((room) => (
              <div
                class="room text-button"
                onclick={() => onChangeRoom({ room })}
                aria-current={String(room === selectedRoom)}
              >
                {room}
              </div>
            ))}
          </div>
          <button class="text-button create-secret-room-button" onclick={() => onCreateRoom({ roomName: v4(), secret: true })}>
            Create a secret room
          </button>
        </div>

        <button class="text-button logout" onclick={this.handleLogoff}>
          Logout
        </button>
      </aside>
    );
  }
}

export default Sidebar;
