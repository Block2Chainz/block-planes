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
      isRequestPage: false,
      highScore: '',
      totalScore: ''
    };
    let component = this;
    this.updateFriendsPage = this.updateFriendsPage.bind(this);
    this.addFriend = this.addFriend.bind(this);
    this.deleteFriend = this.deleteFriend.bind(this);
    this.fetchFriends = this.fetchFriends.bind(this);
    this.fetchRequests = this.fetchRequests.bind(this);
    this.toggleRequests = this.toggleRequests.bind(this);
    this.friendRequestSentNotification = this.friendRequestSentNotification.bind(this);
    this.fetchUserScores = this.fetchUserScores.bind(this);
    this.socket = Socketio('http://localhost:4225');
  }

  notificationSystem = null;

  componentDidMount() {
    let component = this;
    this.notificationSystem = this.refs.notificationSystem;
    this.updateFriendsPage();
    this.socket.on('returnfriendRequestSent', function (request) {
      if ((component.props.userId === request.recipientId) && (component.state.isRequestPage !== true)) {
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
          this.props.selectFriend(this.state.friendId, this.state.username);
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
        console.log('friend state pending', this.state);
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
          component.setState({
            requests: response.data
          }, () => {
            this.fetchUserScores();
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

<<<<<<< HEAD
  fetchUserScores() {
    let component = this;
    axios
      .get('/fetchHighScore', {
        params: {
          id: component.state.friendId
        }
        })
      .then(response => {
        console.log('highscore', response);
          component.setState({
            highScore: response.data.high_score,
            totalScore: response.data.total_points
          }, () => {
            this.updateFriendState();
          });
      })
      .catch(err => {
        console.log('Error from login', err);
      });
  }

  render() {
    if (this.props.gameLanding && !this.state.friendId) {
      return (
        <div >
          <NotificationSystem ref="notificationSystem" />
          <Grid>
            <Grid.Row >
            </Grid.Row>

            <Grid.Row > 
              <p className='text1' >Select a Friend: </p>
              <FriendsDropDown friends={this.state.friends} updateFriendsPage={(user) => this.updateFriendsPage(user)} />
            </Grid.Row>

            <Grid.Row className='borderfriends'>
            </Grid.Row>
          </Grid>
        </div>
      );
    } else if (this.props.gameLanding && this.state.friendId) {
      return (
        <div >
          <NotificationSystem ref="notificationSystem" />
          <Grid>
            <Grid.Row >
            </Grid.Row>

            <Grid.Row >
              <p className='text1' >Select a Friend: </p>
              <FriendsDropDown friends={this.state.friends} updateFriendsPage={(user) => this.updateFriendsPage(user)} />
            </Grid.Row>

            <Grid.Row className='borderfriends'>
            </Grid.Row>

            <Grid.Row className='userrow'>
              <div className='profilepic' >
                <Image width='75px' src={this.state.profilePicture} size='medium' rounded />
                <p className='joined'>Joined: {Moment(this.state.createdAt).format('MMMM Do YYYY')}</p>
              </div>

              <Grid.Column width={5} >
                <p className='username2'>{this.state.username}</p>
              </Grid.Column >

              <Grid.Column width={5} >
                <p className='score2'>Total Score</p>
                <p className='score2'>{this.state.totalPoints}</p>
                <p className='score2'>High Score</p>
                <p className='score2'>0</p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      );
    } else if (this.state.friendId) {
      return (
        <div >
        <NotificationSystem ref="notificationSystem" />
          <Grid>
            <Grid.Row >
            </Grid.Row>

            <Grid.Row > <Button className='ui inverted button' size='small' onClick={this.toggleRequests} >Requests</Button><p className='text1' >Select a Friend: </p>
              <FriendsDropDown friends={this.state.friends} updateFriendsPage={(user) => this.updateFriendsPage(user)}/>
              <p className='text2'>Or Search Users: </p>
              <SearchUsers updateFriendsPage={(user) => this.updateFriendsPage(user)}/>
             
    render() {
      if (this.state.friendId) {
        return (
          <div className='friend-page-body'>
            <NotificationSystem ref="notificationSystem" />
            <Grid>
              <Grid.Row className='friend-search-bar'>
                <div className='center-content'>
                <Button className='ui inverted button' size='small' onClick={this.toggleRequests} >Requests</Button>
                <p className='text1' >Select a Friend: </p>
                <FriendsDropDown friends={this.state.friends} updateFriendsPage={(user) => this.updateFriendsPage(user)}/>
                <p className='text2'>Or Search Users: </p>
                <SearchUsers updateFriendsPage={(user) => this.updateFriendsPage(user)}/>
                </div>
              </Grid.Row>

              <Grid.Row className='userrow'>
                <Grid.Column className='profile-pic-column'>
                  <div className='profilepic' >
                    <Image className='friend-pic' src={this.state.profilePicture} size='medium' rounded />
                    <p className='joined'>Joined: {Moment(this.state.createdAt).format('MMMM Do YYYY')}</p>
                  </div>
                </Grid.Column>
                <Grid.Column width={5} className='friend-username-col'>
                  <div className='friend-username'>
                    <p className='friend-username-label'>{this.state.username}</p>
                    <AddFriendButton className='addfriendbutton' friendState={this.state.friendState} addFriend={this.addFriend} />
                    <DeleteFriendButton className='deletefriendbutton' friendState={this.state.friendState} deleteFriend={this.deleteFriend} />
                  </div>
                </Grid.Column >
                <Grid.Column className='friend-score-column'>
                  <p className='friend-profile-score'>Total Score</p>
                  <p className='friend-profile-score'>{this.state.totalPoints}</p>
                  <p className='friend-profile-score'>High Score</p>
                  <p className='friend-profile-score'>0</p>
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
          <div className='friend-page-body'>
          <NotificationSystem ref="notificationSystem" />
        <Grid>
          <Grid.Row className='friend-search-bar'> 
          <div className='center-content'>
            <Button className='ui inverted button' size='small' onClick={this.toggleRequests} >Requests</Button>
          <p className='text1' >Select a Friend: </p>
          <FriendsDropDown friends={this.state.friends} updateFriendsPage={(user) => this.updateFriendsPage(user)}/>
          <p className='text2'>Or Search Users: </p>
            <SearchUsers  updateFriendsPage={(user) => this.updateFriendsPage(user)}/>
            </div>
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
        <div className='friend-page-body'>
          <NotificationSystem ref="notificationSystem" />
          <div >
            <Grid>
              <Grid.Row className='friend-search-bar'>
              <div className='center-content'>
                <Button className='ui inverted button' size='small' onClick={this.toggleRequests} >Requests</Button>
                <p className='text1' >Select a Friend: </p>
                  <FriendsDropDown friends={this.state.friends} updateFriendsPage={(user) => this.updateFriendsPage(user)}/>
                <p className='text2'>Or Search Users: </p>
                <SearchUsers updateFriendsPage={(user) => this.updateFriendsPage(user)}/>
                </div>
              </Grid.Row>

              <Grid.Row className='borderfriends'>
              </Grid.Row>

              <Grid.Row >
                <div className='norequests'>
                  <span>You have no new friend requests.</span>
                </div>
              </Grid.Row>
            </Grid>
          </div>
        </div>
      );
    } else {
      return (
        <div className='friend-page-body'>
          <NotificationSystem ref="notificationSystem" />
          <div >
            <Grid >
              <Grid.Row className='friend-search-bar'>
              <div className='center-content'>
              <Button className='ui inverted button' size='small' onClick={this.toggleRequests} >Requests</Button><p className='text1' >Select a Friend: </p>
                <FriendsDropDown friends={this.state.friends} updateFriendsPage={(user) => this.updateFriendsPage(user)}/>
                <p className='text2'>Or Search Users: </p>
                <SearchUsers  updateFriendsPage={(user) => this.updateFriendsPage(user)}/>
                </div>
              </Grid.Row>

              <Grid.Row className='borderfriends'>
              </Grid.Row>
            </Grid>
          </div>
        </div>
      );
    }
  }
}

const Friends = connect(mapStateToProps)(ConnectedFriends);

export default withRouter(Friends);