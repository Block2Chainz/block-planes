import Bullet from './Bullet';
import Particle from './Particle';
import { rotatePoint, randomNumBetween } from './helpers';

// to render a new ship, create a new canvas element, 
// make sure that there is a canvas element saved in the parent state as 'context', 
// and also make sure there is a createObject function in the parent, 
// then  
// call this function like so: 

// new Ship({
//      attributes: ${attr string}              // insert the attribute string here***
//      create: this.createObject.bind(this),   // see the game.jsx file for guidance here
//      onDie: ${},                             // not necessary if just displaying and not using to play
//      position: ${},
// })

export default class Ship {
    constructor(args) {
        this.position = args.position;
        this.velocity={
            x: 0, 
            y: 0
        };
        this.rotation = 0;
        this.rotationSpeed = 6;
        this.speed = args.speed || 0.15; // modify in arguments when called
        this.inertia = args.inertia || 0.99; // modify in arguments when called
        this.radius = 20;
        this.lastShot = 0;
        this.shootingSpeed = args.shootingSpeed || 300; // lower is better
        this.create = args.create;
        this.onDie = args.onDie || (() => console.log('cannot kill'));
        this.smokeColor = args.smokeColor || '#ffffff'
    }

    destroy() {
        // set its delete property to true, for the game.jsx to delete on next render
        this.delete = true;
        // this.onDie = this(game.jsx).gameOver()
        this.onDie();

        // generate new 60 new particles in an explosion
        for (let i = 0; i < 60; i++) {
            const particle = new Particle({
                lifeSpan: randomNumBetween(60, 100),
                size: randomNumBetween(1, 4),
                position: {
                    x: this.position.x + randomNumBetween(-this.radius/4, this.radius/4),
                    y: this.position.y + randomNumBetween(-this.radius / 4, this.radius / 4)  
                },
                velocity: {
                    x: randomNumBetween(-1.5, 1.5),
                    y: randomNumBetween(-1.5, 1.5)
                }
            });

            //this.create = this(game.jsx).createObject()
            this.create(particle, 'particles');
        }
    }

    rotate(dir) {
        if (dir == 'LEFT') {
            this.rotation -= this.rotationSpeed;
        } else if (dir == 'RIGHT') {
            this.rotation += this.rotationSpeed;
        }
    }

    accelerate(val) {
        this.velocity.x -= Math.sin(-this.rotation * Math.PI / 180) * this.speed;
        this.velocity.y -= Math.cos(-this.rotation * Math.PI / 180) * this.speed;

        // Thruster particles
        let posDelta = rotatePoint({ x: 0, y: -10 }, { x: 0, y: 0 }, (this.rotation - 180) * Math.PI / 180);
        const particle = new Particle({
            lifeSpan: randomNumBetween(20, 40),
            size: randomNumBetween(1, 3),
            position: {
                x: this.position.x + posDelta.x + randomNumBetween(-2, 2),
                y: this.position.y + posDelta.y + randomNumBetween(-2, 2)
            },
            color: this.smokeColor,
            velocity: {
                x: posDelta.x / randomNumBetween(3, 5),
                y: posDelta.y / randomNumBetween(3, 5)
            }
        });

        //this.create = this(game.jsx).createObject()
        this.create(particle, 'particles');
    }

    // state is passed in from game.jsx (state = game.jsx's state)
    render(state) {
        // if the specified buttons are pressed, activate the respective functions
        if (state.keys.up) {
            this.accelerate(1);
        } 
        if (state.keys.left) {
            this.rotate('LEFT');
        } 
        if (state.keys.right) {
            this.rotate('RIGHT');
        } 
        if (state.keys.space && Date.now() - this.lastShot > this.shootingSpeed) {
            // doesn't allow rapidly firing as quickly as you can press the spacebar
            const bullet = new Bullet({ ship: this });
            //this.create = this(game.jsx).createObject()
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
        if (this.position.x > state.screen.width) this.position.x = 0;
        else if (this.position.x < 0) this.position.x = state.screen.width;
        if (this.position.y > state.screen.height) this.position.y = 0;
        else if (this.position.y < 0) this.position.y = state.screen.height;


        // Draw
        const context = state.context;
        context.save();
        context.translate(this.position.x, this.position.y);
        context.rotate(this.rotation * Math.PI / 180);
        context.strokeStyle = '#ffffff';
        context.fillStyle = '#000000';
        context.lineWidth = 2;

        // let img1 = new Image();
        // img1.src = "http://127.0.0.1:8887/path5114.png";
        // context.drawImage(img1, 0, 0, 45, 45);

        // let img2 = new Image();
        // img2.src = "http://127.0.0.1:8887/barkbrown.svg";
        // context.drawImage(img2, 0, 0, 45, 45);

        context.beginPath();
        context.moveTo(0, -15);
        context.lineTo(10, 10);
        context.lineTo(5, 7);
        context.lineTo(-5, 7);
        context.lineTo(-10, 10);
        context.closePath();
        context.fill();
        context.stroke();
        context.restore();

    }
}