

module.exports.serverp1Ready = ({ client, room }, { ship }) => {
    console.log('emitting serverp1 ready', room.get('p1_ship'));
    client.emit('p1_ready', { ship });

};

module.exports.serverp2Ready = ({ client, room }, { ship }) => {
    console.log('emitting serverp2 ready', room.get('p2_ship'));
    client.emit('p2_ready', { ship });
};

module.exports.serverUpdate = ({ client, room }) => {
    console.log('emitting serverUpdate');
    client.emit('update', { bullets: room.bullets, 
                            particles: room.particles,
                            ships: room.ships, 
                            enemies: room.enemies,                     
                        });
};