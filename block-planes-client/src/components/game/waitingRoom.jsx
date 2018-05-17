import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import './waitingRoom.css';
import io from 'socket.io-client/dist/socket.io.js';
import randomstring from 'randomstring';

import Ship from './gameObjects/ship';
import { randomNumBetweenExcluding } from './gameObjects/helpers';
// import { saveSocket } from "../../actions/index";

import Game from './game.jsx';

const mapStateToProps = state => {
    return {
        ship: state.selectedPlane,
    };
};

// const mapDispatchToProps = dispatch => {
//     return {
//         saveSocket: socket => dispatch(saveSocket(socket))
//     }
// }

class ConnectedWaitingRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oppReady: false,
            youReady: false,
            roomId: false,
            player: null,
        }
        this.ready = this.ready.bind(this);
        // this.checkStart = this.checkStart.bind(this);
    }

    componentWillMount() {
        // checks if a room exists in props already
        let roomId;
        if (!this.props.roomId || !this.state.roomId) {
            // no room exists in props, so this is a game that we have started
            // we will generate a random string
            roomId = randomstring.generate();
        }

        let player = !this.props.roomId ? 1 : 2;

        const socket = io.connect('http://localhost:2345', {
            query: {
                // if there is no room in props, we created the game, so we will use the random room string
                roomId: !this.props.roomId ? roomId : this.props.roomId,
                // if there is no room in props, we created the game, so we will be player 1 
                player: player,
                ship: this.props.ship,
            }
        });
        // save the socket connection and the room in state
        // this.props.saveSocket(socket);
        this.setState({ socket, roomId, player }, () => console.log('state updated'));
    }

    componentDidMount() {
        const socket = this.state.socket;

        
        socket.once('p1_ready', ({ p1_ship }) => {
            if (this.state.player === 2) {
                this.setState({ oppReady: true, p1_ship  })//, () => this.checkStart());
            } else if (this.state.player === 1) { 
                this.setState({ youReady: true, p1_ship })//, () => this.checkStart());
            }
        });
      
        socket.once('p2_ready', ({ p2_ship }) => {
            if (this.state.player === 1) {
                this.setState({ oppReady: true, p2_ship })//, () => this.checkStart());
            } else if (this.state.player === 2) {
                this.setState({ youReady: true, p2_ship })//, () => this.checkStart());
            }
        });
    }

    // checkStart() {
    //     if (this.state.socket !== null) {
    //         console.log('props.socket is not null')
    //         if (this.state.youReady) {
    //             console.log('state.youready is truthys')
    //             <Redirect to={'/game/'} />
    //             // this.props.history.push({
    //             //     pathname: `/game/${this.state.roomId}`,
    //             //     state: {
    //             //         p1_ship: this.state.p1_ship,
    //             //         player: this.state.player, 
    //             //         socket: this.state.socket,
    //             //     }
    //             // })
    //         }
    //     }
    // }

    ready() {
        const socket = this.state.socket;
        socket.emit(`p${this.state.player}_ready`, { player: this.state.player, roomId: this.state.roomId, ship: this.props.ship });
    }

    render() {
        // this.checkStart();
        return (
            <div>
                {
                    !this.state.youReady ? 
                        (<div className='ready'>
                            <h3 id='text'>Game ID: </h3>
                            <h4 id='text'>{this.state.roomId}</h4>
                            <h1 id='text'>Please prepare yourself and press "READY" when you're good to go!</h1>
                            <button disabled={this.state.youReady} onClick={() => this.ready()}>Ready</button>
                            <h6 id='text'>{this.state.oppReady ? 'Opponent is ready' : 'Waiting for opponent to be ready'}<br/>
                                {this.state.youReady ? 'You are ready' : ''}</h6>
                        </div>) : 
                        <div></div>
                }

                {
                    this.state.youReady ? 
                    <Game
                    //  to={{
                            // pathname: `/game/${this.state.roomId}`, 
                            // state: {
                                socket= {this.state.socket} 
                                player= {this.state.player} 
                                p1_ship= {this.props.ship} 
                                p2_ship= {this.state.p2_ship} 
                            // }
                    // }}
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