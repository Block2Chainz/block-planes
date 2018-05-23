const Queue = require('./queue.js');
let { checkCollisionsWith, randomNumBetween } = require('./helpers.js');

const Ship = require('./ship.js');
const Bullet = require('./bullet.js');
const Particle = require('./particle.js');
const Enemy = require('./enemy.js');

const InvincibilityPowerUp = require('./invincibilityPowerUp.js');
const SpeedPowerUp = require('./speedPowerUp.js');

const World = function () {
    this.peers = new Object;
    this.bullets = []; 
    this.particles = [];
    this.powerUps = [];
    this.lives = 10;
    this.scores = { 1: 0, 2: 0 };
    
    this.enemyCount = 1;
    this.enemies = [];
    this.enemyBullets = [];

    this.powerUps = [];
    this.powerUpType = 'speed';

    this.queue = new Queue();
};

World.prototype.connect = function (player, shipAttributes) {
    // Create a new peer for this connection.
    this.peers[player] = new Ship(shipAttributes, this);
    this.peers[player].id = player;
    // Set peer's initial position
    this.peers[player].position.x = player === 1 ? 350 : 375;
    this.peers[player].position.y = 225;
    checkCollisionsWith = checkCollisionsWith.bind(this);
    // this.powerUpCountdown();
};

World.prototype.createObject = function (type, obj) {
    this[type].push(obj);
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
    // update enemies
    for (let i = 0; i < this.enemies.length; i++) {
        if (this.enemies[i].delete) {
            this.enemies.splice(i, 1);
        } else {
            this.enemies[i].update();
        }
    }
    // update enemy bullets
    for (let i = 0; i < this.enemyBullets.length; i++) {
        if (this.enemyBullets[i].delete) {
            this.enemyBullets.splice(i, 1);
        } else {
            this.enemyBullets[i].update();
        }
    }
    // update powerUps
    for (let i = 0; i < this.powerUps.length; i++) {
        if (this.powerUps[i].delete) {
            this.powerUps.splice(i, 1);
        } else {
            this.powerUps[i].update();
        }
    }
    // if there are no enemies
    if (this.enemies.length === 0) {
        this.generateEnemies();
        this.enemyCount++;
    }
    // check collisions 
    checkCollisionsWith(this.peers, this.powerUps, 'powerUps', io.sockets, room.id, this);
    checkCollisionsWith(this.peers, this.enemyBullets, 'enemyBullets', io.sockets, room.id, this);
    checkCollisionsWith(this.peers, this.enemies, 'enemies', io.sockets, room.id, this);
    checkCollisionsWith(this.bullets, this.enemies, undefined, io.sockets, room.id, this);
    
    io.sockets.in(room.id).emit('server_state', this.buildClientObject());

};

World.prototype.generateEnemies = function () {
    for (let i = 0; i < this.enemyCount; i++) {
        this.enemies.push(new Enemy({ type: 'normal' }, this));
    }
    this.enemies.push(new Enemy({ type: 'blast' }, this));
    this.enemies.push(new Enemy({ type: 'master' }, this));
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
        }
    }
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
// Build client object with all game objects
World.prototype.buildClientObject = function () {
    let obj = {
        peers: this.buildPeersPacket(),
        bullets: this.buildBulletsPacket(),
        particles: this.buildParticlesPacket(),
        lives: this.lives,
        scores: this.scores,
        enemies: this.buildEnemiesPacket(),
        powerUps: this.buildPowerUpsPacket(),
    };
    return obj;
};
// Build the ship data object to send to clients;
World.prototype.buildPeersPacket = function () {
    let obj = new Object;
    for (let id in this.peers) {
        if (this.peers[id].position) {
            obj[id] = {
                id: id,
                position: {
                    x: this.peers[id].position.x,
                    y: this.peers[id].position.y,
                },
                rotation: this.peers[id].rotation,
                delete: this.peers[id].delete
            };
        } 
    }
    return obj;
};
// Build the bullets object
World.prototype.buildBulletsPacket = function () {
    let obj = {
        '1': [], 
        '2': [],
        '3': [],
    }
    for (let bullet of this.bullets) {
        obj[bullet.owner].push({
            owner: bullet.owner,
            x: bullet.position.x,
            y: bullet.position.y,
            rotation: bullet.rotation
        });
    }
    for (let bullet of this.enemyBullets) {
        obj[3].push({
            owner: 3, 
            x: bullet.position.x,
            y: bullet.position.y,
            rotation: bullet.rotation,
        });
    }
    return obj;
};
// Build the particles object
World.prototype.buildParticlesPacket = function () {
    let obj = {
        '1': [],
        '2': [],
        '3': [],
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
};
// Build the enemies object
World.prototype.buildEnemiesPacket = function () {
    // build the enemies with their positions, velocity, rotation, rotation speed, radius, score, addscore,
    let arr = [];
    for (let enemy of this.enemies) {
        arr.push({
            x: enemy.position.x, 
            y: enemy.position.y,
            type: enemy.type,
            size: enemy.radius,
            velocity: enemy.velocity,
            rotationSpeed: enemy.rotationSpeed,
            rotation: enemy.rotation,
            delete: enemy.delete,
        })
    }
    return arr;
};
// Build the power ups object
World.prototype.buildPowerUpsPacket = function () {
    // Build the power ups
        let arr = [];
        for (let powerUp of this.powerUps) {
            arr.push({
                x: powerUp.position.x,
                y: powerUp.position.y,
                type: powerUp.type,
            })
        }
        return arr;
    // {x: x, y: y, type: type} 
};
// Generate a power up
World.prototype.generatePowerUp = function () {
    console.log(this.powerUpType);
    let powerUp;
    if (this.powerUpType === 'speed') {
        console.log('creating the object');
        this.powerUpType = 'invincible';
        powerUp = new InvincibilityPowerUp(this);
    } else {
        this.powerUpType = 'speed';
        powerUp = new SpeedPowerUp(this);
    }
    this.powerUps.push(powerUp);
};
// Power up timer
World.prototype.powerUpCountdown = function () {
    let randomNumber = randomNumBetween(10000, 20000)
    setTimeout(() => {
        this.generatePowerUp();
    }, randomNumber);
};
World.prototype.respawnTimer = function (owner, socket, room) {
    setTimeout(() => {
        this.peers[owner].delete = false;
        this.peers[owner].postition = { x: 325, y: 250 };
        this.peers[owner].powerUp({type: 'invincible'});
        socket.in(room).emit('player_respawn', {
            owner, 
            position: {
                x: 0, 
                y: 0,
            }, 
        })
    }, 3000);
};

module.exports = World;