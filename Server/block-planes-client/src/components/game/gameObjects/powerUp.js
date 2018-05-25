import Particle from './particle';
import { asteroidVertices, randomNumBetween } from './helpers';

export default class PowerUp {
    constructor(args) {
        this.type = args.type;
        this.position = { x: args.x, y: args.y };
        this.rotation = 0;
        this.rotationSpeed = 15;
        this.radius = 50;
        // this.vertices = asteroidVertices(8, args.size)
    }

    destroy() {
        this.delete = true;
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
        if (this.type === 'invincible') img.src = `https://s3-us-west-1.amazonaws.com/blockplanes/yellow.png`;
        if (this.type === 'speed') img.src = `https://s3-us-west-1.amazonaws.com/blockplanes/blue.png`;
        context.drawImage(img, -20, -20, 75, 75);
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
