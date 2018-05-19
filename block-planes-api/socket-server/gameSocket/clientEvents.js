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
    serverp1Ready({ io, client, room, player }, ship);
};

const clientp2Ready = ({ io, client, room, player}, { ship }) => {
    console.log('p2_ready heard', room, 'payload.ship: ', ship);
    if (room.world) {
        room.world.connect(2, ship);
    } else {
        room.world = new World();
        room.world.connect(2, ship);
    }
    serverp2Ready({ io, client, room, player }, ship);
};

const clientUpdate = ({ io, client, room, player }, payload) => {
    serverUpdate({ io, client, room, player }, payload);
}

const clientStart = ({ io, client, room, player }, payload) => {
    setInterval((room) => ServerGameLoop(room), 16);
}

const clientMove = ({ io, client, room, player }, positionData) => {
    room.world.queue.updates.push(positionData);
    // room.peers[positionData.id].position.x = positionData.x;
    // room.peers[positionData.id].position.y = positionData.y;
    // room.peers[positionData.id].rotation = positionData.rotation;
    io.sockets.in(room).emit('server_state', room.peers)
}

const clientShipGeneration = ({ io, client, room, player }, payload) => {
    console.log('ship generation heard');
    room.timer = setInterval( () => room.world.update(io, room), 1000 / 30 ); 
    serverShipGeneration({ io, client, room, player }, payload);
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
    clearInterval(room.timer);
    clearInterval(room.world.update);
    room.timer = null;
    io.disconnect(true);
}

const clientEmitters = {
    'p1_ready': clientp1Ready,
    'p2_ready': clientp2Ready,
    'start' : clientStart,
    'update': clientUpdate,
    'move_player' : clientMove, 
    'shipGeneration': clientShipGeneration,
    'disconnect': clientDisconnect,
};

module.exports = clientEmitters;
