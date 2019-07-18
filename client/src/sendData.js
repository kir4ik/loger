const msDelay = 1000;

const sendData = (socket, event, ...data) => {
  if (socket._reconnection) {
    setTimeout(() => sendData(socket, event, ...data), msDelay);
  } else if (socket.connected) {
    socket.emit(event, ...data);
  }
};

export const sendAfter = ms => (...info) =>
  setTimeout(() => {
    sendData(...info);
  }, ms);

export default sendData;
