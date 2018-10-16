import React from 'react';
import moment from 'moment';
import { Button } from 'semantic-ui-react';
import axios from 'axios';
import { connect } from "react-redux";
import Socketio from 'socket.io-client';
import './friends.css';

const mapStateToProps = state => {
  return {
    username: state.username
  };
};

class ConnectedRequest extends React.Component {
  constructor(props) {
    super(props);
    this.acceptRequest = this.acceptRequest.bind(this);
    this.declineRequest = this.declineRequest.bind(this);
    this.socket = Socketio('http://54.219.160.32:3456');
  }

  acceptRequest() {
    let component = this;
    this.socket.emit('friendRequestAccepted', {
      username: component.props.username,
      recipientId: component.props.request.friendId,
      recipientUsername: component.props.request.username
    });
    axios
      .post('/friendsAccept', {
        friendsTableId: component.props.request.id
      })
      .then(response => {
        component.props.fetchRequests();
      })
      .catch(err => {
        console.log('Error from handleCreateAccount', err);
      });
  }

  declineRequest() {
    let component = this;
    axios
      .post('/friendsDecline', {
        friendsTableId: component.props.request.id
      })
      .then(response => {
        component.props.fetchRequests();
      })
      .catch(err => {
        console.log('Error from handleCreateAccount', err);
      });
  }

  render() {
    return (
      <div className="post">
        <div className="ui top attached inverted segment">
          <div className="ui comments">
            <div className="comment">
              <a className="avatar">
                <img src={this.props.request.profilePicture} />
              </a>
              <div className="content">
                <span className="author">{this.props.request.username}</span><span className="date">{moment(this.props.request.sentAt).fromNow()}</span>
              </div>
              <div>
              <Button className='ui inverted button' size='small' onClick={this.acceptRequest} >Accept</Button>
              <Button className='ui inverted button' size='small' onClick={this.declineRequest} >Decline</Button>
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const Request = connect(mapStateToProps)(ConnectedRequest);

export default Request;