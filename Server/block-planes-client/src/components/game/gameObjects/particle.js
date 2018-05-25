export default class Particle {
    constructor(args) {
        this.player = args.player;
        this.owner = args.owner;

        this.position = args.position;
        this.targetPosition = args.position;

        this.velocity = args.velocity;
        this.radius = args.size;
        this.lifeSpan = args.lifeSpan;
        // added inertia argument so it can be modified
        this.inertia = 0.98;
        // added color argument so it can be modified
        this.color = args.color || '#ffffff';
        this.delete = false;
    }

    destroy() {
        this.delete = true;
    }

    update(updateObj) {
        this.targetPosition.x = updateObj.x;
        this.targetPosition.y = updateObj.y;
    }

    render(state) {
        if (this.player == this.owner) {
            // Move
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
            this.velocity.x *= this.inertia;
            this.velocity.y *= this.inertia;
        } else {
            // INTERPOLATE
            this.position.x += (this.targetPosition.x - this.position.x) * 0.16;
            this.position.y += (this.targetPosition.y - this.position.y) * 0.16;
        }

        // Shrink
        this.radius -= 0.1;
        if (this.radius < 0.1) {
            this.radius = 0.1;
        }
        if (this.lifeSpan-- < 0) {
            this.destroy()
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
