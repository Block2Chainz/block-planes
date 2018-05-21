import {
    rotatePoint
} from './helpers';

export default class Bullet {
     constructor(args) {
         
        let owner = args.owner;
        let player = args.player;

        let posDelta = rotatePoint({ x: 0, y: -20 }, { x: 0, y: 0 }, args.rotation * Math.PI / 180);
        if (args.ship !== undefined) {
            // if a ship is given to it, aka you are shooting it
            this.position = { x: args.ship.position.x + posDelta.x, y: args.ship.position.y + posDelta.y };
            this.rotation = args.ship.rotation;
            this.velocity = { x: posDelta.x * 1.75, y: posDelta.y * 1.75 };
        } else {
            // otherwise it is being created by the server updater
            this.position = { x: args.position.x, y: args.position.y }
            this.targetPosition = { x: args.position.x, y: args.position.y }
            this.velocity = {
                x: posDelta.x * 1.75,
                y: posDelta.y * 1.75
            };
        }
        this.radius = 2;
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
        } else {
            // INTERPOLATE
            this.position.x += (this.targetPosition.x - this.position.x) * 0.16;
            this.position.y += (this.targetPosition.y - this.position.y) * 0.16;
        }
        // Delete if it goes out of bounds
        if (this.position.x < 0 ||
            this.position.y < 0 ||
            this.position.x > state.screen.width ||
            this.position.y > state.screen.height) {
            this.destroy();
        }
        // Draw
        const context = state.context;
        context.save();
        context.translate(this.position.x, this.position.y);
        context.rotate(this.rotation * Math.PI / 180);
        context.fillStyle = '#FFF';
        context.lineWidth = 0, 5;
        context.beginPath();
        context.arc(0, 0, 2, 0, 2 * Math.PI);
        context.closePath();
        context.fill();
        context.restore();
    }
}