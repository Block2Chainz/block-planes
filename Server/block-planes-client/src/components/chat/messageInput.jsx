import { } from 'dotenv/config'
import React from 'react';
import axios from 'axios';
import Socketio from 'socket.io-client';
import './chat.css';

class MessageInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: ''
    };
    this.socket = Socketio(process.env.REACT_APP_CHAT_PORT);
    this.onChangeMessage = this.onChangeMessage.bind(this);
    this.submitMessage = this.submitMessage.bind(this);
  }

  componentDidMount() {
    var component = this;
  }

  onChangeMessage(event) {
    this.setState({
      content: event.target.value
    });
  }

  submitMessage(event) {
    var component = this;
    event.preventDefault();
    this.socket.emit('message', {
      messageText: this.state.content,
      userId: component.props.userId,
      friendId: component.props.friendId,
      username: component.props.username
    });
    axios.post('/messages', {
      messageText: this.state.content,
      userId: component.props.userId,
      friendId: component.props.friendId
    }).then(function (response) {
      component.setState({
        content: ''
      });
      component.props.fetchMessages();
    });
  }

  render() {
    return (<div>
      <form className="ui form">
        <div className="field">
          <input placeholder={"Send a message to " + this.props.friendUsername} rows="1" value={this.state.content} onChange={this.onChangeMessage} onSubmit={this.submitMessage}>
          </input>
        </div>
        <div className="hide">
          <button className="ui button" role="button" onClick={this.submitMessage} ></button>
        </div>
      </form>
    </div>);
  }
}

export default MessageInput;