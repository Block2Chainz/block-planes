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

function ConnectedLogInOutButton(props) {
  if (!!props.userId) {
    return <Link to='/login'><p className="header item menuitem" onClick={props.logout}>Log Out</p></Link>;
  } else {
  return <Link to='/login'><p className="header item menuitem">Log In</p></Link>;
  }
}

const LogInOutButton = connect(mapStateToProps)(ConnectedLogInOutButton);

export default LogInOutButton;
// {/* <Button className='ui inverted button logbutton' size='small' onClick={props.logout} >Log Out</Button>; */ } 
// {/* <Button className='logbutton ui inverted button' size='small' >Log In</Button> */}