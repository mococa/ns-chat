import Nullstack from 'nullstack';
import { v4 } from 'uuid';

import Input from '../../components/Input';

import './styles.scss';

class Home extends Nullstack {
  state = {
    avatars: [v4()],
    selectedAvatarIndex: 0
  }

  static async handleLogin(ctx) {
  }

  async handleSubmit({ event, router }) {
    event?.preventDefault();
    const values = {
      ...Object.fromEntries(new FormData(event?.target)),
      avatar: `https://avatars.dicebear.com/api/adventurer/${this.state.avatars[this.state.selectedAvatarIndex]
        }.svg?scale=90&translateY=4`,
    };

    sessionStorage.setItem('user', JSON.stringify(values));

    await this.handleLogin({ values });
    router.path = '/chat/General'
  }

  handleGenerateAvatar() {
    if (this.state.selectedAvatarIndex === this.state.avatars.length - 1)
      this.state.avatars.push(v4());
    this.state.selectedAvatarIndex++;
  }

  handlePreviousAvatar() {
    if (this.state.selectedAvatarIndex > 0) {
      this.state.selectedAvatarIndex -= 1;
    }
  }

  render() {
    return (
      <form onsubmit={this.handleSubmit} class="signup-form">
        <img
          onclick={this.handleGenerateAvatar}
          src={`https://avatars.dicebear.com/api/adventurer/${this.state.avatars[
            this.state.selectedAvatarIndex
          ]}.svg?scale=90&translateY=4`}
        />
        <span>Click to generate a new avatar</span>
        {this.state.selectedAvatarIndex > 0 && (
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
