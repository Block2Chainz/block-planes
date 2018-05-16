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
                width: window.innerWidth,
                height: window.innerHeight - 75,
                ratio: window.devicePixelRadio || 1
            },
            keys: {
                left  : 0,
                right : 0,
                up    : 0, 
                down  : 0, 
                space : 0, 
            }
        }
        this.ship = [];
        this.enemies = [];
        this.bullets = [];
        this.particles = [];
        this.string1 = this.props.p1_ship;
        this.string2 = this.props.p1_ship;
    }

    handleResize(value, e) {
        this.setState({
            screen: {
                width: window.innerWidth,
                height: window.innerHeight - 120,
                ratio: window.devicePixelRatio || 1,
            }
        }); 
    }

    componentWillMount() {
        console.log(this.props.socket)
    }

    componentDidMount() {
        // add listeners to key events
        // keyup, key state is false
        window.addEventListener('keyup', this.handleKeys.bind(this, false));
        // keydown, key state is true
        window.addEventListener('keydown', this.handleKeys.bind(this, true));
        window.addEventListener('resize', this.handleResize.bind(this, false));

        // set up the canvas
        const context = this.refs.canvas.getContext('2d');
        // set variable 'context' to the canvas and save to state
        this.setState({ context: context });
        
        // set up a listener for updates
        this.props.socket.on('update', (payload) => {
            console.log('heard socket update', payload);
            this.update(payload);
        });
        
        // start the game
        this.startGame();
        
        // function on the global window, calls the update function and then 
        // animates the next frame
        requestAnimationFrame(() => { this.update() });
    }

    componentWillUnmount() {
        // remove the listeners
        window.removeEventListener('keyup', this.handleKeys);
        window.removeEventListener('keydown', this.handleKeys);
        window.removeEventListener('resize', this.handleResize);
    }

    handleKeys(value, e) {
        let keys = this.state.keys;
        if (e.keyCode === KEY.LEFT || e.keyCode === KEY.A) keys.left = value;
        if (e.keyCode === KEY.RIGHT || e.keyCode === KEY.D) keys.right = value;
        if (e.keyCode === KEY.UP || e.keyCode === KEY.W) keys.up = value;
        if (e.keyCode === KEY.SPACE) keys.space = value;
        this.setState({
            keys
        });
        this.props.socket.emit('keys', { player: this.props.player, keys })
    }

    update(payload) {
        if (payload) {
            console.log('payload heard at update');
        }
        // for updating the new positions of everything
        // pull up the canvas
        const context = this.state.context;
        const keys = this.state.keys;
        const ship = this.ship[0];

        // store canvas state on the stack
        context.save();
        // resize the field if the window has been resized
        context.scale(this.state.screen.ratio, this.state.screen.ratio);

        // add motion trails
        context.fillStyle = '#000';
        context.globalAlpha = 0.4;
        context.fillRect(0, 0, this.state.screen.width, this.state.screen.height);
        context.globalAlpha = 1;

        // repopulate with new enemies if there are none left
        // if (!this.enemies.length) {
        //     let count = this.state.enemyCount + 1;
        //     this.setState({ enemyCount: count });
        //     this.generateEnemies(count)
        // }

        // check for collisions with enemies (either bullets or your ship)
        // this.checkCollisionsWith(this.bullets, this.enemies);
        // this.checkCollisionsWith(this.ship, this.enemies);

        // remove or render
        this.updateObjects(this.particles, 'particles');
        this.updateObjects(this.enemies, 'enemies');
        this.updateObjects(this.bullets, 'bullets');
        this.updateObjects(this.ship, 'ship');
        // this.updateObjects(this.partnerShip, 'partnerShip');

        // pop the top state off the stack, restore context
        context.restore();

        // update the socket
        // this.props.socket.emit(`update`, {
        //     player: this.props.player,
        //     ships: this.ship,
        //     enemies: this.enemies,
        //     bullets: this.bullets,
        //     particles: this.particles,  
        // });

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

        let ship1 = new Ship({
            attr: this.string1, 
            position: {
                x: this.state.screen.width / 2,
                y: this.state.screen.height / 2,
            }, 
            create: this.createObject.bind(this), 
            onDie: this.gameOver.bind(this)
        })

        // let ship1 = this.shipCreator(this.string1, { 
        //     position: {
        //         x: this.state.screen.width / 2,
        //         y: this.state.screen.height / 2,
        //     },
        //     create: this.createObject.bind(this),
        //     onDie: this.gameOver.bind(this),
        // });

        // let ship2 = this.shipCreator(this.string1, {
        //     position: {
        //         x: this.state.screen.width / 2,
        //         y: this.state.screen.height / 2,
        //     },
        //     create: this.createObject.bind(this),
        //     onDie: this.gameOver.bind(this),
        // });

        // send the user's ship to the socket
        this.props.socket.emit(`ship${this.props.player}`, {ship1: ship1})

        // save the ship object via the create object method
        // this.createObject(ship1, 'ship');
        // this.createObject(ship2, 'ship');

        // make the enemies
        // this.enemies = [];
        // this.generateEnemies(this.state.enemyCount);
    }

    // shipCreator(attrString, otherAttr) {
    //     console.log('attrstring is ', attrString);
    //     attrString = JSON.stringify(attrString);
    //     let attrPossibilities = {
    //         bodyColor: ['red', 'orange', 'green', 'blue', 'purple', 'white', 'brown', 'black'],
    //         wingShape: ['01', '02', '03', '04', '05'], 
    //         wingColor: ['red', 'orange', 'green', 'blue', 'purple', 'white', 'brown', 'black'], 
    //         tailShape: ['01', '02', '03', '04', '05'], 
    //         tailColor: ['red', 'orange', 'green', 'blue', 'purple', 'white', 'brown', 'black'], 
    //         cockpitShape: ['01', '02', '03', '04', '05'], 
    //         cockpitColor: ['red', 'orange', 'green', 'blue', 'purple', 'white', 'brown', 'black'], 
    //         speed: [0.8, 1, 1.5, 2], // how much movement it travels after each frame with a keydown,  
    //         inertia: [.88, .93, .97, .99], // how quickly it slows down after releasing a key: 0.5 = immediately, 1 = never; 
    //         shootingSpeed: [300, 35, 100, 250, 200, 75, 150], 
    //         smokeColor: ['#ff9999', '#b3ff99', '#ffffb3', '#80ffdf', '#99d6ff', '#c299ff', '#ff80df', '#ffffff'], 
    //     }

    //     let shipArgs = {
    //         bodyColor: attrPossibilities.bodyColor[parseInt(attrString[0]) % 8],
    //         wingShape: attrPossibilities.wingShape[parseInt(attrString[1]) % 5],
    //         wingColor: attrPossibilities.wingColor[parseInt(attrString[2]) % 8], 
    //         tailShape: attrPossibilities.tailShape[parseInt(attrString[3]) % 5],
    //         tailColor: attrPossibilities.tailColor[parseInt(attrString[4]) % 8],
    //         cockpitShape: attrPossibilities.cockpitShape[parseInt(attrString[5]) % 5],
    //         cockpitColor: attrPossibilities.cockpitColor[parseInt(attrString[6]) % 8],
    //         speed: attrPossibilities.speed[parseInt(attrString[7]) % 4],
    //         inertia: attrPossibilities.inertia[parseInt(attrString[8]) % 3],
    //         shootingSpeed: attrPossibilities.shootingSpeed[parseInt(attrString[9]) % 7],
    //         smokeColor: attrPossibilities.smokeColor[parseInt(attrString[10]) % 8],
    //         ingame: true,
    //     };
    //     return new Ship(Object.assign({}, shipArgs, otherAttr));
    // }

    // createObject(item, group) {
    //     this[group].push(item);
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

    updateObjects(items, group) {
        // go through each item of the specified group and delete them or call their render functions
        let index = 0;
        for (let item of items) {
            // if (item.delete) {
            //     // delete the object from the field
            //     this[group].splice(index, 1);
            // } else 
            
                // else call the render method attached to each object
                items[index].render(this.state);
        // }
            index++;
        }
    }

    checkCollisionsWith(items1, items2) {
        // loop through each item in one array, compare to each item in second array
        let a = items1.length - 1;
        let b;
        for (a; a >= 0; a--) {
            b = items2.length - 1;
            for (b; b >= 0; b--) {
                let item1 = items2[a];
                let item2 = items2[b];
                if (this.checkCollision(item1, item2)) {
                    // destroy if a collision is detected
                    item1.destroy();
                    item2.destroy();
                }
            }
        }
    }

    checkCollision(obj1, obj2) {
        let vx = obj1.position.x - obj2.position.x;
        let vy = obj1.position.y - obj2.position.y;
        // pythagorean theorem formula a^2 + b^2 = c^2 
        // gets the distance between the two objects based on their separation on the horizontal and vertical planes
        let length = Math.sqrt(vx * vx + vy * vy);
        // checks against the two radiuses added together
        // example 
            // obj 1 and 2 are 10 pixels away from each other's center
            // if their radius's are greater than 5 pixels, a collision is registered
        if (length < obj1.radius + obj2.radius) {
            return true;
        } else {
            return false;
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
                {/* <span className="controls" >
                    Use [A][S][W][D] or [←][↑][↓][→] to MOVE<br />
                    Use [SPACE] to SHOOT
                </span> */}
                <canvas ref="canvas"
                    width={this.state.screen.width * this.state.screen.ratio}
                    height={this.state.screen.height * this.state.screen.ratio}
                />
            </div>
        );
    }
}

export default Game;