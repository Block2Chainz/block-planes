const axios = require('axios');
const {
    //  serverInitialState,
     serverp1Ready,
     serverp2Ready,
     serverUpdate,
     serverShipGeneration
} = require('./serverEvents');

const {
    update, 
    randomNumBetween,
    create,
    accelerate,
    ServerGameLoop,
    randomNumBetweenExcluding,
} = require('./game/helpers.js');

const World = require('./game/world.js');

/*****************************************
CLIENT LISTENERS BELOW
*****************************************/

const clientp1Ready = ({ io, client, room, player }, { ship }) => {
    console.log('p1_ready heard', room, 'payload.ship: ', ship);
    if (room.world) {
        room.world.connect(1, ship);
    } else {
        room.world = new World();
        room.world.connect(1, ship);
    }
    let netPeer = room.world.buildPeerNetObject(player);
    serverp1Ready({ io, client, room, player }, { netPeer });
};

const clientp2Ready = ({ io, client, room, player}, { ship }) => {
    console.log('p2_ready heard', io, client, room, player, 'payload.ship: ', payload.ship);
    if (room.world) {
        room.world.connect(2, ship);
    } else {
        room.world = new World();
        room.world.connect(2, ship);
    }
    let netPeer = world.buildPeerNetObject(player);
    serverp2Ready({ io, client, room, player }, { netPeer });
};

const clientUpdate = ({ io, client, room, player }, payload) => {
    serverUpdate({ io, client, room, player }, payload);
}

const clientStart = ({ io, client, room, player }, payload) => {
    setInterval((room) => ServerGameLoop(room), 16);
}

const clientKeys = ({ io, client, room, player }, { keys }) => {
    console.log('keys', keys);
    room.world.queue.updates.push(keys);
}

const clientShipGeneration = ({ io, client, room, player }, payload) => {
    console.log('ship generation heard');
    serverShipGeneration({ io, client, room, player }, payload);
    room.timer = setInterval( () => room.world.update(io), 1000 / 60 ); 
}

const clientDisconnect = ({ io, client, room, player }) => {
    console.log('Client has disconnected');
    // Remove any queued inputs that are waiting to be processed
    var i = 0;
    while (i < room.world.queue.updates.length) {
        var update = room.world.queue.updates[i];
        if (update.id === player) {
            room.world.queue.updates.splice(i, 1);
        } else {
            i++;
        }
    }
    // Remove client from server and from peer list
    delete(room.world.peers[player]);
    client.disconnect(true);
    if (!room.world.peers['1'] && !room.world.peers['2']) {
        clearInterval(room.timer);
    }
}

const clientEmitters = {
    'p1_ready': clientp1Ready,
    'p2_ready': clientp2Ready,
    'start' : clientStart,
    'update': clientUpdate,
    'keys' : clientKeys, 
    'shipGeneration': clientShipGeneration,
    'disconnect': clientDisconnect,
};

module.exports = clientEmitters;
