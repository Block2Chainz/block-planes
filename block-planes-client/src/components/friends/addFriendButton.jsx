import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import { Button } from 'semantic-ui-react';
import { Switch, Route, Redirect } from 'react-router-dom';

const mapStateToProps = state => {
  return {
    userId: state.id,
  };
};

function ConnectedAddFriendButton(props) {
    if (props.friendState === 'not friends') {
      return <Button className='ui inverted button' size='small' onClick={props.addFriend} >Add to Friends</Button>;
    } else {
      return <Button className='ui inverted button' size='small' >Already Friends</Button>;
    }
  }

const AddFriendButton = connect(mapStateToProps)(ConnectedAddFriendButton);

export default AddFriendButton;
