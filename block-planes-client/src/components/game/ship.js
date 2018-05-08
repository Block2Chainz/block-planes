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
        this.speed = 0.15;
        this.inertia = 0.99;
        this.radius = 20;
        this.lastShot = 0;
        this.create = args.create;
        this.onDie = args.onDie || (() => console.log('cannot kill'));
    }

    destroy() {
        this.delete = true;
        this.onDie();

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








    
}