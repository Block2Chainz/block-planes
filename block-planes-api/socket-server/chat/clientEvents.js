const axios = require('axios');

const serverInitialState = require('./serverEvents').serverInitialState;

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
const clientReady = ({ io, client, room, player }, payload) => {
    success('client ready heard', io, client, room, player);
    serverInitialState({ io, client, room }, payload);
};


const clientEmitters = {
    'client.ready': clientReady,
};

module.exports = clientEmitters;
