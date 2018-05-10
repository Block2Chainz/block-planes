import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'

import Header from '../home/header.jsx';
import Home from '../home/home.jsx';
import Login from '../login/login.jsx';
import Signup from '../signup/signup.jsx';
import Profile from '../profile/profile.jsx';
import Friends from '../friends/friends.jsx';
import Marketplace from '../marketplace/marketplace.jsx';
import Game from '../game/game.jsx';

/* <Main 
userId={this.state.id} 

username={this.state.username} 

tokenLogin={this.tokenLogin} 

logout={this.logout} /> */


const Main = (props) => (
    <main>
        <Header logout={props.logout}/>
        <Switch>
        <Route exact path='/' render={() => <Redirect to={{ pathname: '/home' }} />} />
            <Route path='/home' component={Home} />
            <Route path='/login' render={() => <Login userId={props.userId} tokenLogin={props.tokenLogin} />} />
            <Route path='/signup' render={() => <Signup userId={props.userId} tokenLogin={props.tokenLogin} />} />
            <Route path='/profile' render={() => (sessionStorage.getItem('jwtToken') ?
            (<Profile  />)
            : (<Redirect to={{
              pathname: '/login'
            }} />)
          )} />
            <Route path='/friends' component={Friends} />
            <Route path='/marketplace' component={Marketplace} />
            <Route path='/game' component={Game} />
        </Switch>
    </main>
)

export default Main;