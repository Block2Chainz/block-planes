import React from 'react';
import moment from 'moment';
import './chat.css';

class Message extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="post">
        <div className="ui top attached inverted segment">
          <div className="ui comments">
            <div className="comment">
              <a className="avatar">
                <img src={this.props.message.avatar} />
              </a>
              <div className="content">
                <span className="author">{this.props.message.username}</span><span className="date">{moment(this.props.message.createdAt).fromNow()}</span>
              </div>
            </div>
          </div>
          <div className="text">
            {this.props.message.message}
          </div>
        </div>
      </div>
    );
  }
}

export default Message;