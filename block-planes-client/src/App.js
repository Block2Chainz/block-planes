import React, { Component } from 'react';
import axios from 'axios';
import Main from './components/main/main.jsx';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      id: '',
      username: '',
      profilePic: '',
      fullName: '',
      totalPoints: '',
      hasSession: false
    };
    this.setAuth = this.setAuth.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    this.getSessionId();
  }

  fetchUserInfo() {
    var thisIndex = this;
    console.log('start fetchuser', this.state);
    axios.get('/user', {
      params: {
        userId: thisIndex.state.id
      }
    })
      .then(function (response) {
        console.log('fetchUser back from db',response);
        thisIndex.setState({
          username: response.data[0].username,
          profilePic: response.data[0].profile_picture,
          fullName: response.data[0].full_name,
          totalPoints: response.data[0].total_points
        });
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  getSessionId() {
    console.log('running getSessionId', this.state);
    axios
      .get('/userSession')
      .then(response => {
        if (response.data.id) {
          this.setState({
            id: response.data.id,
            hasSession: true
          }, function() {
            this.fetchUserInfo();
          });
          console.log('getSessionId set state', this.state);
        } else {
          this.setState({
            hasSession: true
          }, function() {
            this.fetchUserInfo();
          });
        }
      })
      .catch(err => {
        console.log('Error getting session id', err);
      });
  }

  logout() {
    axios.get('/logout')
      .catch(err => {
        console.log('Error on logout:', err);
      });
    this.setState({ id: '', username: '', profilePic: '', fullName: '', totalPoints: '' });
  }

  isAuthenticated() {
    return !!this.state.id;
  }

  setAuth(id) {
    this.setState({ id: id });
  }

  render() {
    var component = this;
    return (
      <div className="App">
        <Main userId={this.state.id} username={this.state.username} setAuth={(id) => component.setAuth(id)} logout={this.logout} isAuthenticated={this.isAuthenticated}/>
      </div>
    );
  }
}

export default App;
