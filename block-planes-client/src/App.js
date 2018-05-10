import React, { Component } from 'react';
import {  BrowserRouter} from 'react-router-dom';
import axios from 'axios';
import { connect } from "react-redux";
import { logIn, logOut} from "./actions/index"

import Main from './components/main/main.jsx';
import './App.css';
import jwtDecode from 'jwt-decode';

const mapDispatchToProps = dispatch => {
  return {
    logIn: user => dispatch(logIn(user)),
    logOut: () => dispatch(logOut()),
  };
};

const mapStateToProps = state => {
  return {
    id: state.id,
    username: state.username,
    profilePicture: state.profilePicture,
    fullName: state.fullName,
    totalPoints: state.totalPoints,
    createdAt: state.createdAt
  };
};

// use this.props.logIn(user) and this.props.logOut() instead of setState

class ConnectedApp extends Component {
  constructor() {
    super();
    this.logout = this.logout.bind(this);
    this.tokenLogin = this.tokenLogin.bind(this);
  }

  componentDidMount() {
    this.tokenLogin();
  }

  tokenLogin() {
    console.log('this is the jwt token', sessionStorage.getItem('jwtToken'));
    if (sessionStorage.getItem('jwtToken')) {
      axios
      .get('/signInToken', {
        params: {
          token: sessionStorage.getItem('jwtToken')
        }
      })
      .then(response => {
        this.props.logIn({
          id: response.data.user.id,
          username: response.data.user.username,
          profilePicture: response.data.user.profilePicture,
          fullName: response.data.user.fullName,
          totalPoints: response.data.user.totalPoints,
          createdAt: response.data.user.createdAt,
          tokenLogin: this.tokenLogin
        });
      })
      .catch(err => {
        console.log('Error getting session id', err);
      });
  }
}

  logout() {
    sessionStorage.removeItem('jwtToken');
    this.props.logOut();
  }

  render() {
    var component = this;
    return (
      <div className="App">
        <BrowserRouter>
          <Main tokenLogin={this.tokenLogin} logout={this.logout}/>
        </BrowserRouter>
      </div>
    );
  }
}

const App = connect(mapStateToProps, mapDispatchToProps)(ConnectedApp);

export default App;
