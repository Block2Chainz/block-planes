import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'

import Header from '../home/header.jsx';
import Home from '../home/home.jsx';
import Login from '../login/login.jsx';
import Signup from '../signup/signup.jsx';
import Collection from '../collection/collection.jsx';
import Marketplace from '../marketplace/marketplace.jsx';
import Game from '../game/game.jsx';


const Main = () => (
    <main>
        <Header />
        <Switch>
        <Route exact path='/' render={() => <Redirect to={{ pathname: '/home' }} />} />
            <Route path='/home' component={Home} />
            <Route path='/login' component={Login} />
            <Route path='/signup' component={Signup} />
            <Route path='/collection' component={Collection} />
            <Route path='/marketplace' component={Marketplace} />
            <Route path='/game' component={Game} />
        </Switch>
    </main>
)

export default Main;
