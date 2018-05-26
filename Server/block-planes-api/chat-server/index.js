require('dotenv').config();
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);


// const rooms = new Rooms(io);

io.on('connection', (socket) => {
    socket.on('message', function (data) {
        io.emit('returnmessage', data);
      });
      socket.on('friendRequestSent', function (data) {
        io.emit('returnfriendRequestSent', data);
      });
      socket.on('friendRequestAccepted', function (data) {
        io.emit('returnfriendRequestAccepted', data);
      });
      socket.on('gameInvite', function (data) {
        io.emit('returnGameInvite', data);
      });
});

const PORT = process.env.CHAT_PORT || 4225;
server.listen(PORT, () => console.log(`socket server listening on port ${PORT}`));
