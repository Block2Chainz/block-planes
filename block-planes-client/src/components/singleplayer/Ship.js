import Bullet from './Bullet';
import Particle from './Particle';
import { rotatePoint, randomNumBetween } from './helpers';

export default class Ship {
  constructor(args) {
    this.position = args.position
    this.velocity = {
      x: 0,
      y: 0
    }
    this.component = this;
    this.rotation = 0;
    this.rotationSpeed = 6;
    this.speed = 0.15;
    this.inertia = 0.99;
    this.radius = 20;
    this.lastShot = 0;
    this.create = args.create;
    this.onDie = args.onDie;
    this.invincible = true;
    this.speedBoost = false;
    this.color = '#f44242';
    this.glow = 50;
    this.shadowColor = '#fffa7c';
    let makeVulnerable = () => {
      console.log('before',this.invincible)
      this.invincible = false;
      this.glow = 0;
      console.log('after',this.invincible)
    }
    makeVulnerable = makeVulnerable.bind(this);
    this.makeVulnerable = this.makeVulnerable.bind(this);
    setTimeout(function() {
      makeVulnerable();
      console.log()
    }, 2000);
  }


  destroy() {
    if (this.invincible === false) {
      this.delete = true;
      this.onDie();

      // Explode
      for (let i = 0; i < 60; i++) {
        const particle = new Particle({
          lifeSpan: randomNumBetween(60, 100),
          size: randomNumBetween(1, 4),
          position: {
            x: this.position.x + randomNumBetween(-this.radius / 4, this.radius / 4),
            y: this.position.y + randomNumBetween(-this.radius / 4, this.radius / 4)
          },
          velocity: {
            x: randomNumBetween(-1.5, 1.5),
            y: randomNumBetween(-1.5, 1.5)
          }
        });
        this.create(particle, 'particles');
      }
    }
  }

  rotate(dir){
    if (dir == 'LEFT') {
      this.rotation -= this.rotationSpeed;
    }
    if (dir == 'RIGHT') {
      this.rotation += this.rotationSpeed;
    }
  }

  invincibilityPowerUpEffect() {
    console.log('INV PU starting!')
    let component = this;
    this.invincible = true;
    if (this.speedBoost === true) {
      component.shadowColor = '#68ff6d';
      this.glow = 50;
    } else {
      this.glow = 50;
    }
    setTimeout(function() {
      component.makeVulnerable();
      console.log('INV PU ending!')
    }, 5000);
  }

  speedPowerUpEffect() {
    console.log('speed PU starting!')
    let component = this;
    let originalSpeed = this.speed;
    let originalInertia = this.inertia;
    this.speedBoost = true;
    this.speed = originalSpeed + 1.5;
    this.inertia = originalInertia - 0.1;
    this.glow = 50;
    if (component.invincible === true) {
       component.shadowColor = '#68ff6d';
    } else {
      this.shadowColor = '#51c7ff';
    }
    setTimeout(function() {
      component.slowDown();
      console.log('speed PU ending!')
    }, 10000);
  }

  makeVulnerable = () => {
    console.log('before',this.invincible)
    this.invincible = false;
    if (this.speedBoost === true) {
      this.shadowColor = '#51c7ff';
        } else {
      this.glow = 0;
    }
    console.log('after',this.invincible)
  }

  slowDown = () => {
    let component = this;
    this.speedBoost = false;
    this.speed = 0.15;
    this.inertia = 0.99;
    if (this.invincible === true) {
      console.log('changing shadow color to yellow', this.glow)
      this.shadowColor = '#fffa7c';
      console.log('changing shadow color to yellow', this.glow)
    } else {
      this.glow = 0;
      this.shadowColor = '#fffa7c';
    }
  }

  accelerate(val){
    this.velocity.x -= Math.sin(-this.rotation*Math.PI/180) * this.speed;
    this.velocity.y -= Math.cos(-this.rotation*Math.PI/180) * this.speed;

    // Thruster particles
    let posDelta = rotatePoint({x:0, y:-10}, {x:0,y:0}, (this.rotation-180) * Math.PI / 180);
    const particle = new Particle({
      lifeSpan: randomNumBetween(20, 40),
      size: randomNumBetween(1, 3),
      position: {
        x: this.position.x + posDelta.x + randomNumBetween(-2, 2),
        y: this.position.y + posDelta.y + randomNumBetween(-2, 2)
      },
      velocity: {
        x: posDelta.x / randomNumBetween(3, 5),
        y: posDelta.y / randomNumBetween(3, 5)
      }
    });
    this.create(particle, 'particles');
  }

  render(state){
    // Controls
    if(state.keys.up){
      this.accelerate(1);
    }
    if(state.keys.left){
      this.rotate('LEFT');
    }
    if(state.keys.right){
      this.rotate('RIGHT');
    }
    if(state.keys.space && Date.now() - this.lastShot > 50){
      const bullet = new Bullet({ship: this});
      this.create(bullet, 'bullets');
      this.lastShot = Date.now();
    }

    // Move
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.velocity.x *= this.inertia;
    this.velocity.y *= this.inertia;

    // Rotation
    if (this.rotation >= 360) {
      this.rotation -= 360;
    }
    if (this.rotation < 0) {
      this.rotation += 360;
    }

    // Screen edges
    if(this.position.x > state.screen.width) this.position.x = 0;
    else if(this.position.x < 0) this.position.x = state.screen.width;
    if(this.position.y > state.screen.height) this.position.y = 0;
    else if(this.position.y < 0) this.position.y = state.screen.height;

    // Draw
    const context = state.context;
    context.save();
    context.translate(this.position.x, this.position.y);
    context.rotate(this.rotation * Math.PI / 180);
    context.strokeStyle = this.color;
    context.fillStyle = '#000000';
    context.lineWidth = 2;
    context.shadowBlur = this.glow;
    context.shadowColor = this.shadowColor;
    context.beginPath();
    context.moveTo(0, -15);
    context.lineTo(30, 30);
    context.lineTo(5, 7);
    context.lineTo(-5, 7);
    context.lineTo(-30, 30);
    context.closePath();
    context.fill();
    context.stroke();
    context.restore();
  }
}
