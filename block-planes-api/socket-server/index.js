import http from 'http';
import SocketIo from 'socket.io';

import Rooms from './rooms';
import clientEvents from './clientEvents';

const server = http.createServer();
const io = SocketIo(server);
const rooms = new Rooms(io);

io.on('connection', (client) => {
    success('client connected');
    const { roomId, player } = client.handshake.query;
    const room = rooms.findOrCreate(roomId || 'default');
    client.join(room.get('id'));

    each(clientEvents, (handler, event) => {
        client.on(event, handler.bind(null, { io, client, room, player }));
    });
});

const PORT = process.env.PORT || 4155;
server.listen(PORT, () => success(`socket server listening on port ${PORT}`));
