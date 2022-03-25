export const mapMessages = (messageList, room, id) =>
  messageList[room]?.map((message) => {
    if (message.author.name === id) message.author.name = 'Me';
    return message;
  }) || [];
