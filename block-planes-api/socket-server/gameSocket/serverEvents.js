// module.exports.serverInitialState = ({ client, room }, { game, player }) => {
    // if (!room.get('game')) {
    //     room.set('game', game);

    //     client.emit('server.initialState', {
    //         id: client.id,
    //         playerOneText: room.get('playerOne.text'),
    //         playerTwoText: room.get('playerTwo.text'),
    //         game,
    //     });
    // } else {
    //     client.emit('server.initialState', {
    //         id: client.id,
    //         playerOneText: room.get('playerOne.text'),
    //         playerTwoText: room.get('playerTwo.text'),
    //         game: room.get('challenge'),
    //     });
    // }
// };

module.exports.serverp1Ready = ({ client, room }, { ship }) => {
    console.log('emitting serverp1 ready', room.get('p1_ship'));
    client.emit('p1_ready', { ship });

};

module.exports.serverp2Ready = ({ client, room }, { ship }) => {
    console.log('emitting serverp2 ready', room.get('p2_ship'));
    client.emit('p2_ready', { ship });
};