import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import { Image, Form, Grid, Button } from 'semantic-ui-react';
import { toggleChatVisibility } from "../../actions/index.js";
import LogInOutButton from './logInOutButton.jsx';
import './header.css';


const mapStateToProps = state => {
    return { 
        userId: state.id, 
        loggedIn: state.loggedIn,
        username: state.username,
        chatVisible: state.chatVisible
    };
};


class ConnectedHeader extends Component {
    constructor(props) {
        super(props);
        loggedIn: false;
      }

    render() {
        return (
            <div>
                <header className='login-header' >
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={2}>
                                <Link to='/home'><h1 className='title' >BlockPlanes</h1></Link>
                            </Grid.Column>
                            <Grid.Column width={2}>
                                <Link to='/profile'><Button className='ui inverted button' size={'small'}>Profile</Button></Link>
                            </Grid.Column>
                            <Grid.Column width={2}>
                                <Link to='/friends'><Button className='ui inverted button' size={'small'}>Friends</Button></Link>
                            </Grid.Column>
                            <Grid.Column width={2}>
                                <Link to='/chat'><Button className='ui inverted button' size={'small'}>Chat</Button></Link>
                            </Grid.Column>
                            <Grid.Column width={2}>
                                <Link to='/marketplace'><Button className='ui inverted button' size={'small'}>Marketplace</Button></Link>
                            </Grid.Column>
                            <Grid.Column width={2}>
                                <Link to='/leaderboard'><Button className='ui inverted button' size={'small'}>Leaderboard</Button></Link>
                            </Grid.Column>
                            <Grid.Column width={2}>
                                <Link to='/game'><Button className='ui inverted button' size={'small'}>Find Game</Button></Link>
                            </Grid.Column>
                            <Grid.Column width={2}>
                                <LogInOutButton logout={this.props.logout} />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </header>
            </div>
        );
    }
}


const Header = connect(mapStateToProps)(ConnectedHeader);

export default Header;