import React, { Component } from 'react';
import { Link, Redirect, withRouter } from 'react-router';
import './gameLanding.css';
import { Grid, Button } from 'semantic-ui-react';
import Friends from '../friends/friends.jsx';
import Hangar from '../hangar/hangar.jsx';
import WaitingRoom from './waitingRoom.jsx';
import Socketio from 'socket.io-client';
import NotificationSystem from 'react-notification-system';
import randomstring from 'randomstring';

import { connect } from "react-redux";
import { selectPlane } from "../../actions/index";

const mapStateToProps = state => {
  return {
    selectedPlane: state.selectedPlane,
    username: state.username
  };
};

const mapDispatchToProps = dispatch => {
  return {
    // storeUserAddress: address => dispatch(storeUserAddress(address)),
    logOut: () => dispatch(logOut()),
    storePlanes: user => dispatch(storePlanes(user)),
  };
};

class ConnectedGameLanding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFriend: false,
      play: false,
      notificationSystem: this.refs.notificationSystem,
      roomId: ''
    }
    this.socket = Socketio('http://localhost:4225');
  }

  notificationSystem = null;

  componentDidMount() {
    let component = this;
    this.notificationSystem = this.refs.notificationSystem;
    // this.socket.on('returnfriendRequestSent', function (request) {
    //   if ((component.props.userId === request.recipientId) && (component.state.isRequestPage !== true)) {
    //     component.friendRequestSentNotification(event, request);
    //   } else if ((component.props.userId === request.recipientId)) {
    //     component.toggleRequests();
    //   } else if (component.props.username === request.username) {
    //     component.ownFriendRequestSentNotification(event, request);
    //   }
    // });
    // if (component.props.location.state) {
    //   component.toggleRequests();
    // }
    if (component.props.location.state) {
      component.setState({ play: true, roomId: component.props.location.state.roomId });
    }
  }

  selectFriend(friendId, friendName) {
    this.setState({ selectedFriend: friendId, friendName: friendName })
  }

  joinGame() {
    // redirect to waiting room component with props friend: this.state.selectedFriend
    const roomId = randomstring.generate();
    this.socket.emit('gameInvite', {
      username: this.props.username,
      recipientId: this.state.selectedFriend,
      roomId: roomId
    });
    this.setState({ play: true, roomId: roomId });
  }

  render() {
    return (
      <div className='game-landing-body'>
      <Grid className='game-landing-grid'>
        <div className='game-landing-hangar'>
          <div className='select-plane-div'>
            <p className='select-plane-label'> Select a Plane </p>
          </div>
          <div>
            <Hangar />
          </div>
        </div>

        {typeof (this.props.selectedPlane) !== 'number' ?
          <div></div> :
          <Grid.Row className='landing'>
              <div className='full-width'>
              {/* <h3>Select a Friend</h3> */}
              <Friends gameLanding={true} selectFriend={this.selectFriend.bind(this)} className='center-friend'/>
              </div>
          </Grid.Row>
        }

        {this.state.selectedFriend ?
          <Grid.Row className='landing'>
              <Button className='joinGameButton' onClick={() => this.joinGame()}>
                Invite {this.state.friendName} to Play a Game
              </Button>
          </Grid.Row> :
          <div></div>
        }

        {
          this.state.play ?
            <Redirect to={{pathname: "/waitingRoom", state: {roomId: this.state.roomId, player: 1}}} /> :
            <div></div>
        }
      </Grid>
      </div>
    )
  }
}

const GameLanding = connect(mapStateToProps, mapDispatchToProps)(ConnectedGameLanding);

export default withRouter(GameLanding);