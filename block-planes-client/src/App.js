import React, { Component } from 'react';
import axios from 'axios';
import Main from './components/main/main.jsx';
import './App.css';
import jwtDecode from 'jwt-decode';

class App extends Component {
  constructor() {
    super();
    this.state = {
      id: '',
      username: '',
      profilePic: '',
      fullName: '',
      totalPoints: '',
      createdAt: '',
      hasSession: false
    };
    this.logout = this.logout.bind(this);
    this.tokenLogin = this.tokenLogin.bind(this);
  }

  componentDidMount() {
    this.tokenLogin();
  }

  tokenLogin() {
    if (sessionStorage.getItem('jwtToken')) {
      axios
      .get('/signInToken', {
        params: {
          token: sessionStorage.getItem('jwtToken')
        }
      })
      .then(response => {
        this.setState({
          id: response.data.user.id,
          username: response.data.user.username,
          profilePic: response.data.user.profilePicture,
          fullName: response.data.user.fullName,
          totalPoints: response.data.user.totalPoints,
          createdAt: response.data.user.createdAt
        });
      })
      .catch(err => {
        console.log('Error getting session id', err);
      });
  }
}

  logout() {
    sessionStorage.removeItem('jwtToken');
    this.setState({ id: '', username: '', profilePic: '', fullName: '', totalPoints: '' });
  }

  render() {
    var component = this;
    return (
      <div className="App">
        <Main userId={this.state.id} username={this.state.username} tokenLogin={this.tokenLogin} logout={this.logout}/>
      </div>
    );
  }
}

export default App;
