export const changeUrl = (name, to) =>
  window.history.pushState(name, 'Chat', to);
