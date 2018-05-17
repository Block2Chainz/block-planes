import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Image, Form, Grid, Button } from 'semantic-ui-react';
import { connect } from "react-redux";
import Moment from 'moment';
import SearchUsers from './searchUsersBar.jsx';
import AddFriendButton from './addFriendButton.jsx';
import DeleteFriendButton from './deleteFriendButton.jsx';
import FriendsDropDown from './friendsDropDown.jsx';
import RequestList from './requestList.jsx';
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import cryptoPlanes from '../../../../block-planes-solidity/BlockPlanes/build/contracts/BlockPlanes.json';
import Hangar from '../hangar/hangar.jsx';
import axios from 'axios';
import Socketio from 'socket.io-client';
import NotificationSystem from 'react-notification-system';
import './friends.css';

const mapStateToProps = state => {
  return {
    userId: state.id,
    username: state.username
  };
};

class ConnectedFriends extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notificationSystem: this.refs.notificationSystem,
      friendId: '',
      username: '',
      profilePicture: '',
      fullName: '',
      totalPoints: '',
      createdAt: '',
      friendState: '',
      friends: [],
      requests: [],
      isRequestPage: false
    };

    this.updateFriendsPage = this.updateFriendsPage.bind(this);
    this.addFriend = this.addFriend.bind(this);
    this.deleteFriend = this.deleteFriend.bind(this);
    this.fetchFriends = this.fetchFriends.bind(this);
    this.fetchRequests = this.fetchRequests.bind(this);
    this.toggleRequests = this.toggleRequests.bind(this);
    this.friendRequestSentNotification = this.friendRequestSentNotification.bind(this);
    this.socket = Socketio('http://localhost:4225');
  }

  notificationSystem = null;

  componentDidMount() {
    let component = this;
    this.notificationSystem = this.refs.notificationSystem;
    this.updateFriendsPage();
    this.socket.on('returnfriendRequestSent', function (request) {
      if ((component.props.userId === request.recipientId) && (component.state.isRequestPage !== true)) {
        console.log('on friend page, receiving request', this.state);
        component.friendRequestSentNotification(event, request);
      } else if ((component.props.userId === request.recipientId)) {
        component.toggleRequests();
      } else if (component.props.username === request.username) {
        component.ownFriendRequestSentNotification(event, request);
      }
    });
    if (component.props.location.state) {
      component.toggleRequests();
    }
  }

  friendRequestSentNotification(event, notificationObj) {
    let component = this;
    event.preventDefault();
    component.notificationSystem.addNotification({
      title: 'New Friend Request from ' + notificationObj.username,
      level: 'info',
      action: {
        label: 'Go to Friend Requests',
        callback: function() {
          component.toggleRequests();
        }
      }
    });
}

ownFriendRequestSentNotification(event, notificationObj) {
  let component = this;
  event.preventDefault();
  component.notificationSystem.addNotification({
    title: 'Friend Request sent to ' + notificationObj.recipientUsername + '!',
    level: 'info'
  });
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
        createdAt: user.createdAt,
        isRequestPage: false
      }, () => {
        this.fetchFriends();
      });
    }
  }

  updateFriendState() {
    axios
    .get('/friendsCheck', {
      params: {
        user: this.props.userId,
        friend: this.state.friendId
      }
    })
    .then(response => {
      if (response.data.exists === false) {
        this.setState({
          friendState: 'not friends'
        });
      } else if (response.data.pending === 1) {
        this.setState({
          friendState: 'pending'
        });
      } else {
        this.setState({ friendState: '' });
        if (this.props.selectFriend) {
          this.props.selectFriend(this.state.friendId);
        }
      }
    })
    .catch(err => {
      console.log('Error getting session id', err);
    });
  }

  addFriend() {
    this.socket.emit('friendRequestSent', {
      username: this.props.username,
      recipientUsername: this.state.username,
      recipientId: this.state.friendId
    });
    axios
      .post('/friendsAdd', {
        userId: this.props.userId,
        friendId: this.state.friendId
      })
      .then(response => {
        this.setState({
          friendState: 'pending'
        });
      })
      .catch(err => {
        console.log('Error from handleCreateAccount', err);
      });
  }

  deleteFriend() {
    let component = this;
    axios
      .get('/friendsDelete', {
        params: {
          user: component.props.userId,
          friend: component.state.friendId
        }
      })
      .then(response => {
        this.setState({
          friendState: 'not friends'
        });
      })
      .catch(err => {
        console.log('Error getting session id', err);
      });
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
          }, () => {
            this.fetchRequests();
          });
      })
      .catch(err => {
        console.log('Error from login', err);
      });
  }

  fetchRequests() {
    let component = this;
    axios
      .get('/friendsFetchRequests', {
        params: {
          id: this.props.userId
        }
        })
      .then(response => {
        console.log('requests data',response);
          component.setState({
            requests: response.data
          }, () => {
            this.updateFriendState();
          });
      })
      .catch(err => {
        console.log('Error from login', err);
      });
  }

  toggleRequests() {
    this.fetchFriends();
    this.setState({
      friendId: '',
      username: '',
      profilePicture: '',
      fullName: '',
      totalPoints: '',
      createdAt: '',
      friendState: '',
      isRequestPage: true
    });
  }

    render() {
      if (this.state.friendId) {
        return (
          <div>
          <NotificationSystem ref="notificationSystem" />
            <Grid>
              <Grid.Row >
          </Grid.Row>
          <Grid.Row className='searchbar'> <Button className='ui inverted button' size='small' onClick={this.toggleRequests} >Requests</Button><p className='text1' >Select a Friend: </p>
          <FriendsDropDown friends={this.state.friends} updateFriendsPage={(user) => this.updateFriendsPage(user)}/>
          <p className='text2'>Or Search Users: </p>
            <SearchUsers className='searchusersbar' updateFriendsPage={(user) => this.updateFriendsPage(user)}/>
            <div className='addfriendbutton'>
            <AddFriendButton className='addfriendbutton' friendState={this.state.friendState} addFriend={this.addFriend} />
            <DeleteFriendButton className='deletefriendbutton' friendState={this.state.friendState} deleteFriend={this.deleteFriend} />
            </div>
          </Grid.Row>
          <Grid.Row className='borderfriends'>
          </Grid.Row>
                  <Grid.Row className='userrow'>
                  <div className='profilepic' >
                <Image src={this.state.profilePicture} size='medium' rounded />
                  <p className='joined'>Joined: {Moment(this.state.createdAt).format('MMMM Do YYYY')}</p>
              </div>
            </Grid.Row>

            <Grid.Row className='borderfriends'>
            </Grid.Row>

            <Grid.Row className='userrow'>
              <div className='profilepic' >
              <Image src={this.state.profilePicture} size='medium' rounded />
              <p className='joined'>Joined: {Moment(this.state.createdAt).format('MMMM Do YYYY')}</p>
              </div>

              <Grid.Column width={6} >
              <p className='username2'>{this.state.username}</p>
              </Grid.Column >

              <Grid.Column width={6} >
              <p className='score2'>Total Score</p>
                <p className='score2'>{this.state.totalPoints}</p>
                <p className='score2'>High Score</p>
                <p className='score2'>0</p>
          </Grid.Column>
                </Grid.Row>
                <p className='hangar'>Hangar</p>
                <Grid.Row>
            <Hangar friend={this.state.friendId} />
          </Grid.Row>
          </Grid>
          </div>
        );
      } else if (this.state.isRequestPage === true && this.state.requests.length) {
        return (
          <div>
          <NotificationSystem ref="notificationSystem" />
        <Grid>
              <Grid.Row >
          </Grid.Row>
          <Grid.Row className='searchbar'> <Button className='ui inverted button' size='small' onClick={this.toggleRequests} >Requests</Button>
          <p className='text1' >Select a Friend: </p>
          <FriendsDropDown friends={this.state.friends} updateFriendsPage={(user) => this.updateFriendsPage(user)}/>
          <p className='text2'>Or Search Users: </p>
            <SearchUsers className='searchusersbar' updateFriendsPage={(user) => this.updateFriendsPage(user)}/>
          </Grid.Row>
          <Grid.Row className='borderfriends'>
          </Grid.Row>
          <div>
          <div className='inner'>
                 <RequestList id={this.props.userId} requests={this.state.requests} fetchRequests={this.fetchRequests} />
                 </div>
                 </div>
          </Grid>
          </div>
      );
    } else if (this.state.isRequestPage === true) {
      return (
        <div>
        <NotificationSystem ref="notificationSystem" />
        <Grid>
              <Grid.Row >
          </Grid.Row>
          <Grid.Row className='searchbar'> <Button className='ui inverted button' size='small' onClick={this.toggleRequests} >Requests</Button>
          <p className='text1' >Select a Friend: </p>
          <FriendsDropDown friends={this.state.friends} updateFriendsPage={(user) => this.updateFriendsPage(user)}/>
          <p className='text2'>Or Search Users: </p>
            <SearchUsers className='searchusersbar' updateFriendsPage={(user) => this.updateFriendsPage(user)}/>
          </Grid.Row>
          <Grid.Row className='borderfriends'>
          </Grid.Row>
          <div>
          <div className='norequests'>
          <span>You have no new friend requests.</span>
                 </div>
                 </div>
          </Grid>
          </div>
      );
      } else {
        return (
          <div>
          <NotificationSystem ref="notificationSystem" />
          <Grid>
       <Grid.Row >
          </Grid.Row>
          <Grid.Row className='searchbar'> <Button className='ui inverted button' size='small' onClick={this.toggleRequests} >Requests</Button><p className='text1' >Select a Friend: </p>
          <FriendsDropDown friends={this.state.friends} updateFriendsPage={(user) => this.updateFriendsPage(user)}/>
          <p className='text2'>Or Search Users: </p>
            <SearchUsers className='searchusersbar' updateFriendsPage={(user) => this.updateFriendsPage(user)}/>
          </Grid.Row>
          <Grid.Row className='borderfriends'>
          </Grid.Row>
        </Grid>
        </div>
        );
      }
    }
}

const Friends = connect(mapStateToProps)(ConnectedFriends);

export default withRouter(Friends);