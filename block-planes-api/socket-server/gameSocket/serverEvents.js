

module.exports.serverp1Ready = ({ io, client, room, player }, netPeer ) => {
    console.log('emitting serverp1 ready');
    io.sockets.in(room.id).emit('p1_ready', netPeer);
};

module.exports.serverp2Ready = ({ io, client, room, player }, netPeer ) => {
    console.log('emitting serverp2 ready');
    io.sockets.in(room.id).emit('p2_ready', netPeer);
};

module.exports.serverShipGeneration = ({ client, room, player }, payload) => {
    if (payload.ship1) {
        client.emit('ship1', payload.ship1);
    } else if (payload.ship2) {
        client.emit('ship2', payload.ship2);
    }
};