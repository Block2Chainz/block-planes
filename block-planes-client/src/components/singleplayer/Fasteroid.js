import Particle from './Particle';
import { asteroidVertices, randomNumBetween, rotatePoint } from './helpers';

export default class Fasteroid {
  constructor(args) {
    this.position = args.position
    this.velocity = {
      x: [randomNumBetween(-4.5, -3.5), randomNumBetween(3.5, 4.5)][Math.floor(randomNumBetween(0, 1))],
      y: [randomNumBetween(-4.5, -3.5), randomNumBetween(3.5, 4.5)][Math.floor(randomNumBetween(0, 1))]
    }
    this.rotation = 13 * this.velocity.x * this.velocity.y;
    this.rotationSpeed = randomNumBetween(0, 2)
    this.radius = args.size;
    this.offset = args.offset;
    this.score = (80/this.radius)*6;
    this.create = args.create;
    this.addScore = args.addScore;
    this.vertices = asteroidVertices(8, args.size);
    this.img1 = new Image();
    this.img1.src = `https://s3-us-west-1.amazonaws.com/blockplanes/enemies/fast.png`;
  }

  destroy(){
    this.delete = true;
    this.addScore(this.score);

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

    // Break into smaller fasteroids
    // if(this.radius > 10){
    //   for (let i = 0; i < 2; i++) {
    //     let fasteroid = new Fasteroid({

    //       size: this.radius/2,
    //       offset: this.offset/2,
    //       position: {
    //         x: randomNumBetween(-10, 20)+this.position.x,
    //         y: randomNumBetween(-10, 20)+this.position.y
    //       },
    //       create: this.create.bind(this),
    //       addScore: this.addScore.bind(this)
    //     });
    //     this.create(fasteroid, 'fasteroids');
    //   }
    // }
  }

  render(state){
    // Move
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // let posDelta = rotatePoint({x:0, y:-25}, {x:0,y:0}, (this.rotation-50) * Math.PI / 180);
    // const particle = new Particle({
    //   lifeSpan: randomNumBetween(20, 40),
    //   size: randomNumBetween(1, 3),
    //   position: {
    //     x: this.position.x + posDelta.x + randomNumBetween(-2, 2),
    //     y: this.position.y + posDelta.y + randomNumBetween(-2, 2)
    //   },
    //   velocity: {
    //     x: posDelta.x / randomNumBetween(3, 5),
    //     y: posDelta.y / randomNumBetween(3, 5)
    //   },
    //   color: '#42f46b'
    // });
    // this.create(particle, 'particles');

    // Rotation
    // this.rotation += this.rotationSpeed;
    // if (this.rotation >= 360) {
    //   this.rotation -= 360;
    // }
    // if (this.rotation < 0) {
    //   this.rotation += 360;
    // }

    // Screen edges
    if(this.position.x > state.screen.width + this.radius) this.position.x = -this.radius;
    else if(this.position.x < -this.radius) this.position.x = state.screen.width + this.radius;
    if(this.position.y > state.screen.height + this.radius) this.position.y = -this.radius;
    else if(this.position.y < -this.radius) this.position.y = state.screen.height + this.radius;

    // Draw
    const context = state.context;
    context.save();
    context.translate(this.position.x, this.position.y);
    context.rotate((this.rotation) * Math.PI / 180 + 0.78539816);
    context.drawImage(this.img1, this.offset, this.offset, (this.radius*1.75), (this.radius*1.75));
    context.restore();
  }
}
