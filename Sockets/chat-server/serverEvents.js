const startingText = (funcName) => {
    return (`function ${funcName}(input) {
  //YOUR_CODE_HERE
}
`)
};

export const serverInitialState = ({ client, room }, { challenge, player }) => {
    if (!room.get('challenge')) {
        room.set('challenge', challenge);

        room.set('playerOne.text', startingText(challenge.title));
        room.set('playerTwo.text', startingText(challenge.title));

        client.emit('server.initialState', {
            id: client.id,
            playerOneText: room.get('playerOne.text'),
            playerTwoText: room.get('playerTwo.text'),
            challenge,
        });
    } else {
        client.emit('server.initialState', {
            id: client.id,
            playerOneText: room.get('playerOne.text'),
            playerTwoText: room.get('playerTwo.text'),
            challenge: room.get('challenge'),
        });
    }
};