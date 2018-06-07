import { } from 'dotenv/config'
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import './waitingRoom.css';
import io from 'socket.io-client/dist/socket.io.js';
import randomstring from 'randomstring';

import Ship from './gameObjects/ship';
import { randomNumBetweenExcluding } from './gameObjects/helpers';

import Game from './game.jsx';

const mapStateToProps = state => {
    return {
        ship: state.selectedPlane,
        user: state.id,
    };
};

class ConnectedWaitingRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oppReady: false,
            youReady: false,
            roomId: false,
            player: null,
            bool: true,
        }
        this.ready = this.ready.bind(this);
        // this.checkStart = this.checkStart.bind(this);
    }

    componentWillMount() {
        // checks if a room exists in props already
        let player = this.props.location.state.player;
        let roomId = this.props.location.state.roomId;
        let socket = io.connect(process.env.REACT_APP_GAME_PORT, {
            query: {
                // if there is no room in props, we created the game, so we will use the random room string
                roomId,
                // if there is no room in props, we created the game, so we will be player 1 
                player,
                ship: this.props.ship,
            }
        });
        // save the socket connection and the room in state
        this.setState({ socket, roomId, player });
        //send notification
    }

    componentDidMount() {
        const socket = this.state.socket;
        socket.once('p1_ready', payload => {
            if (this.state.player === 2) {
                this.setState({ oppReady: true, p1_ship: payload, bool: false  });
            } else if (this.state.player === 1) { 
                this.setState({ youReady: true, p1_ship: payload, bool: false });
            }
        });
        socket.once('p2_ready', payload => {
            if (this.state.player === 1) {
                this.setState({ oppReady: true, p2_ship: payload, bool: false });
            } else if (this.state.player === 2) {
                this.setState({ youReady: true, p2_ship: payload, bool: false });
            }
        });
        socket.on('connected', payload => {
            if (this.state.player !== parseInt(payload.player)) {
                this.enableButton();
            }
        });
    }

    enableButton() {
        this.setState({ bool: false })
    }

    ready() {
        const socket = this.state.socket;
        socket.emit(`p${this.state.player}_ready`, { player: this.state.player, roomId: this.state.roomId, ship: this.props.ship });
    }

    render() {
        return (
            <div>
                {
                    !this.state.youReady || !this.state.oppReady? 
                        (<div className='ready'>
                            <h3 id='text'>Game ID: </h3>
                            <h4 id='text'>{this.state.roomId}</h4>
                            <h1 id='text'>Please prepare yourself and press "READY" when you're good to go!</h1>
                            <button disabled={ this.state.bool } onClick={() => this.ready()}>{this.state.bool ? 'Waiting for Opponent' : 'Ready'}</button>
                            <h6 id='text'>{this.state.oppReady ? 'Opponent is ready' : 'Waiting for opponent to be ready'}<br/>
                                {this.state.youReady ? 'You are ready' : ''}</h6>
                        </div>) : 
                        <div></div>
                }

                {
                    this.state.youReady && this.state.oppReady? 
                    <Game
                                userId= {this.props.user}
                                socket= {this.state.socket} 
                                player= {this.state.player} 
                                p1_ship= {this.state.p1_ship} 
                                p2_ship= {this.state.p2_ship} 
                    />
                :
                    <div></div>
                }
            </div>
        )
    }
}

const WaitingRoom = withRouter(connect(mapStateToProps)(ConnectedWaitingRoom));

export default WaitingRoom;