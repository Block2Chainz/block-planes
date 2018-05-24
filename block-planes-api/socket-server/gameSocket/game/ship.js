const Bullet = require('./Bullet.js');
const Particle = require('./particle.js');
const shipRenderer = require('./shipRenderer.js');
const { rotatePoint, randomNumBetween } = require('./helpers.js');

const Ship = function (args, world) {
    this.id = null;
    this.world = world;
    this.attributes = typeof args === 'number' ? args : parseInt(args);

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

    let attributes = shipRenderer(this.attributes);
    // ship characteristics
    this.bodyColor = attributes.bodyColor;
    this.wingShape = attributes.wingShape;
    this.wingColor = attributes.wingColor;
    this.tailShape = attributes.tailShape;
    this.tailColor = attributes.tailColor;
    this.cockpitShape = attributes.cockpitShape;
    this.cockpitColor = attributes.cockpitColor;
    this.speed = attributes.speed || 0.15; // modify in arguments when called
    this.inertia = attributes.inertia || 0.99; // modify in arguments when called
    this.shootingSpeed = attributes.shootingSpeed || 300; // lower is better
    this.smokeColor = attributes.smokeColor || '#ffffff';

    this.invincible = true;
    this.speedy = false;

    setTimeout(this.makeVulnerable.bind(this), 5000);
    this.powerUp = this.powerUp.bind(this);
} 

Ship.prototype.destroy = function () {
    this.delete = true;
    this.world.lives--;
};

Ship.prototype.powerUp = function (powerUp) {
    if (powerUp.type === 'invincible') {
        let component = this;
        this.invincible = true;
        setTimeout(() => {
            this.makeVulnerable();
        }, 5000);
    } else if (powerUp.type === 'speed') {
        let component = this;
        this.speed += 0.75;
        this.inertia -= 0.05;
        setTimeout(() => {
            this.slowDown();
        }, 10000);
    }
}

Ship.prototype.slowDown = function () {
    this.speed -= 0.75;
    this.inertia += 0.05;
}

Ship.prototype.makeVulnerable = function () {
    this.invincible = false;
}

Ship.prototype.update = function (input) {
    // const dt = 60/1000; // set to client physics refresh rate
    this.position.x = input.x;
    this.position.y = input.y;
    this.rotation = input.rotation; 

// ROTATION
    // if (this.left) this.rotation -= this.rotationSpeed * dt;
    // if (this.right) this.rotation += this.rotationSpeed * dt;

    // if (this.rotation >= 360) {
    //     this.rotation -= 360;
    // }
    // if (this.rotation < 0) {
    //     this.rotation += 360;
    // }

// POSITION
    // this.position.x += this.velocity.x;
    // this.position.y += this.velocity.y;
    // this.velocity.x *= this.inertia;
    // this.velocity.y *= this.inertia;

// BOUNDARIES
    // Roll from one edge to the opposite
    // if (this.position.x > 1000) this.position.x = 0;
    // else if (this.position.x < 0) this.position.x = 1000;
    // if (this.position.y > 1000) this.position.y = 0;
    // else if (this.position.y < 0) this.position.y = 1000;

};

module.exports = Ship;