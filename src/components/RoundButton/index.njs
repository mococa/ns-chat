// External
import Nullstack from 'nullstack';

// Styles
import './styles.scss';

class RoundButton extends Nullstack {
  render({ children, disabled, onclick, primary }) {
    return (
      <button
        class={`round-button${primary ? ' primary' : ''}`}
        disabled={disabled}
        onclick={onclick}
      >
        {children}
      </button>
    );
  }
}

export default RoundButton;
