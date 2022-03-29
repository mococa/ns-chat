// External
import Nullstack from 'nullstack';
import { v4 } from 'uuid';

// Icons
import Plus from '../../assets/icons/plus';

// Components
import RoundButton from '../RoundButton';

// Helpers
import { createAvatar } from '../../helpers/createAvatar';

// Styles
import './styles.scss';

class Sidebar extends Nullstack {
  // States
  state = {
    user: null,
  };

  // Handlers
  handleCreateRoom({ onCreateRoom }) {
    const roomName = prompt('New temporary room\nEnter room name:');
    if (roomName) onCreateRoom({ roomName });
  }

  handleLogoff({ router }) {
    sessionStorage.removeItem('user');
    router.path = '/';
  }

  render({
    selectedRoom,
    rooms,
    onChangeRoom,
    onCreateRoom,
    drawerOpen,
    onCloseDrawer,
    user,
  }) {
    return (
      <aside
        class="sidebar"
        aria-hidden={String(!drawerOpen)}
        onclick={onCloseDrawer}
      >
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
            {rooms?.map((room) => (
              <div
                class="room text-button"
                onclick={() => onChangeRoom({ room })}
                aria-current={String(room.id === selectedRoom.id)}
              >
                {room.name}
              </div>
            ))}
          </div>
          <button
            class="text-button create-secret-room-button"
            onclick={() => onCreateRoom({ roomName: v4(), secret: true })}
          >
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
