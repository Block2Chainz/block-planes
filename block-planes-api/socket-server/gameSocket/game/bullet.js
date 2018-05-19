const { rotatePoint } = require('./helpers');

const Bullet = function (args) {
    let posDelta = rotatePoint({ x: 0, y: -20 }, { x: 0, y: 0 }, args.ship.rotation * Math.PI / 180);
    this.position = {
        x: args.ship.position.x + posDelta.x,
        y: args.ship.position.y + posDelta.y
    };
    this.rotation = args.ship.rotation;
    this.velocity = { x: posDelta.x * 1.75, y: posDelta.y * 1.75 };
    this.radius = 2;
    this.owner = args.owner;
}

Bullet.prototype.update = function () {
    // Move
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    // Delete if it goes out of bounds
    if (this.position.x < 0 ||
        this.position.y < 0 ||
        this.position.x > 1000 ||
        this.position.y > 1000) {
        this.delete = true;
    }
}

module.exports = Bullet;