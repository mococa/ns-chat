import Nullstack from 'nullstack';

import './styles.scss';

class Input extends Nullstack {
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
