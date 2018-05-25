import Particle from './Particle';
import { asteroidVertices, randomNumBetween } from './helpers';

export default class SpeedPowerUp {
  constructor(args) {
    this.position = args.position
    this.velocity = {
      x: randomNumBetween(-10000, -10000),
      y: randomNumBetween(-10000, -10000)
    }
    this.rotation = 0;
    this.rotationSpeed = 1;
    this.radius = args.size;
    this.offset = args.offset;
    this.create = args.create;
    this.vertices = asteroidVertices(8, args.size);
    this.img1 = new Image();
    this.img1.src = `http://127.0.0.1:8887/speedPowerUp.png`;
  }

  destroy(){
    this.delete = true;

    // Explode
    for (let i = 0; i < this.radius; i++) {
      const particle = new Particle({
        lifeSpan: randomNumBetween(60, 100),
        size: randomNumBetween(1, 3),
        position: {
          x: this.position.x + randomNumBetween(-this.radius/4, this.radius/4),
          y: this.position.y + randomNumBetween(-this.radius/4, this.radius/4)
        },
        velocity: {
          x: randomNumBetween(-1.5, 1.5),
          y: randomNumBetween(-1.5, 1.5)
        }
      });
      this.create(particle, 'particles');
    }
  }

  render(state){
    // Rotation
    this.rotation += this.rotationSpeed;
    if (this.rotation >= 360) {
      this.rotation -= 360;
    }
    if (this.rotation < 0) {
      this.rotation += 360;
    }

    // Screen edges
    if(this.position.x > state.screen.width + this.radius) this.position.x = -this.radius;
    else if(this.position.x < -this.radius) this.position.x = state.screen.width + this.radius;
    if(this.position.y > state.screen.height + this.radius) this.position.y = -this.radius;
    else if(this.position.y < -this.radius) this.position.y = state.screen.height + this.radius;

    // Draw
    const context = state.context;
    context.save();
    context.translate(this.position.x, this.position.y);
    context.rotate(this.rotation * Math.PI / 180);
    context.drawImage(this.img1, this.offset, this.offset, (this.radius*1.75), (this.radius*1.75));
    context.restore();
  }
}
