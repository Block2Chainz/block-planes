import Bullet from './Bullet';
import Particle from './Particle';
import { rotatePoint, randomNumBetween } from './helpers';
import shipRenderer from '../game/gameObjects/shipRenderer.js';

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
    this.fireRateBoost = false;
    this.color = '#f44242';
    this.glow = 50;
    this.shadowColor = '#fffa7c';
    let makeVulnerable = () => {
      this.invincible = false;
      this.glow = 0;
    }
    makeVulnerable = makeVulnerable.bind(this);
    this.makeVulnerable = this.makeVulnerable.bind(this);
    setTimeout(function() {
      makeVulnerable();
    }, 2000);

    let attributes = shipRenderer(args.attr);
    
    
    // ship characteristics
    this.bodyColor = attributes.bodyColor;
    this.wingShape = attributes.wingShape;
    this.wingColor = attributes.wingColor;
    this.tailShape = attributes.tailShape;
    this.tailColor = attributes.tailColor;
    this.cockpitShape = attributes.cockpitShape;
    this.cockpitColor = attributes.cockpitColor;
    this.speed = attributes.speed; // modify in arguments when called
    this.inertia = attributes.inertia; // modify in arguments when called
    this.shootingSpeed = attributes.shootingSpeed; // lower is better
    this.smokeColor = attributes.smokeColor;    
    this.ingame = args.ingame;
    
    this.img1 = new Image();
    this.img1.src = `http://127.0.0.1:8887/bodies/body_${this.bodyColor}.png`;
    this.img2 = new Image();
    this.img2.src = `http://127.0.0.1:8887/wings/${this.wingShape}/wing_${this.wingShape}_${this.wingColor}.png`;
    this.img3 = new Image();
    this.img3.src = `http://127.0.0.1:8887/tails/${this.tailShape}/tail_${this.tailShape}_${this.tailColor}.png`;
    this.img4 = new Image();
    this.img4.src = `http://127.0.0.1:8887/cockpits/${this.cockpitShape}/cockpit_${this.cockpitShape}_${this.cockpitColor}.png`;
    
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
    }, 5000);
  }

  speedPowerUpEffect() {
    let component = this;
    this.speedBoost = true;
    this.speed += 1.5;
    this.inertia -= 0.1;
    this.glow = 50;
    if (component.invincible === true) {
       component.shadowColor = '#68ff6d';
    } else {
      this.shadowColor = '#51c7ff';
    }
    setTimeout(function() {
      component.slowDown();
    }, 10000);
  }

  fireRatePowerUpEffect() {
    let component = this;
    this.fireRateBoost = true;
    this.shootingSpeed -= 150;
    this.glow = 50;
    if (component.invincible === true) {
       component.shadowColor = '#ffaa2a';
    } else {
      this.shadowColor = '#51c7ff';
    }
    setTimeout(function() {
      component.normalFireRate();
    }, 10000);
  }

  makeVulnerable = () => {
    this.invincible = false;
    if (this.speedBoost === true) {
      this.shadowColor = '#51c7ff';
        } else {
      this.glow = 0;
    }
  }

  slowDown = () => {
    let component = this;
    this.speedBoost = false;
    this.speed -= 1.5;
    this.inertia += 0.1;
    if (this.invincible === true) {
      this.shadowColor = '#fffa7c';
    } else {
      this.glow = 0;
      this.shadowColor = '#fffa7c';
    }
  }

  normalFireRate = () => {
    let component = this;
    this.fireRateBoost = false;
    this.shootingSpeed += 150;
    if (this.invincible === true) {
      this.shadowColor = '#fffa7c';
    } else {
      this.glow = 0;
      this.shadowColor = '#fffa7c';
    }
  }

  accelerate(val){
    this.velocity.x -= Math.sin(-this.rotation*Math.PI/180) * this.speed;
    this.velocity.y -= Math.cos(-this.rotation*Math.PI/180) * this.speed;

    // Thruster particles
    let posDelta = rotatePoint({x:0, y:-35}, {x:0,y:0}, (this.rotation-180) * Math.PI / 180);
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
      },
      color: this.smokeColor
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
    if(state.keys.space && Date.now() - this.lastShot > this.shootingSpeed){
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
    context.rotate((this.rotation) * Math.PI / 180 + 0.78539816);

    // RENDER BODY
        
        context.drawImage(this.img1, -20, -20, 55, 55);
        
        // RENDER WINGS
        
        context.drawImage(this.img2, -20, -20, 55, 55);
        
        // RENDER TAIL
        
        context.drawImage(this.img3, -20, -20, 55, 55);
        
        // RENDER COCKPIT
  
        context.drawImage(this.img4, -20, -20, 55, 55);
        
        context.restore();
  }
}