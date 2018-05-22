import Particle from './Particle';
import { asteroidVertices, randomNumBetween } from './helpers';

export default class PowerUp {
    constructor(args) {
        this.type = args.type;
        this.position = { x: args.x, y: args.y };
        this.rotation = 0;
        this.rotationSpeed = 15;
        this.radius = 20;
        this.vertices = asteroidVertices(8, args.size)
    }

    destroy() {
        this.delete = true;
        // // Explode
        // for (let i = 0; i < this.radius; i++) {
        //     const particle = new Particle({
        //         lifeSpan: randomNumBetween(60, 100),
        //         size: randomNumBetween(1, 3),
        //         position: {
        //             x: this.position.x + randomNumBetween(-this.radius / 4, this.radius / 4),
        //             y: this.position.y + randomNumBetween(-this.radius / 4, this.radius / 4)
        //         },
        //         velocity: {
        //             x: randomNumBetween(-1.5, 1.5),
        //             y: randomNumBetween(-1.5, 1.5)
        //         }
        //     });
        //     this.create(particle, 'particles');
        // }
    }

    update(updateObj) {
        this.position.x = updateObj.x;
        this.position.y = updateObj.y;
        this.type = updateObj.type;
    }

    render(state) {
        // Rotation
        this.rotation += this.rotationSpeed;
        if (this.rotation >= 360) {
            this.rotation -= 360;
        }
        if (this.rotation < 0) {
            this.rotation += 360;
        }

        // Screen edges
        if (this.position.x > state.screen.width + this.radius) this.position.x = -this.radius;
        else if (this.position.x < -this.radius) this.position.x = state.screen.width + this.radius;
        if (this.position.y > state.screen.height + this.radius) this.position.y = -this.radius;
        else if (this.position.y < -this.radius) this.position.y = state.screen.height + this.radius;

        // Draw
        const context = state.context;
        context.save();
        context.translate(this.position.x, this.position.y);
        let img = new Image();
        if (this.type === 'invincible') img.src = `http://127.0.0.1:8887/yellow.png`;
        if (this.type === 'speed') img.src = `http://127.0.0.1:8887/blue.png`;
        context.drawImage(img, 0, 0, 35, 35);
        // context.rotate(this.rotation * Math.PI / 180);
        // if (this.type === 'invincible') {
        //     context.strokeStyle = '#42f4bc'
        // } else {
        //     context.strokeStyle = '#53f442'
        // }
        // context.lineWidth = 2;
        // context.beginPath();
        // context.moveTo(0, -this.radius);
        // for (let i = 1; i < this.vertices.length; i++) {
        //     context.lineTo(this.vertices[i].x, this.vertices[i].y);
        // }
        // context.closePath();
        // context.stroke();
        context.restore();
    }
}
