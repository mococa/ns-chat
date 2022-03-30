// Externals
import Nullstack from 'nullstack';

// Icons
import Send from '../../assets/icons/send';

// Components
import RoundButton from '../RoundButton/index.njs';
import { DmMessage } from '../DmMessage';

// Styles
import './styles.scss';

class DmBubble extends Nullstack {
  render() {
    return (
      <div class="dm-bubble">
        <header>
          Someone
          <RoundButton>&#10006;</RoundButton>
        </header>
        <div class="dm-body">
          {Array(40)
            .fill(null)
            .map(() => (
              <>
                <DmMessage text="hey" />
                <DmMessage mine text="hi" />
              </>
            ))}
        </div>
        <div class="dm-input">
          <input placeholder="Start typing..." />
          <RoundButton>
            <Send />
          </RoundButton>
        </div>
      </div>
    );
  }
}

export default DmBubble;
