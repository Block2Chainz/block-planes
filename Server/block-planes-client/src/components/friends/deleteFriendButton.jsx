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

function ConnectedDeleteFriendButton(props) {
    if (props.friendState === '') {
      return <Button className='ui inverted button' size='small' onClick={props.deleteFriend} >Remove Friend</Button>;
    } else {
      return null;
    }

  }

const DeleteFriendButton = connect(mapStateToProps)(ConnectedDeleteFriendButton);

export default DeleteFriendButton;
