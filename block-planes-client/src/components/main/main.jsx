import React from 'react';
import { Switch, Route } from 'react-router-dom'

import Header from '../home/header.jsx';
import Home from '../home/home.jsx';
import Login from '../login/login.jsx';
import Profile from '../profile/profile.jsx';
import Game from '../game/game.jsx';


const Main = () => (
    <main>
        <Header />
        <Switch>
            <Route path='/home' component={Home} />
            <Route path='/login' component={Login} />
            <Route path='/profile' component={Profile} />
            <Route path='/game' component={Game} />
        </Switch>
    </main>
)

export default Main;
