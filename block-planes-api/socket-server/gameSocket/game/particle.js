module.exports = class Particle {
    constructor(args) {
        this.position = args.position
        this.velocity = args.velocity
        this.radius = args.size;
        this.lifeSpan = args.lifeSpan;
        // added inertia argument so it can be modified
        this.inertia = 0.98;
        // added color argument so it can be modified
        this.color = args.color || '#ffffff';
        this.render = (state) => {
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

            // Draw
            const context = state.context;
            context.save();
            context.translate(this.position.x, this.position.y);
            context.fillStyle = this.color;
            context.lineWidth = 2;
            context.beginPath();
            context.moveTo(0, -this.radius);
            context.arc(0, 0, this.radius, 0, 2 * Math.PI);
            context.closePath();
            context.fill();
            context.restore();

        }
    }
}
