module.exports = class Rooms {
    constructor(io) {
        this.io = io;
        this.store = new Object;
    }
    
    findOrCreate(roomId) {
        let room = this.store[roomId];
        if (!room) {
            console.log('creating a room', roomId)
            room = new Object;
            room.id = roomId;
            this.store[roomId] = room;
        }
        return room;
    }
}

// Rooms: {
//     store: {
//         
//          ${roomId}: {
//              
//                          id: ${roomId},
//                                                
//                      }
//     }
// }