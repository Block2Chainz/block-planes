module.exports.serverInitialState = ({ client, room }, { game, player }) => {
    if (!room.get('game')) {
        room.set('game', game);

        client.emit('server.initialState', {
            id: client.id,
            playerOneText: room.get('playerOne.text'),
            playerTwoText: room.get('playerTwo.text'),
            game,
        });
    } else {
        client.emit('server.initialState', {
            id: client.id,
            playerOneText: room.get('playerOne.text'),
            playerTwoText: room.get('playerTwo.text'),
            game: room.get('challenge'),
        });
    }
};