import Nullstack from 'nullstack';
import { v4 } from 'uuid';

import Input from '../../components/Input';

import './styles.scss';

class Home extends Nullstack {
  avatars = [v4()];
  selectedAvatarIndex = 0;

  handleSubmit({ event }) {
    event?.preventDefault();
    const values = {
      ...Object.fromEntries(new FormData(event?.target)),
      avatar: `https://avatars.dicebear.com/api/adventurer/${this.avatars.at(
        this.selectedAvatarIndex
      )}.svg?scale=90&translateY=4`,
    };
  }

  handleGenerateAvatar() {
    if (this.selectedAvatarIndex === this.avatars.length - 1)
      this.avatars.push(v4());
    this.selectedAvatarIndex++;
  }

  handlePreviousAvatar() {
    if (this.selectedAvatarIndex > 0) {
      this.selectedAvatarIndex -= 1;
    }
  }

  render() {
    return (
      <form onsubmit={this.handleSubmit} class="signup-form">
        <img
          onclick={this.handleGenerateAvatar}
          src={`https://avatars.dicebear.com/api/adventurer/${this.avatars.at(
            this.selectedAvatarIndex
            )}.svg?scale=90&translateY=4`}
            />
            <span>Click to generate a new avatar</span>
        {this.selectedAvatarIndex > 0 && (
          <a href="#" onclick={this.handlePreviousAvatar}>
            Previous avatar
          </a>
        )}

        <Input placeholder="Enter a nickname" name="nickname" />
        <button type="submit">Chat now!</button>
      </form>
      // <a href="/chat/General">Go to /chat</a>);
    );
  }
}

export default Home;
