import React, { Component } from 'react';
import './game.css';
import Ship from './Ship';
import Enemy from './Enemy';
import { randomNumBetweenExcluding } from './helpers'

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
    constructor() {
        super();
        this.state = {
            screen: {
                width: window.innerWidth,
                height: window.innerHeight,
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
    }

    render() {
        return (
            <div className="game">
                PEW PEW PEW PACHOW
            </div>
        );
    }
}

export default Game;