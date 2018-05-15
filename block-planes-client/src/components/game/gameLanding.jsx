import React, { Component } from 'react';
import './gameLanding.css';
import { Grid } from 'semantic-ui-react';
import Friends from '../friends/friends.jsx';
import Hangar from '../hangar/hangar.jsx';

import { connect } from "react-redux";
import { selectPlane } from "../../actions/index";

const mapStateToProps = state => {
    return {
        selectedPlane: state.selectedPlane
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
    constructor(props) {
        super(props);
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

                { this.props.selectedPlane === null || this.props.selectedPlane === undefined ?
                    <div></div> : 
                    
                    <Grid.Row className='landing'>
                        <Grid.Column width={8}> 
                            <h3>Join Random</h3>
                        </Grid.Column>

                        <Grid.Column width={8}>
                            <h3>Challenge Friend</h3>
                            <Friends />
                        </Grid.Column>
                    </Grid.Row>
                }
            </Grid>
        )
    }
}

const GameLanding = connect(mapStateToProps, mapDispatchToProps)(ConnectedGameLanding);

export default GameLanding;