const Queue = require('./queue.js');
const Ship = require('./ship.js');
const Bullet = require('./bullet.js');
const Particle = require('./particle.js');

const World = function () {
    this.peers = new Object;
    this.bullets = []; 
    this.particles = [];
    this.queue = new Queue();
}

World.prototype.connect = function (player, shipAttributes) {
    // Create a new peer for this connection.
    this.peers[player] = new Ship(shipAttributes, this);
    this.peers[player].id = player;
    // Set peer's initial position
    this.peers[player].position.x = player === 1 ? 50 : 100;
    this.peers[player].position.y = player === 1 ? 50 : 100;
};

World.prototype.createBullet = function (args) {
    this.bullets.push(new Bullet(args));
};

World.prototype.createParticle = function (args) {
    this.particles.push(new Particle(args));
};

World.prototype.update = function (io, room) {
    // apply the changes from the players (e.g. shot fired, new positions);
    this.processInputs();
    // update bullets positionings
    for (let i = 0; i < this.bullets.length; i++) {
        if (this.bullets[i].delete) {
            this.bullets.splice(i, 1);
        } else {
            this.bullets[i].update();
        }
    }
    // update particles positionings
    for (let i = 0; i < this.particles.length; i++) {
        if (this.particles[i].delete) {
            this.particles.splice(i, 1);
        } else {
            this.particles[i].update();
        }
    }
    // emit to clients
    let peers = this.buildPeersPacket();
    let bullets = this.buildBulletsPacket();
    let particles = this.buildParticlesPacket();
    io.sockets.in(room.id).emit('server_state', { peers, bullets, particles, timestamp: Date.now() });
};

// Check whether this input seems to be valid (e.g. "make sense" according
// to the physical rules of the World) simply return true for now
World.prototype.validateInput = function (input) {
    if (!this.peers[input.id]) {
        return false;
    } else {
        return true;
    }
};

// Process all pending messages from peers.
World.prototype.processInputs = function () {
    while (true) {
        var update = this.queue.receive();
        if (!update) {
            break;
        }
        // Update the state of the peer, based on its input. *****************************************
        if (this.validateInput(update)) {
            this.peers[update.id].update(update);
            this.peers[update.id].last_processed_input = update.input_sequence_number;
        }
    }
    // for (let id in this.sprites) {
    //     if (this.sprites[id].delete) {
    //         delete this.sprites[key];
    //     };
    //     sprites[id].update();
    // }
};

// Build the object for the given peer id that is to be sent across the network
World.prototype.buildPeerNetObject = function (peer_id) {
    return {
        id: peer_id,
        position: {
            x: this.peers[peer_id].position.x,
            y: this.peers[peer_id].position.y,
        },
        rotation: this.peers[peer_id].rotation,
        last_processed_input: this.peers[peer_id].last_processed_input
    };

};

// Build the state objects to transmit to clients;
World.prototype.buildPeersPacket = function () {
    let obj = new Object;
    for (let id in this.peers) {
        obj[id] = {
            id: id,
            position: {
                x: this.peers[id].position.x,
                y: this.peers[id].position.y,
            },
            rotation: this.peers[id].rotation,
            last_processed_input: this.peers[id].last_processed_input
        };
    }
    return obj;
};

World.prototype.buildBulletsPacket = function () {
    let obj = {
        '1': [], 
        '2': [],
    }
    for (let bullet of this.bullets) {
        obj[bullet.owner].push({
            owner: bullet.owner,
            x: bullet.position.x,
            y: bullet.position.y,
            rotation: bullet.rotation
        });
    }
    return obj;
};

World.prototype.buildParticlesPacket = function () {
    let obj = {
        '1': [],
        '2': [],
    }
    for (let particle of this.particles) {
        obj[particle.owner].push({
            owner: particle.owner,
            x: particle.position.x,
            y: particle.position.y,
            lifeSpan: particle.lifeSpan,
            velocity: particle.velocity,
            size: particle.radius,
            color: particle.color, 
        });
    }
    return obj;
}

module.exports = World;