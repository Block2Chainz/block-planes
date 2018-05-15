// var app = require('express')();
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);


// const rooms = new Rooms(io);

io.on('connection', (socket) => {
    socket.on('message', function (data) {
        io.emit('returnmessage', data);
      });
});

const PORT = process.env.PORT || 4225;
server.listen(PORT, () => console.log(`socket server listening on port ${PORT}`));