import Nullstack from 'nullstack';

class Burger extends Nullstack {
  render() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1rem"
        height="1rem"
        viewBox="0 0 16 16"
        version="1.1"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
      >
        <path d="m2.75 12.25h10.5m-10.5-4h10.5m-10.5-4h10.5" />
      </svg>
    );
  }
}

export default Burger;
