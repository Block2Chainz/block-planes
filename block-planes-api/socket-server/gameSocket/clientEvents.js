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
        room.world.powerUpCountdown();
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
        room.world.powerUpCountdown();
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
    // setInterval((room) => ServerGameLoop(room), 16);
}

const clientMove = ({ io, client, room, player }, positionData) => {
    room.world.queue.updates.push(positionData);
    io.sockets.in(room).emit('server_state', room.peers)
}

const clientShot = ({ io, client, room, player }, bulletData) => {
    room.world.createBullet(bulletData);
}

const clientParticle = ({ io, client, room, player }, particleData) => {
    room.world.createParticle(particleData);
}

const clientShipGeneration = ({ io, client, room, player }, payload) => {
    room.timer = setInterval( () => room.world.update(io, room), 1000 / 30 ); 
    serverShipGeneration({ io, client, room, player }, payload);
}

const clientDisconnect = ({ io, client, room, player }) => {
    console.log('Client has disconnected');
    clearInterval(room.timer);
    client.disconnect(true);
}

const clientEmitters = {
    'p1_ready': clientp1Ready,
    'p2_ready': clientp2Ready,
    'start' : clientStart,
    'update': clientUpdate,
    'move_player' : clientMove, 
    'player_shot': clientShot,
    'shipGeneration': clientShipGeneration,
    'disconnect': clientDisconnect,
    'particle_generated': clientParticle,
};

module.exports = clientEmitters;
