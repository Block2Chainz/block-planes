import React, { Component } from 'react';
import './game.css';
// import io from 'socket.io-client/dist/socket.io.js';
import Ship from './gameObjects/ship.js';
import Enemy from './gameObjects/enemy.js';
import Bullet from './gameObjects/bullet.js';
import { randomNumBetweenExcluding } from './gameObjects/helpers'
import Particle from './gameObjects/particle.js';
import axios from 'axios';
import PowerUp from './gameObjects/powerUp';

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
                width: 1700,
                height: 1200,
                ratio: window.devicePixelRadio || 1
            },
            keys: {
                left  : false,
                right : false,
                up    : false, 
                space : false, 
            }, 
            inGame: false,
            scores: { 1: 0, 2: 0 },
            lives: 0
        }
        this.ship = {};
        this.enemies = {};
        this.bullets = {    1: [],
                            2: [], 
                            3: []};
        this.particles = {  1: [], 
                            2: [],
                            3: []};

        this.powerUps = [];
        this.enemies = [];
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
        2: [{particle}, {particle}, {particle}],
        3: [{particle}]
    },
    enemies: [{enemy}, {enemy}, {enemy}, {enemy}],
    powerUps: [{powerUp}, {powerUp}, {powerUp}, {powerUp}],
    scores: {
        1: number,
        2: number
    }
}*/
        this.savedMoves = [];
        this.background = new Image();
        this.background.src = `https://s3-us-west-1.amazonaws.com/blockplanes/background.png`;
    }

    componentDidMount() {
        const socket = this.props.socket;
        window.addEventListener('keyup', this.handleKeys.bind(this, false));
        window.addEventListener('keydown', this.handleKeys.bind(this, true));
        // set variable 'context' to the canvas and save to state
        const context = this.refs.canvas.getContext('2d');
        this.setState({ context });
        // set up listeners
        socket.on('server_state', (payload) => this.serverUpdate(payload));
        socket.on('ship1', payload => {});
        socket.on('ship2', payload => {});
        socket.on('powered_up', payload => this.powerUpHandler(payload));
        socket.on('player_died', payload => this.playerDied(payload));
        socket.on('player_respawn', payload => this.respawn(payload));
        socket.on('game_over', () => this.gameOver());
        // start the game
        this.startGame();
    }
    
    componentWillUnmount() {
        // remove the listeners
        window.cancelAnimationFrame(this.update);
        window.removeEventListener('keyup', this.handleKeys);
        window.removeEventListener('keydown', this.handleKeys);
        window.removeEventListener('resize', this.handleResize);
        this.props.socket.emit('disconnect', { player: this.props.player }); // tells the server to disconnect
        this.props.socket.disconnect();
        clearInterval(this.interval);
    }
    
    handleKeys(value, e) {
        const socket = this.props.socket;
        let keys = this.state.keys;
        if (e.keyCode === KEY.LEFT || e.keyCode === KEY.A) keys.left = value;
        if (e.keyCode === KEY.RIGHT || e.keyCode === KEY.D) keys.right = value;
        if (e.keyCode === KEY.UP || e.keyCode === KEY.W) keys.up = value;
        if (e.keyCode === KEY.SPACE) keys.space = value;
        this.setState({ keys });
    }
    
    powerUpHandler(payload) {
        this.ship[payload.player].powerUp(payload);
    };

    serverUpdate(payload) {
        // update the other player's stuff
        if (this.props.player === 1) {
            // if (payload.peers[1].delete === true) this.ship[1].destroy();
            this.ship[2].update(payload.peers[2]);
            this.updateOMatic(payload.bullets[2], 'bullets', 2);
            this.updateOMatic(payload.particles[2], 'particles', 2);
        } else if (this.props.player === 2) {
            // if (payload.peers[2].delete === true) this.ship[2].destroy();
            this.ship[1].update(payload.peers[1]);
            this.updateOMatic(payload.bullets[1], 'bullets', 1);
            this.updateOMatic(payload.particles[1], 'particles', 1);
        }
        this.updateOMatic(payload.particles[3], 'particles', 3);
        this.updateOMatic(payload.bullets[3], 'bullets', 3);
        this.updateOMatic(payload.powerUps, 'powerUps');
        this.updateOMatic(payload.enemies, 'enemies');
        this.setState({
            scores: {
                1: payload.scores[1],
                2: payload.scores[2]
            }, 
            lives: payload.lives
        })
    }
    
    updateOMatic(pending, type, otherPlayer) {
        if (type === 'bullets' || type === 'particles') {
            // get a list of all the bullet data coming in
            let otherItems = this[type][otherPlayer];
            // loop through the list and update the bullets we have
            for (let i = 0; i < pending.length; i++) {
                // if there is a bullet on the server at the index, but no bullet at the index of our array
                if (otherItems[i] === undefined) {
                    if (type === 'bullets') {
                        otherItems.push(new Bullet({
                            position: { x: pending[i].x, 
                                        y: pending[i].y},
                            owner: otherPlayer,
                            player: this.props.player,
                            rotation: pending[i].rotation,
                        }));
                    } else if (type === 'particles') {
                        otherItems.push(new Particle({
                            position: {
                                x: pending[i].x,
                                y: pending[i].y,
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
                if (otherItems.length > pending.length) otherItems.splice(pending.length);
                else {
                    // item exists, update its positioning
                    otherItems[i].update(pending[i]);
                }
            }
            if (otherItems.length > pending.length) otherItems.splice(pending.length);
        } else {
            for (let i = 0; i < pending.length; i++) {
                if (this[type][i] === undefined) {
                    if (type === 'enemies') {
                        this[type].push(new Enemy(pending[i]));
                    } else if (type === 'powerUps') {
                        this[type].push(new PowerUp(pending[i]));
                    }
                } else {
                    this[type][i].update(pending[i]);
                }
            }
            if (this[type].length > pending.length) this[type].splice(pending.length);
        }
    }
    
    update() {
        // for updating the new positions of everything
        const context = this.state.context;
        context.save();
        context.scale(this.state.screen.ratio, this.state.screen.ratio);
        context.drawImage(this.background, 0, 0);
        // add motion trails
        context.fillStyle = '#000';
        context.globalAlpha = 0.4;
        context.fillRect(0, 0, this.state.screen.width, this.state.screen.height);
        context.globalAlpha = 1;
        // remove or render
        this.updateObjects(this.ship);
        this.updateArray(this.bullets['1'], 'bullets');
        this.updateArray(this.bullets['2'], 'bullets');
        this.updateArray(this.bullets['3'], 'bullets');
        this.updateArray(this.particles['1'], 'particles');
        this.updateArray(this.particles['2'], 'particles');
        this.updateArray(this.particles['3'], 'particles');
        this.updateArray(this.enemies, 'enemies');
        this.updateArray(this.powerUps, 'powerUps');
        context.restore();
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
            if (!items[key].delete) {            
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
        this.setState({ inGame: true, currentScore: 0, sentScores: false });
        const socket = this.props.socket;
        let ship1 = new Ship({
            id: 1,
            attr: this.props.p1_ship, 
            position: {
                x: this.state.screen.width / 2 - 25,
                y: this.state.screen.height / 2 - 25 ,
            }, 
            player: this.props.player,
            emitUpdate: this.emitUpdate.bind(this),
            ingame: true,
            create: this.createObject.bind(this), 
        });
        let ship2 = new Ship({
            id: 2,
            attr: this.props.p2_ship,
            position: {
                x: this.state.screen.width / 2 + 25,
                y: this.state.screen.height / 2 + 25,
            }, 
            player: this.props.player,
            emitUpdate: this.emitUpdate.bind(this),
            ingame: true,
            create: this.createObject.bind(this),
        });
        this.ship['1'] = ship1;
        this.ship['2'] = ship2;

        socket.emit(`shipGeneration`, { ship1: this.props.p1_ship, ship2: this.props.p2_ship});
        this.interval = setInterval(() => { this.update() }, 1000 / 60);   
    }
    
    createObject(item, group, player) {
        this[group][player].push(item);
    }

    playerDied(payload) {
        this.setState({ lives: payload.lives }, () => {
            this.ship[payload.player].destroy();
        });
    }

    restart() {
        this.setState({ inGame: true, currentScore: 0, sentScores: false });
        this.props.socket.emit('restart');
        this.ship[1].ingame = true;
        this.ship[2].ingame = true;
        this.interval = setInterval(() => { this.update() }, 1000 / 60);
    }

    respawn(payload) {
        this.ship[payload.owner].position = { x: this.state.screen.width / 2, y: this.state.screen.height / 2 };
        this.ship[payload.owner].targetPosition = { x: this.state.screen.width / 2, y: this.state.screen.height / 2 };
        this.ship[payload.owner].ingame = true;
        this.ship[payload.owner].delete = false;
        this.ship[payload.owner].powerUp({type: 'invincible'});
    }

    gameOver(payload) {
        this.ship[1].ingame = false;
        this.ship[2].ingame = false;
        clearInterval(this.interval);
        // send the score to the db
        if (!this.state.sentScores) {
            axios.post('/scores', { user: this.props.userId, score: this.props.player === 1 ? this.state.scores[1] : this.state.scores[2] })
            .then(response => {
                console.log(response);
            }).catch(err => {
                console.log(err);
            });
        }
        this.setState({ inGame: false, sentScores: true });
    }
        
    render() {
        let endgame;
        let message;
        
        if (!this.state.inGame) {

            endgame = (
                <div className="endgame">
                <p>Game over</p>
                <button
                    onClick={this.restart.bind(this)}>
                    try again?
                </button>
            </div>
        )}
        
        return (

            <div>
                {endgame}

                <span className='stats'>
                    <div className="score lives" >Lives: {this.state.lives}</div>
                    <div className="score current-score" >Your Score: { this.props.player === 1 ? this.state.scores[1] : this.state.scores[2] }</div>
                    <div className="score top-score" >Friend Score: { this.props.player === 1 ? this.state.scores[2] : this.state.scores[1] }</div>
                    <div className="barunderscore" ></div>
                </span>

                <canvas ref="canvas" className='game canvas-multi-player'
                    width={this.state.screen.width * this.state.screen.ratio}
                    height={this.state.screen.height * this.state.screen.ratio}
                />
            </div>
        );
    }
}

export default Game;