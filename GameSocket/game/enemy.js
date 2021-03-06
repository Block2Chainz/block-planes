const Bullet = require('./bullet.js');
const Particle = require('./particle.js');
const { asteroidVertices, randomNumBetween, randomNumBetweenExcluding, randomNumBetweenExcludingTwoRanges } = require('./helpers.js');

const Enemy = function (args, world) {
    this.type = args.type;
    this.world = world;
    this.delete = false;
    this.health = 1;
    
    this.position = args.position ? args.position: {
        x: randomNumBetweenExcludingTwoRanges(0, this.world.width, this.world.peers['1'].position.x - 60, this.world.peers['1'].position.x + 60, this.world.peers['2'].position.x - 60, this.world.peers['2'].position.x + 60),
        y: randomNumBetweenExcludingTwoRanges(0, this.world.height, this.world.peers['1'].position.y - 60, this.world.peers['1'].position.y + 60, this.world.peers['2'].position.y - 60, this.world.peers['2'].position.y + 60)
    }
    this.rotationSpeed = randomNumBetween(-1, 1);
    this.velocity = {
        x: randomNumBetween(-1, 1),
        y: randomNumBetween(-1, 1)
    }   

    if (args.type === 'normal') {
        // splits into smaller normal ones 
        this.radius = args.size || 80;
    } else if (args.type === 'fast') {
        // moves much faster, is smaller
        this.velocity = {
            x: randomNumBetweenExcluding(-3, 3, -1.5, 1.5),
            y: randomNumBetweenExcluding(-3, 3, -1.5, 1.5)
        }
        this.radius = 35;
    } else if (args.type === 'blast') {
        // shoots and spins around
        this.radius = 75;
        this.rotationSpeed = 1.5;
        this.lastShot = 0;
        this.health = 5;
    } else if (args.type === 'master') {
        // large and slow, but can shoot
        // on death splits into many small ones 
        this.radius = 75;
        this.health = 10;
    }
    this.rotation = 0;
    this.score = (80 / this.radius) * 5;
}

Enemy.prototype.takeDamage = function (owner) {
    this.health--;
    for (let i = 0; i < 7; i++) {
        const particle = new Particle({
            owner: 3,
            lifeSpan: randomNumBetween(60, 100),
            size: randomNumBetween(1, 3),
            position: {
                x: this.position.x + randomNumBetween(-this.radius / 4, this.radius / 4),
                y: this.position.y + randomNumBetween(-this.radius / 4, this.radius / 4)
            },
            velocity: {
                x: randomNumBetween(-1.5, 1.5),
                y: randomNumBetween(-1.5, 1.5)
            }
        });
        this.world.createObject('particles', particle);
    }
    if (this.health <= 0) {
        this.destroy(owner);
    }
}

Enemy.prototype.destroy = function (owner) {
    if (owner !== undefined) {
        this.world.scores[owner] += Math.ceil(this.score);
    } 
    this.delete = true;
    // Explode
    for (let i = 0; i < this.radius; i++) {
        const particle = new Particle({
            owner: 3,
            lifeSpan: randomNumBetween(60, 100),
            size: randomNumBetween(1, 3),
            position: {
                x: this.position.x + randomNumBetween(-this.radius / 4, this.radius / 4),
                y: this.position.y + randomNumBetween(-this.radius / 4, this.radius / 4)
            },
            velocity: {
                x: randomNumBetween(-1.5, 1.5),
                y: randomNumBetween(-1.5, 1.5)
            }
        });
        this.world.createObject('particles', particle);
    }

    if (this.type === 'normal' && this.radius > 35) {
        // Break into smaller enemies
        for (let i = 0; i < 2; i++) {
            let enemy = new Enemy({
                size: this.radius / 2,
                type: 'normal',
                position: {
                    x: this.position.x + randomNumBetween(-this.radius / 4, this.radius / 4),
                    y: this.position.y + randomNumBetween(-this.radius / 4, this.radius / 4)
                },
            }, this.world);
            this.world.createObject('enemies', enemy);
        }
    } else if (this.type === 'master') {
        for (let i = 0; i < 4; i++) {
            let enemy = new Enemy({
                type: 'fast',
                position: {
                    x: randomNumBetween(-10, 20) + this.position.x,
                    y: randomNumBetween(-10, 20) + this.position.y
                },
            }, this.world);
            this.world.createObject('enemies', enemy);
        }
    }
}

Enemy.prototype.update = function () {
    // shoot if you are a blast or master type 
    if ((this.type === 'blast' || this.type === 'master') && Date.now() - this.lastShot > 1500) {
        const bullet = new Bullet({ owner: 3, rotation: this.rotation, position: this.position });
        this.lastShot = Date.now();
        this.world.createObject('enemyBullets', bullet);
    }
    // Move
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    // Rotation
    this.rotation += this.rotationSpeed;
    if (this.rotation >= 360) {
        this.rotation -= 360;
    }
    if (this.rotation < 0) {
        this.rotation += 360;
    }
    // Screen edges
    if (this.position.x > this.world.width + this.radius) this.position.x = -this.radius;
    else if (this.position.x < -this.radius) this.position.x = this.world.width + this.radius;
    if (this.position.y > this.world.height + this.radius) this.position.y = -this.radius;
    else if (this.position.y < -this.radius) this.position.y = this.world.height + this.radius;
}

module.exports = Enemy;