const axios = require('axios');
const {
    //  serverInitialState,
     serverp1Ready,
     serverp2Ready,
} = require('./serverEvents');

/**
 *
 *  Client emissions (server listeners)
 *
 *  more on socket emissions:
 *  @url {https://socket.io/docs/emit-cheatsheet/}
 *
 *  @param room is an ES6 Map, containing { id, state }
 *  @url {https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map}
 *
 */

const clientp1Ready = ({ io, client, room, player }, { ship }) => {
    room.set( 'p1_ship', ship );
    console.log('p1_ready heard', room, 'payload.ship: ', ship);
    serverp1Ready({ io, client, room, player }, { ship });
};

const clientp2Ready = ({ io, client, room, player}, payload) => {
    room.set( 'p2_ship', payload.ship )
    console.log('p2_ready heard', io, client, room, player, 'payload.ship: ', payload.ship);
    serverp2Ready({ io, client, room, player }, payload);
};

const clientEmitters = {
    'p1_ready': clientp1Ready,
    'p2_ready': clientp2Ready,
};

module.exports = clientEmitters;
