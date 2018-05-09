import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'

import Header from '../home/header.jsx';
import Home from '../home/home.jsx';
import Login from '../login/login.jsx';
import Signup from '../signup/signup.jsx';
import Collection from '../collection/collection.jsx';
import Marketplace from '../marketplace/marketplace.jsx';
import Game from '../game/game.jsx';

const Main = (props) => (
    <main>
        <Header userId={props.userId} username={props.username} logout={props.logout}/>
        <Switch>
        <Route exact path='/' render={() => <Redirect to={{ pathname: '/home' }} />} />
            <Route path='/home' component={Home} />
            <Route path='/login' render={() => <Login userId={props.userId} tokenLogin={props.tokenLogin} />} />
            <Route path='/signup' render={() => <Signup userId={props.userId} tokenLogin={props.tokenLogin} />} />
            <Route path='/collection' render={() => (sessionStorage.getItem('jwtToken') ?
            (<Collection  />)
            : (<Redirect to={{
              pathname: '/login'
            }} />)
          )} />
            <Route path='/marketplace' component={Marketplace} />
            <Route path='/game' component={Game} />
        </Switch>
    </main>
)

export default Main;