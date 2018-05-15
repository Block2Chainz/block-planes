import axios from 'axios';

import { success } from './lib/log';
import {
    serverInitialState,
} from './serverEvents';

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
    'clientOne.update': clientOneUpdate,
    'clientTwo.update': clientTwoUpdate,
    'client.disconnect': clientDisconnect,
    'client.run': clientRun,
    'client.message': clientMessage,
};

export default clientEmitters;
