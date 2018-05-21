import React, { Component } from 'react';
import './game.css';
// import io from 'socket.io-client/dist/socket.io.js';
import Ship from './gameObjects/ship.js';
import Enemy from './gameObjects/enemy.js';
import Bullet from './gameObjects/bullet.js';
import { randomNumBetweenExcluding } from './gameObjects/helpers'
import Particle from './gameObjects/particle.js';

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
                width: 750,
                height: 500,
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
        this.ship = {};
        this.enemies = {};
        this.bullets = {    1: [],
                            2: []};
        this.particles = {  1: [], 
                            2: []};
/*{
    peers: {
        1: {ship},
        2: {ship}
    },
    bullets: {
        1: [{bullet}, {bullet}, {bullet}],
        2: [{bullet}, {bullet}],
    },
    particles: {
        1: [{particle}, {particle}, {particle}],
        2: [{particle}, {particle}, {particle}]
    }
}*/
        this.savedMoves = [];

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
            this.serverUpdate(payload);
        });
        socket.on('ship1', payload => {
            // this.ship[1] = new Ship(this.props.p1_ship);
        });
        socket.on('ship2', payload => {
            // this.ship[2] = new Ship(this.props.p2_ship);
        });        
        this.startGame();
        // animates the next frame     
        // requestAnimationFrame(() => { this.update() });
    }
    
    componentWillUnmount() {
        // remove the listeners
        window.cancelAnimationFrame(this.update);
        window.removeEventListener('keyup', this.handleKeys);
        window.removeEventListener('keydown', this.handleKeys);
        window.removeEventListener('resize', this.handleResize);
        this.props.socket.emit('disconnect', { player: this.props.player }); // tells the server to disconnect
        this.props.socket.disconnect();
        clearInterval(this.update);
    }
    
    handleKeys(value, e) {
        const socket = this.props.socket;
        let keys = this.state.keys;
        if (e.keyCode === KEY.LEFT || e.keyCode === KEY.A) keys.left = value;
        if (e.keyCode === KEY.RIGHT || e.keyCode === KEY.D) keys.right = value;
        if (e.keyCode === KEY.UP || e.keyCode === KEY.W) keys.up = value;
        if (e.keyCode === KEY.SPACE) keys.space = value;
        this.setState({
            keys
        });
    }
    
    serverUpdate(payload) {

        // update the other player's stuff
        if (this.props.player === 1) {
            this.ship[2].update(payload.peers[2]);
            this.updateOMatic(payload.bullets[2], 'bullets');
            this.updateOMatic(payload.particles[2], 'particles');
        } else if (this.props.player === 2) {
            this.ship[1].update(payload.peers[1]);
            this.updateOMatic(payload.bullets[1], 'bullets');
            this.updateOMatic(payload.particles[1], 'particles');
        }
    }
    
    updateOMatic(pending, type) {
        let otherPlayer = this.props.player === 1 ? '2' : '1';
        let otherItems = this[type][otherPlayer];
        // get a list of all the bullet data coming in
        // loop through the list and update the bullets we have
        for (let i = 0; i < pending.length; i++) {
            // if there is a bullet on the server at the index, but no bullet at the index of our array
            if (otherItems[i] === undefined) {
                if (type === 'bullets') {
                    otherItems.push(new Bullet({
                        position: { x: this.ship[otherPlayer].position.x, 
                                    y: this.ship[otherPlayer].position.y},
                        owner: otherPlayer,
                        player: this.props.player,
                        rotation: pending[i].rotation,
                    }));
                } else if (type === 'particles') {
                    otherItems.push(new Particle({
                        position: {
                            x: this.ship[otherPlayer].position.x,
                            y: this.ship[otherPlayer].position.y,
                        },
                        owner: otherPlayer,
                        player: this.props.player,
                        lifeSpan: pending[i].lifeSpan, 
                        velocity: pending[i].velocity,
                        size: pending[i].size,
                        color: pending[i].color,
                    }));
                }
            } 
            else {
                // item exists, update its positioning
                otherItems[i].update(pending[i]);
            }
        }
    }
    
    update() {
        // this.props.socket.emit(`keys`, { id: this.props.player, keys: this.state.keys, timestamp: Date.now() });        
        // for updating the new positions of everything
        // pull up the canvas
        const context = this.state.context;
        // store canvas state on the stack
        context.save();
        context.scale(this.state.screen.ratio, this.state.screen.ratio);
        // add motion trails
        context.fillStyle = '#000';
        context.globalAlpha = 0.4;
        context.fillRect(0, 0, this.state.screen.width, this.state.screen.height);
        context.globalAlpha = 1;
        // remove or render
        // this.updateObjects(this.sprites, 'sprites');
        // this.updateObjects(this.enemies, 'enemies');
        this.updateObjects(this.ship, 'ship');
        this.updateArray(this.bullets['1'], 'bullets');
        this.updateArray(this.bullets['2'], 'bullets');
        this.updateArray(this.particles['1'], 'particles');
        this.updateArray(this.particles['2'], 'particles');
        // pop the top state off the stack, restore context
        context.restore();
        // set up next frame 
        // requestAnimationFrame(() => {this.update()});
    }

    updateArray(items) {
        for(let i = 0; i < items.length; i++) {
            if (items[i].delete) {
                items.splice(i, 1);
            } else {
                items[i].render(this.state);
            }
        }
    }
    
    updateObjects(items) {
        // go through each item of the specified group and delete them or call their render functions
        for (let key in items) {
            if (items[key].delete) {
                // delete the object from the field
                delete items[key];
            } else {
                // else call the render method 
                items[key].render(this.state);
            }
        }
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

    emitUpdate(type, payload) {
        const socket = this.props.socket;
        socket.emit(type, payload);
    }
    
    startGame() {
        this.setState({
            inGame: true, 
            currentScore: 0,
        });
        const socket = this.props.socket;
        let ship1 = new Ship({
            id: 1,
            attr: this.props.p1_ship, 
            position: {
                x: 50,
                y: 50,
            }, 
            player: this.props.player,
            emitUpdate: this.emitUpdate.bind(this),
            ingame: true,
            create: this.createObject.bind(this), 
            // onDie: this.gameOver.bind(this)
        });
        let ship2 = new Ship({
            id: 2,
            attr: this.props.p2_ship,
            position: {
                x: 75,
                y: 75,
            }, 
            player: this.props.player,
            emitUpdate: this.emitUpdate.bind(this),
            ingame: true,
            create: this.createObject.bind(this),
            // onDie: this.gameOver.bind(this)
        });
        this.ship['1'] = ship1;
        this.ship['2'] = ship2;

        socket.emit(`shipGeneration`, { ship1: this.props.p1_ship, ship2: this.props.p2_ship});
        setInterval(() => { this.update() }, 1000 / 60);   

        // requestAnimationFrame(() => { this.update() });
    }
    
    createObject(item, group, player) {
        this[group][player].push(item);
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
        )}
        
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