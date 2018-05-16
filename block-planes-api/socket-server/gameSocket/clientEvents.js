const axios = require('axios');
const {
    //  serverInitialState,
     serverp1Ready,
     serverp2Ready,
     serverUpdate,
} = require('./serverEvents');

const clientp1Ready = ({ io, client, room, player }, { ship }) => {
    room.set( 'p1_ship', ship );
    console.log('p1_ready heard', room, 'payload.ship: ', ship);
    serverp1Ready({ io, client, room, player }, { ship });
};

const clientp2Ready = ({ io, client, room, player}, { ship }) => {
    room.set( 'p2_ship', ship )
    console.log('p2_ready heard', io, client, room, player, 'payload.ship: ', payload.ship);
    serverp2Ready({ io, client, room, player }, payload);
};

const clientUpdate = ({ io, client, room, player }, payload) => {
    console.log( 'update heard', room, 'player', player, 'ship', payload.ships, 'enemies', payload.enemies, 'particles', payload.particles, 'bullets', payload.bullets);
    room.set('ships', payload.ships),
    room.set('enemies', payload.enemies),
    room.set('bullets', payload.bullets),
    room.set('particles', payload.particles),
    serverUpdate({ io, client, room, player }, payload);
}

const clientStart = ({ io, client, room, player }, payload) => {
    // Update the bullets 60 times per frame and send updates 
    const ServerGameLoop = (room) => {
        update(room, 'bullets');
        update(room, 'ships');
        update(room, 'particles');
        update(room, 'enemies');
        serverUpdate({ io, client, room, player });
    }
    setInterval(ServerGameLoop, 16);
}

const update = (room, type) => {
    let array = room.get(type);
    // look at every item and update their positions
    for (var i = 0; i < array.length; i++) {
        var item = array[i];
        item.position.x += item.velocity.x;
        item.position.y += item.velocity.y;
        
        if (array.length === 0 && type === 'enemies') {
            // generate enemies
        }

        // delete the item if it is destroyed
        if (array[i].delete) {
            array[i].splice(i, 1);
        }

        // check collisions
        // this.checkCollisionsWith(this.bullets, this.enemies);
        // this.checkCollisionsWith(this.ship, this.enemies);


        // check for the different types for when they go too far off screen
        // Remove if it goes too far off screen 
        if (bullet.x < -10 || bullet.x > 1000 || bullet.y < -10 || bullet.y > 1000) {
            bullet_array.splice(i, 1);
            i--;
        }
    }
    array = null;
}   

checkCollisionsWith(items1, items2) {
    // loop through each item in one array, compare to each item in second array
    let a = items1.length - 1;
    let b;
    for (a; a >= 0; a--) {
        b = items2.length - 1;
        for (b; b >= 0; b--) {
            let item1 = items2[a];
            let item2 = items2[b];
            if (this.checkCollision(item1, item2)) {
                // destroy if a collision is detected
                item1.destroy();
                item2.destroy();
            }
        }
    }
}

const clientEmitters = {
    'p1_ready': clientp1Ready,
    'p2_ready': clientp2Ready,
    'start' : clientStart,
    'update': clientUpdate,
    'keys' : clientKeys, 
};

module.exports = clientEmitters;
