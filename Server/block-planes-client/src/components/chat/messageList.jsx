import React from 'react';
import Message from './message.jsx';

const MessageList = (props) => {
  return (
    <div>
      {props.messages.map((message, i) => <Message id={props.id} message={message} key={i}/>)}
    </div>
  );
};
export default MessageList;