export const formatDate = (strDate = '') => {
  const date = new Date(strDate);

  if (isToday(date))
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  if (isYesterday(date)) return `Yesterday at ${date.toLocaleTimeString()}`;
  return date.toLocaleDateString();
};

export const isToday = (someDate) => {
  const today = new Date();
  return (
    someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
  );
};

export const isYesterday = (someDate) => {
  const today = new Date();
  return (
    someDate.getDate() == today.getDate() - 1 &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
  );
};
