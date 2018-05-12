import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Image, Form, Grid, Button } from 'semantic-ui-react';
import { connect } from "react-redux";
import Moment from 'moment';
import SearchUsers from './searchUsersBar.jsx';
import AddFriendButton from './addFriendButton.jsx';
import FriendsDropDown from './friendsDropDown.jsx';
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import cryptoPlanes from '../../../../block-planes-solidity/BlockPlanes/build/contracts/BlockPlanes.json';
// import Plane from '../plane/plane.jsx';
import axios from 'axios';
import './friends.css';

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
      friendState: '',
      friends: []
    };
    this.updateFriendsPage = this.updateFriendsPage.bind(this);
    this.addFriend = this.addFriend.bind(this);
    this.fetchFriends = this.fetchFriends.bind(this);
  }

  componentDidMount() {
    this.updateFriendsPage();
  }

  updateFriendsPage(user) {
    console.log('updating friends state with', user);
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

  updateFriendState() {
    axios
    .get('/friendsCheck', {
      params: {
        user: this.props.userId,
        friend: this.state.friendId
      }
    })
    .then(response => {
      if (response.data === 'not friends') {
        this.setState({
          friendState: 'not friends'
        });
      } else {
        this.setState({
          friendState: ''
        });
        console.log('fetchFriends state', this.state);
      }
    })
    .catch(err => {
      console.log('Error getting session id', err);
    });
  }

  addFriend() {
    axios
      .post('/friendsAdd', {
        userId: this.props.userId,
        friendId: this.state.friendId
      })
      .then(response => {
        console.log('response from addFriend', response);
        this.setState({
          friendState: ''
        });
      })
      .catch(err => {
        console.log('Error from handleCreateAccount', err);
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
          console.log('response to fetch friends', response)
          component.setState({
            friends: response.data
          }, function() {
            this.updateFriendState();
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
            <div className='addfriendbutton'>
            <AddFriendButton className='addfriendbutton' friendState={this.state.friendState} addFriend={this.addFriend} />
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
                {/* <Plane planes={this.state.planes}/> */}
          </Grid.Row>
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