import React, { Component } from 'react';
import './game.css';
// import io from 'socket.io-client/dist/socket.io.js';
import Ship from './gameObjects/ship';
import Enemy from './gameObjects/Enemy';
import { randomNumBetweenExcluding } from './gameObjects/helpers'

const KEY = {
    LEFT: 37,
    RIGHT: 39,
    UP: 38,
    A: 65,
    D: 68,
    W: 87,
    SPACE: 32
};

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            screen: {
                width: 1000,
                height: 1000,
                ratio: window.devicePixelRadio || 1
            },
            keys: {
                left  : false,
                right : false,
                up    : false, 
                space : false, 
            }, 
            inGame: false
        }
        this.ship = [];
        this.enemies = [];
        this.bullets = [];
        this.particles = [];
    }

    componentDidMount() {
        const socket = this.props.socket;
        // keyup, key state is false
        window.addEventListener('keyup', this.handleKeys.bind(this, false));
        // keydown, key state is true
        window.addEventListener('keydown', this.handleKeys.bind(this, true));
        // window.addEventListener('resize', this.handleResize.bind(this, false));
        // set variable 'context' to the canvas and save to state
        const context = this.refs.canvas.getContext('2d');
        this.setState({ context });
        // set up a listeners
        socket.on('server_state', (payload) => {
            console.log('heard update from server', payload);
            this.serverUpdate(payload);
        });
        socket.on('ship1', payload => {
            this.ship[0] = payload;
        });
        socket.on('ship2', payload => {
            this.ship[1] = payload;
        });        
        this.startGame();
        // animates the next frame        
        requestAnimationFrame(() => { this.update() });
    }
    
    componentWillUnmount() {
        // remove the listeners
        window.removeEventListener('keyup', this.handleKeys);
        window.removeEventListener('keydown', this.handleKeys);
        window.removeEventListener('resize', this.handleResize);
        this.props.socket.emit('disconnect', { player: this.props.player }); // tells the server to disconnect
        this.props.socket.disconnect();
    }
    
    handleKeys(value, e) {
        const socket = this.props.socket;
        let keys = this.state.keys;
        if (e.keyCode === KEY.LEFT || e.keyCode === KEY.A) keys.left = value;
        if (e.keyCode === KEY.RIGHT || e.keyCode === KEY.D) keys.right = value;
        if (e.keyCode === KEY.UP || e.keyCode === KEY.W) keys.up = value;
        if (e.keyCode === KEY.SPACE) keys.space = value;
        socket.emit('keys', { player: this.props.player, keys })
        this.setState({
            keys
        });
    }
    
    serverUpdate(payload) {
        this.bullets = payload.bullets;
        if (this.player === 1) {
            this.ship[1] = payload.p2_ship || null;
        } else if (this.player === 2) {
            this.ship[0] = payload.p1_ship;
        }
        this.particles = payload.particles;
        this.enemies = payload.enemies;
    }
    
    update() {
        // for updating the new positions of everything
        // pull up the canvas
        const context = this.state.context;
        const keys = this.state.keys;
        const ship = this.props.player === 1 ? this.ship[0] : this.ship[1];
        // store canvas state on the stack
        context.save();
        // resize the field if the window has been resized
        context.scale(this.state.screen.ratio, this.state.screen.ratio);
        // add motion trails
        context.fillStyle = '#000';
        context.globalAlpha = 0.4;
        context.fillRect(0, 0, this.state.screen.width, this.state.screen.height);
        context.globalAlpha = 1;
        // remove or render
        this.updateObjects(this.particles, 'particles');
        this.updateObjects(this.enemies, 'enemies');
        this.updateObjects(this.bullets, 'bullets');
        this.updateObjects(this.ship, 'ship');
        // pop the top state off the stack, restore context
        context.restore();
        // set up next frame 
        requestAnimationFrame(() => {this.update()});
    }
    
    addScore(points) {
        if (this.state.inGame) {
            this.setState({
                currentScore: this.state.currentScore + points,
            });
        }
    }
    
    gameOver() {
        this.setState({
            inGame: false,
        });
    }
    
    startGame() {
        this.setState({
            inGame: true, 
            currentScore: 0,
        });
        const socket = this.props.socket;
        if (this.props.player === 1) {
            let ship1 = new Ship({
                attr: this.props.p1_ship, 
                position: {
                    x: this.state.screen.width / 2,
                    y: this.state.screen.height / 2,
                }, 
                // create: this.createObject.bind(this), 
                // onDie: this.gameOver.bind(this)
            })
            socket.emit(`shipGeneration`, { ship1 });
        } else if (this.props.player === 2) {
            let ship2 = new Ship({
                attr: this.props.p2_ship,
                position: {
                    x: this.state.screen.width / 2,
                    y: this.state.screen.height / 2,
                },
                // create: this.createObject.bind(this),
                // onDie: this.gameOver.bind(this)
            })
            socket.emit(`shipGeneration`, { ship2 });
        }
        
        requestAnimationFrame(() => { this.update() });
    }
    
    // createObject(item, group) {
    //     this[group].push(item);
    // }
    
    updateObjects(items, group) {
        // go through each item of the specified group and delete them or call their render functions
        let index = 0;
        console.log('updating items', items, group);
        for (let item of items) {
            if (item && item.delete) {
                // delete the object from the field
                this[group].splice(index, 1);
            } else {
                // else call the render method 
                this.renderObject(items[index], group, index);
            }
            index++;
        }
    }
    
    renderObject(object, type, index) {
        if (type === 'particles' && object !== null) {
            // // Move
            // object.position.x += object.velocity.x;
            // object.position.y += object.velocity.y;
            // object.velocity.x *= object.inertia;
            // object.velocity.y *= object.inertia;
            
            // // Shrink
            // object.radius -= 0.1;
            // if (object.radius < 0.1) {
            //     object.radius = 0.1;
            // }
            // if (object.lifeSpan-- < 0) {
            //     object.delete = true;
            // }
            // Draw
            const context = this.state.context;
            context.save();
            context.translate(object.position.x, object.position.y);
            context.fillStyle = object.color;
            context.lineWidth = 2;
            context.beginPath();
            context.moveTo(0, -object.radius);
            context.arc(0, 0, object.radius, 0, 2 * Math.PI);
            context.closePath();
            context.fill();
            context.restore();
        } else if (type === 'enemies') {
            console.log('')
        } else if (type === 'bullets') {
            console.log('')
        } else if (type === 'ship' && object) {
            if (this.state.inGame) {
                if (index === this.props.player - 1) {
                    // e.g. player is 1, index is 0 - update with the key input
                    // player is 1, index is 1 - do not process key input (because index 1 is player 2's plane)
                    // player is 2, index is 0 - do not process key input
                    // player is 2, index is 1 - update with key input 
                    if (this.state.keys.up) {
                        object.velocity.x -= Math.sin(-object.rotation * Math.PI / 180) * object.speed ;
                        object.velocity.y -= Math.cos(-object.rotation * Math.PI / 180) * object.speed ;
                    }
                    if (this.state.keys.left) {
                        object.rotation -= object.rotationSpeed;
                    }
                    if (this.state.keys.right) {
                        object.rotation += object.rotationSpeed;
                    }
                    // if (this.state.keys.space && Date.now() - this.lastShot > this.shootingSpeed) {
                        //     // doesn't allow rapidly firing as quickly as you can press the spacebar
                        //     const bullet = new Bullet({ ship: object });
                        //     //this.create = this(game.jsx).createObject()
                        //     this.create(bullet, 'bullets');
                        //     this.lastShot = Date.now();
                        // }
                    }
                    // Move
                    object.position.x += object.velocity.x;
                    object.position.y += object.velocity.y;
                    object.velocity.x *= object.inertia;
                    object.velocity.y *= object.inertia;
                    
                    // Rotation
                    if (object.rotation >= 360) {
                        object.rotation -= 360;
                    }
                    if (object.rotation < 0) {
                        object.rotation += 360;
                    }
                    
                    // Screen edges
                    // Roll from one edge to the opposite
                    if (object.position.x > this.state.screen.width) object.position.x = 0;
                    else if (object.position.x < 0) object.position.x = this.state.screen.width;
                    if (object.position.y > this.state.screen.height) object.position.y = 0;
                    else if (object.position.y < 0) object.position.y = this.state.screen.height;
                }

                const context = this.state.context;
                context.save();
                context.translate(object.position.x, object.position.y);
                // + 0.785.... is the additional rotation of 45 degrees due to the img format
                context.rotate((object.rotation) * Math.PI / 180 + 0.78539816);
                // RENDER BODY
                let img1 = new Image();
                img1.src = `http://127.0.0.1:8887/bodies/body_${object.bodyColor}.png`;
                context.drawImage(img1, 0, 0, 35, 35);
                // RENDER WINGS
                let img2 = new Image();
                img2.src = `http://127.0.0.1:8887/wings/${object.wingShape}/wing_${object.wingShape}_${object.wingColor}.png`;
                context.drawImage(img2, 0, 0, 35, 35);
                // RENDER TAIL
                let img3 = new Image();
                img3.src = `http://127.0.0.1:8887/tails/${object.tailShape}/tail_${object.tailShape}_${object.tailColor}.png`;
                context.drawImage(img3, 0, 0, 35, 35);
                // RENDER COCKPIT
                let img4 = new Image();
                img4.src = `http://127.0.0.1:8887/cockpits/${object.cockpitShape}/cockpit_${object.cockpitShape}_${object.cockpitColor}.png`;
                context.drawImage(img4, 0, 0, 35, 35);
                // render
                context.restore();
            }
        }
        
        render() {
            let endgame;
            let message;
            
            if (!this.state.inGame) {
                endgame = (
                    <div className="endgame">
                    <p>Game over</p>
                    <button
                        onClick={this.startGame.bind(this)}>
                        try again?
                    </button>
                </div>
            )
        }
        
        return (
            <div className="game">
                <canvas ref="canvas"
                    width={this.state.screen.width * this.state.screen.ratio}
                    height={this.state.screen.height * this.state.screen.ratio}
                    />
            </div>
        );
    }
}

// checkCollisionsWith(items1, items2) {
    //     // loop through each item in one array, compare to each item in second array
    //     let a = items1.length - 1;
    //     let b;
    //     for (a; a >= 0; a--) {
        //         b = items2.length - 1;
        //         for (b; b >= 0; b--) {
            //             let item1 = items2[a];
            //             let item2 = items2[b];
            //             if (this.checkCollision(item1, item2)) {
                //                 // destroy if a collision is detected
                //                 item1.destroy();
                //                 item2.destroy();
                //             }
                //         }
                //     }
                // }
                
                // checkCollision(obj1, obj2) {
                    //     let vx = obj1.position.x - obj2.position.x;
                    //     let vy = obj1.position.y - obj2.position.y;
                    //     // pythagorean theorem formula a^2 + b^2 = c^2 
                    //     // gets the distance between the two objects based on their separation on the horizontal and vertical planes
                    //     let length = Math.sqrt(vx * vx + vy * vy);
                    //     // checks against the two radiuses added together
                    //     // example 
                    //         // obj 1 and 2 are 10 pixels away from each other's center
//         // if their radius's are greater than 5 pixels, a collision is registered
//     if (length < obj1.radius + obj2.radius) {
    //         return true;
    //     } else {
        //         return false;
        //     }
        // }
        // generateEnemies(number) {
            //     // generate a new enemy, quantity = the number passed into the function
            //     let ship = this.ship[0];
            //     for (let i = 0; i < number; i++) {
                //         let enemy = new Enemy({
                    //             // size: 80, 
                    //             // give it a random position on the screen
                    //             position: {
                        //                 x: randomNumBetweenExcluding(0, this.state.screen.width, ship.position.x-60, ship.position.x+60), 
                        //                 y: randomNumBetweenExcluding(0, this.state.screen.height, ship.position.y-60, ship.position.y+60),
                        //             }, 
                        //             create: this.createObject.bind(this),
                        //             addScore: this.addScore.bind(this),
                        //         });
                        //         this.createObject(enemy, 'enemies')
//     }
// }

// const Game = connect(mapStateToProps)(ConnectedGame);

// handleResize(value, e) {
//     this.setState({
//         screen: {
//             width: window.innerWidth,
//             height: window.innerHeight - 120,
//             ratio: window.devicePixelRatio || 1,
//         }
//     }); 
// }
export default Game;