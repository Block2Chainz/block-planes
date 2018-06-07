require('dotenv').config();
const http = require('http');
const SocketIo = require('socket.io');
const Rooms = require('./rooms');
const { each } = require('lodash');

const clientEvents = require ('./clientEvents');

const server = http.createServer();
const io = SocketIo(server);
const rooms = new Rooms(io);

io.on('connection', (client) => {
    console.log('client connected', client.handshake.query.ship);
    const { roomId, player } = client.handshake.query;
    const room = rooms.findOrCreate(roomId || 'default');
    client.join(room.id);
    
    console.log('', roomId, player)
    io.sockets.in(room.id).emit('connected', { player });

    each(clientEvents, (handler, event) => {
        client.on(event, handler.bind(null, { io, client, room, player }));
    });
});

const PORT = process.env.PORT || 9999;
server.listen(PORT, () => console.log(`socket server listening on port ${PORT}`));
