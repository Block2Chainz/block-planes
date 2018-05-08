import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Image, Form, Grid, Button } from 'semantic-ui-react';
import LogInOutButton from './logInOutButton.jsx';
import './header.css';


class Header extends Component {
    constructor(props) {
        super(props);
        loggedIn: false;
      }

    render() {
        console.log('header id', this.props.username);
        return (
    <div>
    <header className='login-header' >
    <Grid>
            <Grid.Row>
              <Grid.Column width={3}>
              <Link to='/home'><h1 className='title' >BlockPlanes</h1></Link>
              </Grid.Column>
              <Grid.Column width={4}>
              <h5 className='userheader'>Current Pilot: {this.props.username}</h5>
              </Grid.Column>
              <Grid.Column width={2}>
              <Link to='/collection'><Button className='ui inverted button' size={'small'}>Collection</Button></Link>
              </Grid.Column>
               <Grid.Column width={2}>
               <Link to='/marketplace'><Button className='ui inverted button' size={'small'}>Marketplace</Button></Link>
              </Grid.Column>
              <Grid.Column width={2}>
              <Link to='/game'><Button className='ui inverted button' size={'small'}>Find Game</Button></Link>
              </Grid.Column>
              <Grid.Column width={3}>
              <LogInOutButton userId={this.props.userId} logout={this.props.logout}/>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          </header>
      </div>
);
    }
}

export default Header;