import React, { Component } from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import { Image, Form, Grid, Button, Sidebar, Menu, Segment, Icon, Item } from 'semantic-ui-react';
import { toggleChatVisibility } from "../../actions/index.js";
import LogInOutButton from './logInOutButton.jsx';
import Main from '../main/main.jsx';
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
      notificationSystem: this.refs.notificationSystem,
      visible: false
    };
    let component = this;
    this.addNotification = this.addNotification.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.socket = Socketio('http://ec2-13-57-209-229.us-west-1.compute.amazonaws.com:2345');
    document.body.addEventListener('click', function(event) {
      component.toggleMenu();
    }); 
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
      if ((component.props.userId === request.recipientId) && (window.location.pathname !== '/game')) {
        component.friendRequestAcceptedNotification(event, request);
      } else if ((component.props.username === request.username) && (window.location.pathname !== '/game')) {
        component.ownfriendRequestAcceptedNotification(event, request);
      }
    });
    this.socket.on('returnGameInvite', function (request) {
      if ((component.props.userId === request.recipientId)) {
        component.gameInviteNotification(event, request);
      }
    });
  }

  toggleVisibility = () => this.setState({ visible: !this.state.visible })

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

  gameInviteNotification(event, notificationObj) {
    let component = this;
    event.preventDefault();
    this.notificationSystem.addNotification({
      title: 'Game Invite from ' + notificationObj.username,
      level: 'info',
      action: {
        label: 'Accept',
        callback: () => {
          this.props.history.push({
            pathname: `/waitingRoom`,
            state: {  roomId: notificationObj.roomId,
                      player: 2 }
          })
        }
      }
    });
  }

  toggleMenu() {
    if (this.state.visible === true) {
      this.setState({
        visible: false
      });
    }
  }

  render() {
    const { visible } = this.state
    return (
      <div>
        <NotificationSystem ref="notificationSystem" />
        <div>
          <div className='topofsite'>
            <Link to='/home' className='inverted'><h1 className='titlegame' >BlockPlanes</h1></Link>
            <a className='header item titlemenu menuinSP' href='#/' onClick={this.toggleVisibility}><i className="sidebar icon" />Menu</a>
          </div>
          <Sidebar as={Menu} direction='right' animation='push' width='thin' visible={visible} icon='labeled' vertical inverted>
            <Link to='/home'><p className="header item menuitem">Home</p></Link>
            <Link to='/profile'><p className="header item menuitem">{this.props.username || 'Profile'}</p></Link>
            <Link to='/friends'><p className="header item menuitem">Friends</p></Link>
            <Link to='/chat'><p className="header item menuitem">Chat</p></Link>
            <Link to='/marketplace'><p className="header item menuitem">Marketplace</p></Link>
            <Link to='/leaderboard'><p className="header item menuitem">Leaderboard</p></Link>
            <Link to='/game'><p className="header item menuitem">Find Game</p></Link>
            <Link to='/singleplayer'><p className="header item menuitem">Single Player</p></Link>
            <LogInOutButton logout={this.props.logout} />
          </Sidebar>

          <Main tokenLogin={this.props.tokenLogin} logout={this.logout} toggleMenu={this.toggleMenu}/>

      </div>
      </div>
    );
  }
}


const Header = connect(mapStateToProps)(ConnectedHeader);

export default withRouter(Header);