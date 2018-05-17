const Particle = function (args) {
    this.position = args.position
    this.velocity = args.velocity
    this.radius = args.size;
    this.lifeSpan = args.lifeSpan;
    // added inertia argument so it can be modified
    this.inertia = 0.98;
    // added color argument so it can be modified
    this.color = args.color || '#ffffff';
    this.delete = false;
}

Particle.prototype.update = function (state) {
    // Move
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.velocity.x *= this.inertia;
    this.velocity.y *= this.inertia;

    // Shrink
    this.radius -= 0.1;
    if (this.radius < 0.1) {
        this.radius = 0.1;
    }
    if (this.lifeSpan-- < 0) {
        this.delete = true;
    }
}

module.exports = Particle;