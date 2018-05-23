import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'

import Header from '../home/header.jsx';
import Home from '../home/home.jsx';
import Login from '../login/login.jsx';
import Signup from '../signup/signup.jsx';
import Profile from '../profile/profile.jsx';
import Friends from '../friends/friends.jsx';
import Marketplace from '../marketplace/marketplace.jsx';
import Leaderboard from '../leaderboard/leaderboard.jsx';
import Chat from '../chat/chat.jsx';
import Game from '../game/game.jsx';
import GameLanding from '../game/gameLanding.jsx';
import WaitingRoom from '../game/waitingRoom.jsx';
import SinglePlayer from '../singleplayer/SinglePlayer.js';


const Main = (props) => (
    <main onClick={props.toggleMenu}>
        {/* <Header logout={props.logout}/> */}
        <Switch>
        <Route exact path='/' render={() => <Redirect to={{ pathname: '/home' }} />} />
          <Route path='/home' component={Home} />
          <Route path='/login' render={() => <Login userId={props.userId} tokenLogin={props.tokenLogin} />} />
          <Route path='/signup' render={() => <Signup userId={props.userId} tokenLogin={props.tokenLogin} />} />
          <Route path='/profile' render={() => (sessionStorage.getItem('jwtToken') ? (<Profile  />) : (<Redirect to={{ pathname: '/login' }} />) )} />
          <Route path='/friends' render={() => (sessionStorage.getItem('jwtToken') ? (<Friends  toggleMenu={props.toggleMenu}/>) : (<Redirect to={{ pathname: '/login' }} />))} />
          <Route path='/chat' render={() => (sessionStorage.getItem('jwtToken') ? (<Chat  />) : (<Redirect to={{ pathname: '/login' }} />) )} />
          {/* <Route path='/game/:roomId' render={() => (sessionStorage.getItem('jwtToken') ? (<Game />) : (<Redirect to={{ pathname: '/login' }} />))} /> */}
          <Route path='/marketplace' render={() => (sessionStorage.getItem('jwtToken') ? (<Marketplace />) : (<Redirect to={{ pathname: '/login' }} />))} />
          <Route path='/leaderboard' render={() => (sessionStorage.getItem('jwtToken') ? (<Leaderboard />) : (<Redirect to={{ pathname: '/login' }} />))} />
          <Route path='/game' render={() => (sessionStorage.getItem('jwtToken') ? (<GameLanding />) : (<Redirect to={{ pathname: '/login' }} />))} /> 
          <Route path='/waitingRoom' render={() => (sessionStorage.getItem('jwtToken') ? (<WaitingRoom />) : (<Redirect to={{ pathname: '/login' }} />))} />
          <Route path='/singleplayer' render={() => (sessionStorage.getItem('jwtToken') ? (<SinglePlayer />) : (<Redirect to={{ pathname: '/login' }} />))} />
        </Switch>
    </main>
)

export default Main;