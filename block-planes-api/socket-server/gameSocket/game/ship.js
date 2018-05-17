const Bullet = require('./Bullet.js');
const Particle = require('./particle.js');
const shipRenderer = require('./shipRenderer.js');
const { rotatePoint, randomNumBetween } = require('./helpers.js');

const Ship = function (args) {
    this.id = null;
    this.last_processed_input = null;

    this.up = false;
    this.left = false;
    this.right = false;
    this.shoot = false;

    this.position = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.rotation = 0;
    this.rotationSpeed = 6;
    this.radius = 20;
    this.lastShot = 0;
    this.delete = false;

    let attributes = shipRenderer(args);
    this.speed = attributes.speed || 0.15; // modify in arguments when called
    this.inertia = attributes.inertia || 0.99; // modify in arguments when called
    this.shootingSpeed = attributes.shootingSpeed || 300; // lower is better
    this.smokeColor = attributes.smokeColor || '#ffffff';
} 

Ship.prototype.destroy = function () {
    this.delete = true;

    // generate new 60 new particles in an explosion
    for (let i = 0; i < 60; i++) {
        const particle = new Particle({
            lifeSpan: this.ingame ? randomNumBetween(60, 100) : randomNumBetween(0, 10),
            size: randomNumBetween(1, 4),
            color: this.smokeColor,
            position: {
                x: this.position.x + randomNumBetween(-this.radius / 4, this.radius / 4),
                y: this.position.y + randomNumBetween(-this.radius / 4, this.radius / 4)
            },
            velocity: {
                x: randomNumBetween(-1.5, 1.5),
                y: randomNumBetween(-1.5, 1.5)
            }
        });

        this.create(particle, 'particles');
    }
}

Ship.prototype.update = function (input) {
    const dt = .01; // set to client physics refresh rate
// SHOOTING
    if (input.shoot && Date.now() - this.lastShot > this.shootingSpeed) {
            // doesn't allow rapidly firing as quickly as you can press the spacebar
        const bullet = new Bullet({
            ship: this
        });
        this.create(bullet, 'bullets');
        this.lastShot = Date.now();
        // create bullet
    }
// ACCELERATION
    this.up = input.up;
    this.left = input.left;
    this.right = input.right;

    if (this.up) {
        this.velocity.x -= Math.sin(-this.rotation * Math.PI / 180) * this.speed * dt;
        this.velocity.y -= Math.cos(-this.rotation * Math.PI / 180) * this.speed * dt;
        // Thruster particles
        let posDelta = rotatePoint({ x: 0, y: -55 }, { x: 0, y: 0 }, (this.rotation - 180) * Math.PI / 180);
        const particle = new Particle({
            lifeSpan: randomNumBetween(20, 40),
            size: randomNumBetween(1, 3),
            position: {
                x: this.position.x + posDelta.x + randomNumBetween(-2, 2),
                y: this.position.y + posDelta.y + randomNumBetween(-2, 2)
            },
            color: this.smokeColor,
            velocity: {
                x: posDelta.x / randomNumBetween(3, 5),
                y: posDelta.y / randomNumBetween(3, 5)
            }
        });
        this.create(particle, 'particles');
    };
// ROTATION
    if (this.left) this.rotation -= this.rotationSpeed * dt;
    if (this.right) this.rotation += this.rotationSpeed * dt;

    if (this.rotation >= 360) {
        this.rotation -= 360;
    }
    if (this.rotation < 0) {
        this.rotation += 360;
    }

// POSITION
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.velocity.x *= this.inertia;
    this.velocity.y *= this.inertia;

// BOUNDARIES
    // Roll from one edge to the opposite
    if (this.position.x > 1000) this.position.x = 0;
    else if (this.position.x < 0) this.position.x = 1000;
    if (this.position.y > 1000) this.position.y = 0;
    else if (this.position.y < 0) this.position.y = 1000;

};

module.exports = Ship;