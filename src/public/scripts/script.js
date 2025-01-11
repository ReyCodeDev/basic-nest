const socket = io();
socket.on('onMessage', (e) => {
  const p = document.createElement('p');
  p.className = 'message';
  p.innerHTML = `<p class="user">${e.user}</p><p>${e.message}</p>`;
  document.getElementById('messages').appendChild(p);
  console.log('Received onMessage', e);
});
document.onkeydown = (e) => {
  if (e.key === 'Enter') {
    const textField = document.getElementById('textfield');
    socket.emit('newMessage', {
      message: textField.value,
      user: 'test',
    });
    textField.value = '';
  }
};
