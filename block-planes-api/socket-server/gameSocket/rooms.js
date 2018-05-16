// Rooms: {

//     store: Map {
//         
//          ${roomId}: {
//              
//              id: ${roomId},
//              p1_ship: ${ p1_ship attr string }
//              p2_ship: ${ p2_ship attr string }
//                      
//          }
//     }



// }


module.exports = class Rooms {
    constructor(io) {
        this.io = io;
        this.store = new Map();
    }

    findOrCreate(roomId) {
        console.log('creating a room', roomId)
        let room = this.store.get(roomId);
        if (!room) {
            room = new Map();
            room.set('id', roomId);
            this.store.set(roomId, room);
        }
        return room;
    }
}
