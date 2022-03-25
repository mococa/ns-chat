// External
import Nullstack from 'nullstack';

// Styles
import './styles.scss';

class Input extends Nullstack {
  // Handlers
  handleOnSubmit({ event }) {
    if (event.key !== 'Enter') return;
    if (this.onEnter) this.onEnter();
  }

  render(props) {
    this.onEnter = props.onEnter;
    return <input class="input" onkeyup={this.handleOnSubmit} {...props} />;
  }
}

export default Input;
