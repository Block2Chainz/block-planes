import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Image, Form, Grid, Button } from 'semantic-ui-react';
import { connect } from "react-redux";
import Moment from 'moment';
import SearchUsers from './searchChatBar.jsx';
import FriendsDropDown from './chatDropDown.jsx';
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import cryptoPlanes from '../../../../block-planes-solidity/BlockPlanes/build/contracts/BlockPlanes.json';
// import Plane from '../plane/plane.jsx';
import axios from 'axios';
import MessageInput from './messageInput.jsx';
import MessageList from './messageList.jsx';
import { animateScroll } from "react-scroll";
import Socketio from 'socket.io-client';
import './chat.css';

const mapStateToProps = state => {
  return {
    userId: state.id
  };
};

class ConnectedFriends extends Component {
  constructor(props) {
    super(props);
    this.state = {
      friendId: '',
      username: '',
      profilePicture: '',
      fullName: '',
      totalPoints: '',
      createdAt: '',
      friends: [],
      messages: []
    };
    this.updateFriendsPage = this.updateFriendsPage.bind(this);
    this.fetchFriends = this.fetchFriends.bind(this);
    this.fetchMessages = this.fetchMessages.bind(this);
    this.socket = Socketio('http://localhost:4225');
  }

  componentDidMount() {
    let component = this;
    this.updateFriendsPage();
    this.scrollToBottom();
    this.socket.on('returnmessage', function (message) {
      if ((component.props.userId === message.userId) || (component.props.userId === message.friendId)) {
        component.fetchMessages();
      }
    });
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

scrollToBottom() {
  var someElement = document.querySelector('.inner');
  if (someElement) {
    someElement.scrollTop = someElement.scrollHeight;
  }
}

  updateFriendsPage(user) {
    if (!user) {
      this.fetchFriends();
    } else {
      this.setState({
        friendId: user.id,
        username: user.title,
        profilePicture: user.image,
        fullName: '',
        totalPoints: user.totalPoints,
        createdAt: user.createdAt
      }, function() {
        this.fetchFriends();
      });
    }
  }

  fetchFriends() {
    let component = this;
    axios
      .get('/friendsFetch', {
        params: {
          id: this.props.userId
        }
        })
      .then(response => {
          component.setState({
            friends: response.data
          }, function() {
            this.fetchMessages();
          });
      })
      .catch(err => {
        console.log('Error from login', err);
      });
  }

  fetchMessages() {
    let component = this;
    axios
      .get('/messages', {
        params: {
          id: component.props.userId,
          friendId: component.state.friendId
        }
        })
      .then(response => {
          component.setState({
            messages: response.data
          }, function() {
            component.scrollToBottom();
          });
      })
      .catch(err => {
        console.log('Error from login', err);
      });
  }

    render() {
      if (this.state.friendId) {
        return (
            <Grid>
              <Grid.Row >
          </Grid.Row>
          <Grid.Row className='searchbar'> <p className='text1' >Select a Friend: </p>
          <FriendsDropDown friends={this.state.friends} updateFriendsPage={(user) => this.updateFriendsPage(user)}/>
          <p className='text2'>Or Search Users: </p>
            <SearchUsers className='searchusersbar' updateFriendsPage={(user) => this.updateFriendsPage(user)}/>
          </Grid.Row>
          <Grid.Row className='borderfriends'>
          </Grid.Row>
          <div className='chatview'>
          <div id='totes' className='inner'>
                 <MessageList id={this.props.userId} messages={this.state.messages} />
                 </div>
                 </div>
                 <div className='footer'>
                 <MessageInput className='footer' friendId={this.state.friendId} username={this.state.username} userId={this.props.userId} fetchMessages={this.fetchMessages}/>
                 </div>
          </Grid>
        );
      } else {
        return (
          <Grid>
       <Grid.Row >
          </Grid.Row>
          <Grid.Row className='searchbar'> <p className='text1' >Select a Friend: </p>
          <FriendsDropDown friends={this.state.friends} updateFriendsPage={(user) => this.updateFriendsPage(user)}/>
          <p className='text2'>Or Search Users: </p>
            <SearchUsers className='searchusersbar' updateFriendsPage={(user) => this.updateFriendsPage(user)}/>
          </Grid.Row>
        </Grid>
        );
      }
    }
}

const Friends = connect(mapStateToProps)(ConnectedFriends);

export default Friends;