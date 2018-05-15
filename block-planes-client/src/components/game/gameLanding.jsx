import React, { Component } from 'react';
import { Link, Redirect } from 'react-router';
import './gameLanding.css';
import { Grid, Button } from 'semantic-ui-react';
import Friends from '../friends/friends.jsx';
import Hangar from '../hangar/hangar.jsx';
import WaitingRoom from './waitingRoom.jsx';

import { connect } from "react-redux";
import { selectPlane } from "../../actions/index";

const mapStateToProps = state => {
    return {
        selectedPlane: state.selectedPlane,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        // storeUserAddress: address => dispatch(storeUserAddress(address)),
        logOut: () => dispatch(logOut()),
        storePlanes: user => dispatch(storePlanes(user)),
    };
};

class ConnectedGameLanding extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            selectedFriend: false,
            play: false
        }
    }

    selectFriend(friend) {
        console.log('setting friend', friend);
        this.setState({ selectedFriend: friend })
    }

    joinGame() {
        // redirect to waiting room component with props friend: this.state.selectedFriend
        console.log(this.context)
        this.setState({ play: true });
    }

    render() {
        return (
            <Grid>
                <Grid.Row>
                </Grid.Row>

                <Grid.Row className='landing'>
                    <Grid.Column width={16}>
                        <h3> Select a Plane </h3>
                        <Hangar />
                    </Grid.Column>
                </Grid.Row>

                { typeof(this.props.selectedPlane) !== 'number' ?
                    <div></div> : 
                    
                    <Grid.Row className='landing'>
                        <Grid.Column width={8}> 
                            <h3>Join Random</h3>
                        </Grid.Column>

                        <Grid.Column width={8}>
                            <h3>Challenge Friend</h3>
                            <Friends selectFriend={this.selectFriend.bind(this)}/>
                        </Grid.Column>
                    </Grid.Row>
                }

                { this.state.selectedFriend ? 
                    <Grid.Row className='landing'>
                        <Grid.Column width={8}>
                            <Button onClick={() => this.joinGame()}>
                            </Button>
                        </Grid.Column>
                    </Grid.Row>    :
                    <div></div>
                }

                {
                    this.state.play ? 
                    <Redirect to="/waitingRoom" params={{ friend: this.state.selectedFriend }} />:
                    <div></div>
                }
            </Grid>
        )
    }
}

const GameLanding = connect(mapStateToProps, mapDispatchToProps)(ConnectedGameLanding);

export default GameLanding;