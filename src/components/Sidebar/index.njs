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
import { changeUrl } from '../../helpers/changeUrl';

class Sidebar extends Nullstack {
  // Handlers
  handleCreateRoom({ onCreateRoom }) {
    const roomName = prompt('New temporary room\nEnter room name:');
    if (roomName) onCreateRoom({ roomName });
  }

  handleLogoff({ router }) {
    sessionStorage.removeItem('user');
    router.path = '/';
  }

  renderRooms({ rooms, onCreateRoom, onChangeRoom, selectedRoom }) {
    return (
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
        <a class="text-button" href="/dm">
          Direct Messages
        </a>
      </div>
    );
  }

  renderDMItem({ dm, user: me, onSelectDM }) {
    const dming = dm?.users.find((user) => user.id !== me.id);
    return (
      <div
        class="dm-item text-button"
        href={`/dm/${dm.id}`}
        onclick={() => {
          changeUrl(dm.id, `/dm/${dm.id}`);
          onSelectDM({ dm });
        }}
        default={false}
      >
        <img src={createAvatar(dming.avatar)} />
        <span>{dming.username}</span>
      </div>
    );
  }

  renderPeople({ people }) {
    return (
      <div class="people rooms">
        <header>
          <b>Direct Messages</b>
        </header>
        <div class="people-list room-list">
          {people.map((dm) => (
            <DMItem dm={dm} />
          ))}
        </div>

        <a class="create-secret-room-button text-button" href="/chat">
          Rooms
        </a>
      </div>
    );
  }

  render({ rooms, people, drawerOpen, onCloseDrawer, user }) {
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

        {rooms && <Rooms />}
        {people && <People />}

        <button class="text-button logout" onclick={this.handleLogoff}>
          Logout
        </button>
      </aside>
    );
  }
}

export default Sidebar;
