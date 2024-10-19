const socket = io();
socket.on('onMessage', (e) => {
  console.log('Received onMessage', e);
});
socket.emit('newMessage', {
  message: 'Hello World!',
});
