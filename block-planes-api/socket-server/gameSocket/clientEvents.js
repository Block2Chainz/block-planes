const axios = require('axios');
const {
    //  serverInitialState,
     serverp1Ready,
     serverp2Ready,
     serverUpdate,
} = require('./serverEvents');

const {
    update, 
    randomNumBetween,
    create,
    accelerate,
    ServerGameLoop,
    randomNumBetweenExcluding,

} = require('./game/helpers.js');

/*****************************************
CLIENT LISTENERS BELOW
*****************************************/
let timer;

const clientp1Ready = ({ io, client, room, player }, { ship }) => {
    console.log('p1_ready heard', room, 'payload.ship: ', ship);
    serverp1Ready({ io, client, room, player }, { ship });
};

const clientp2Ready = ({ io, client, room, player}, { ship }) => {
    console.log('p2_ready heard', io, client, room, player, 'payload.ship: ', payload.ship);
    serverp2Ready({ io, client, room, player }, payload);
};

const clientUpdate = ({ io, client, room, player }, payload) => {
    serverUpdate({ io, client, room, player }, payload);
}

const clientStart = ({ io, client, room, player }, payload) => {
    setInterval((room) => ServerGameLoop(room), 16);
}

const clientKeys = ({ io, client, room }, { player, keys }) => {
    let ship = player === 1 ? room.get('p1_ship') : room.get('p2_ship');
    
    if (keys.up) {
        ship = accelerate(room, ship);
    }
    if (keys.left) {
        ship.rotation -= ship.rotationSpeed;
        // ship.rotate('LEFT');
    }
    if (keys.right) {
        ship.rotation += ship.rotationSpeed;
        // ship.rotate('RIGHT');
    }
    if (keys.space && Date.now() - ship.lastShot > ship.shootingSpeed) {
        const bullet = new bullet({ ship });
        create(room, bullet, 'bullets');
        // let bullets = room.get('bullets');
        // bullets.push(bullet);
        // room.set('bullets', bullet);
        ship.lastShot = Date.now();
    }
    room.set(`p${player}_ship`, ship);
    ship = null;
}

const clientShipGeneration = ({ io, client, room, player }, payload) => {
    if (payload.ship1) {
        room.set('p1_ship', payload.ship1);
    }
    if (payload.ship2) {
        room.set('p2_ship', payload.ship2);
    }

    const updater = () => {
        ServerGameLoop({ io, client, room, player });
    }

    timer = setInterval( updater, 16 );
}

const clientDisconnect = ({ io, client, room, player }) => {
    console.log('disconnecting', client.disconnect);
    clearInterval(timer);
    client.disconnect();
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
