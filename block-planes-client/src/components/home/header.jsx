import React, { Component } from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import { Image, Form, Grid, Button } from 'semantic-ui-react';
import { toggleChatVisibility } from "../../actions/index.js";
import LogInOutButton from './logInOutButton.jsx';
import './header.css';
import Socketio from 'socket.io-client';
import NotificationSystem from 'react-notification-system';


const mapStateToProps = state => {
  return {
    userId: state.id,
    loggedIn: state.loggedIn,
    username: state.username,
    chatVisible: state.chatVisible
  };
};


class ConnectedHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notificationSystem: this.refs.notificationSystem
    };
    this.addNotification = this.addNotification.bind(this);
    this.socket = Socketio('http://localhost:4225');
  }

  notificationSystem = null;

  componentDidMount() {
    let component = this;
    this.notificationSystem = this.refs.notificationSystem;
    this.socket.on('returnmessage', function (message) {
      if ((component.props.userId === message.friendId) && (window.location.pathname !== '/chat' && window.location.pathname !== '/game')) {
        component.addNotification(event, message);
      }
    });
    this.socket.on('returnfriendRequestSent', function (request) {
      if ((component.props.userId === request.recipientId) && (window.location.pathname !== '/friends' && window.location.pathname !== '/game')) {
        component.friendRequestSentNotification(event, request);
      }
    });
    this.socket.on('returnfriendRequestAccepted', function (request) {
      console.log('FR accepted');
      if ((component.props.userId === request.recipientId) && (window.location.pathname !== '/game')) {
        component.friendRequestAcceptedNotification(event, request);
      } else if ((component.props.username === request.username) && (window.location.pathname !== '/game')) {
        component.ownfriendRequestAcceptedNotification(event, request);
      }
    });
  }

  addNotification(event, notificationObj) {
    let component = this;
    event.preventDefault();
    this.notificationSystem.addNotification({
      title: 'New Message from ' + notificationObj.username,
      message: notificationObj.messageText,
      level: 'info',
      action: {
        label: 'Go to Chat',
        callback: function () {
          component.props.history.push({
            pathname: '/chat',
            state: { friendUsername: notificationObj.username }
          })
        }
      }
    });
  }

  friendRequestSentNotification(event, notificationObj) {
    let component = this;
    event.preventDefault();
    this.notificationSystem.addNotification({
      title: 'New Friend Request from ' + notificationObj.username,
      level: 'info',
      action: {
        label: 'Go to Friend Requests',
        callback: function () {
          component.props.history.push({
            pathname: '/friends',
            state: { friendUsername: notificationObj.username }
          })
        }
      }
    });
  }

  friendRequestAcceptedNotification(event, notificationObj) {
    let component = this;
    event.preventDefault();
    this.notificationSystem.addNotification({
      title: 'You are now friends with ' + notificationObj.username + '!',
      level: 'info'
    });
  }

  ownfriendRequestAcceptedNotification(event, notificationObj) {
    let component = this;
    event.preventDefault();
    this.notificationSystem.addNotification({
      title: 'You are now friends with ' + notificationObj.recipientUsername + '!',
      level: 'info'
    });
  }

  render() {
    return (
      <div>
        <NotificationSystem ref="notificationSystem" />
        <header className='login-header' >
          <Grid>
            <Grid.Row>
              <Grid.Column width={2}>
                <Link to='/home'><h1 className='title' >BlockPlanes</h1></Link>
              </Grid.Column>
              <Grid.Column width={2}>
                <Link to='/profile'><Button className='ui inverted button' size={'small'}>Profile</Button></Link>
              </Grid.Column>
              <Grid.Column width={2}>
                <Link to='/friends'><Button className='ui inverted button' size={'small'}>Friends</Button></Link>
              </Grid.Column>
              <Grid.Column width={2}>
                <Link to='/chat'><Button className='ui inverted button' size={'small'}>Chat</Button></Link>
              </Grid.Column>
              <Grid.Column width={2}>
                <Link to='/marketplace'><Button className='ui inverted button' size={'small'}>Marketplace</Button></Link>
              </Grid.Column>
              <Grid.Column width={2}>
                <Link to='/leaderboard'><Button className='ui inverted button' size={'small'}>Leaderboard</Button></Link>
              </Grid.Column>
              <Grid.Column width={2}>
                <Link to='/game'><Button className='ui inverted button' size={'small'}>Find Game</Button></Link>
              </Grid.Column>
              <Grid.Column width={2}>
                <LogInOutButton logout={this.props.logout} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </header>
      </div>
    );
  }
}


const Header = connect(mapStateToProps)(ConnectedHeader);

export default withRouter(Header);