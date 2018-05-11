import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Image, Form, Grid, Button } from 'semantic-ui-react';
import { connect } from "react-redux";
import Moment from 'moment';
import SearchUsers from './searchUsersBar.jsx';
import AddFriendButton from './addFriendButton.jsx';
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
      friendState: ''
    };
    this.updateFriendsPage = this.updateFriendsPage.bind(this);
    this.addFriend = this.addFriend.bind(this);

  }

  updateFriendsPage(user) {
    console.log('updating friends state with', user);
    this.setState({
      friendId: user.id,
      username: user.title,
      profilePicture: user.image,
      fullName: '',
      totalPoints: user.totalPoints,
      createdAt: user.createdAt
    }, function() {
      this.updateFriendState();
    });
    console.log('state after select', this.state);
    console.log('state after update friend state', this.state);
  }

  updateFriendState() {
    axios
    .get('/friends', {
      params: {
        user: this.props.userId,
        friend: this.state.friendId
      }
    })
    .then(response => {
      console.log('response from db about friends', response);
      if (response.data === 'not friends') {
        this.setState({
          friendState: 'not friends'
        });
      } else {
        this.setState({
          friendState: ''
        });
      }
    })
    .catch(err => {
      console.log('Error getting session id', err);
    });
  }

  addFriend() {
    axios
      .post('/friends', {
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

    render() {
        return (
            <Grid>
          <Grid.Row>
          </Grid.Row>
          <Grid.Row className='searchbar'>
            <SearchUsers updateFriendsPage={(username) => this.updateFriendsPage(username)}/>
            <AddFriendButton friendState={this.state.friendState} addFriend={this.addFriend} />
          </Grid.Row>
                  <Grid.Row className='userrow'>
                  <div className='profilepic' >
                <Image src={this.state.profilePicture} size='medium' rounded />
                  <p className='joined'>Joined: {Moment(this.state.createdAt).format('MMMM Do YYYY')}</p>
              </div>
              <Grid.Column width={6} >
              <p className='username'>{this.state.username}</p>
              </Grid.Column >
              <Grid.Column width={6} >
                <p className='points'>{this.state.totalPoints}</p>
          </Grid.Column>
                </Grid.Row>
                <Grid.Column width={4} >
                <p className='collection'>Collection</p>
          </Grid.Column>
          <Grid.Column width={9} >
          </Grid.Column>
                <Grid.Column width={4} >
          </Grid.Column>
          </Grid>
        );
    }
}

const Friends = connect(mapStateToProps)(ConnectedFriends);

export default Friends;