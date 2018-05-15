// Rooms: {

//     store: Map {
//         ${roomId}: {
//             id: ${roomId}
//         }
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
