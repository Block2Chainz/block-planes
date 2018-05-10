import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import { Button } from 'semantic-ui-react';
import { Switch, Route, Redirect } from 'react-router-dom'

const mapStateToProps = state => {
  return {
    userId: state.id,
  };
};

function ConnectedAddFriendButton(props) {
    if (!!props.userId) {
      return <Button className='ui inverted button' size='small' onClick={function() {console.log('Friend added!')}} >Add</Button>;
    }
    return <Link to='/login'><Button className='ui inverted button' size='small' >Log In</Button></Link>;
  }

const AddFriendButton = connect(mapStateToProps)(ConnectedAddFriendButton);

export default AddFriendButton;
