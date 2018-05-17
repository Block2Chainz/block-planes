

module.exports.serverp1Ready = ({ io, client, room, player }, { netPeer }) => {
    console.log('emitting serverp1 ready');
    client.emit('p1_ready', netPeer);
};

module.exports.serverp2Ready = ({ io, client, room, player }, { netPeer }) => {
    console.log('emitting serverp2 ready');
    client.emit('p2_ready', netPeer);
};

module.exports.serverUpdate = ({ client, room }) => {
    console.log('updating');
    client.emit('update', { bullets: room.get('bullets'), 
                            particles: room.get('particles'),
                            p1_ship: room.get('p1_ship'), 
                            p2_ship: room.get('p2_ship'),
                            enemies: room.get('enemies'),                     
                        });
};

module.exports.serverShipGeneration = ({ client, room, player }, payload) => {
    if (payload.ship1) {
        client.emit('ship1', payload.ship1);
    } else if (payload.ship2) {
        client.emit('ship2', payload.ship2);
    }
};