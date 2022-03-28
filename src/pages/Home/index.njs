// External
import Nullstack from 'nullstack';
import { compare, hash } from 'bcryptjs';
import { v4 } from 'uuid';

// Components
import Input from '../../components/Input';

// Styles
import './styles.scss';

class Home extends Nullstack {
  // States
  state = {
    avatars: [v4()],
    selectedAvatarIndex: 0,
  };

  // Server-side methods
  static async onLogin({ database, values }) {
    const { username, password } = values;
    if (!password || !username)
      return {
        error: {
          message: 'Please, fill all required fields',
          status: 400,
        },
      };
    try {
      const account = await database.user.findUnique({
        where: { username },
      });

      if (!account)
        return {
          error: {
            message: 'Account not found',
            status: 404,
          },
        };

      const samePassword = await compare(password, account.password);
      if (samePassword) {
        delete account.password;
        return account;
      }
    } catch (error) {
      console.error(error.message);
      return {
        error: {
          message: 'Unknown error', // Todo: Provide better error messages
          status: 500,
        },
      };
    }

    return {
      error: {
        message: 'Account not found',
        status: 404,
      },
    };
  }

  static async onCreateAccount({ database, values }) {
    const { username, password, avatar } = values;
    if (!password || !username || !avatar)
      return {
        error: {
          message: 'Please, fill all required fields',
          status: 400,
        },
      };
    const hashedPassword = await hash(password, 10);
    try {
      const createdUser = await database.user.create({
        data: {
          username,
          password: hashedPassword,
          avatar,
        },
      });
      delete createdUser.password;
      return createdUser;
    } catch (err) {
      console.error(err.message);
      return {
        error: {
          message: 'Unknown error', // Todo: Provide better error messages
          status: 500,
        },
      };
    }
  }

  // Handlers
  async handleSignUp({ event, router }) {
    event?.preventDefault();
    const values = {
      ...Object.fromEntries(new FormData(event?.target)),
      avatar: this.state.avatars[this.state.selectedAvatarIndex],
    };
    const createdAccount = await this.onCreateAccount({ values });
    if (createdAccount.error) return alert(createdAccount.error.message);
    sessionStorage.setItem('user', JSON.stringify(createdAccount));
    router.path = '/chat/General';
  }
  async handleLogin({ event, router }) {
    event?.preventDefault();
    const values = Object.fromEntries(new FormData(event?.target));
    const account = await this.onLogin({ values });
    if (account.error) return alert(account.error.message);
    sessionStorage.setItem('user', JSON.stringify(account));
    router.path = '/chat/General';
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

  // Renders
  renderAvatar() {
    return (
      <img
        onclick={this.handleGenerateAvatar}
        src={`https://avatars.dicebear.com/api/adventurer/${
          this.state.avatars[this.state.selectedAvatarIndex]
        }.svg?scale=90&translateY=4`}
      />
    );
  }

  renderPreviousLabel() {
    return (
      this.state.selectedAvatarIndex > 0 && (
        <a href="#" onclick={this.handlePreviousAvatar}>
          Previous avatar
        </a>
      )
    );
  }

  renderCreateAccount() {
    return (
      <form onsubmit={this.handleSignUp} class="signup-form">
        <h2>Create an account</h2>
        <span>Click to generate a new avatar</span>
        <Avatar />
        <PreviousLabel />
        <Input placeholder="Enter a username" name="username" required />
        <Input
          placeholder="Enter a password"
          name="password"
          type="password"
          required
        />
        <button type="submit">Let&apos;s go!</button>
        <div class="already-have-account">
          Already have an account?
          <a href="/">Login now</a>
        </div>
      </form>
    );
  }

  renderLogin() {
    return (
      <form onsubmit={this.handleLogin} class="signup-form">
        <Avatar />
        <h3>Welcome Back!</h3>
        <Input placeholder="Username" name="username" required />
        <Input
          placeholder="Password"
          name="password"
          type="password"
          required
        />
        <button type="submit">Log in</button>
        <a href="/create-account">Register now</a>
      </form>
    );
  }

  render() {
    return (
      <>
        <Login route="/" />
        <CreateAccount route="/create-account" />
      </>
    );
  }
}

export default Home;
