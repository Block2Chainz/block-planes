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
      return <Button className='ui inverted button logbutton' size='small' onClick={props.logout} >Log Out</Button>;
    }
    return <Link to='/login'><Button className='ui inverted button' size='small' >Log In</Button></Link>;
  }

const LogInOutButton = connect(mapStateToProps)(ConnectedLogInOutButton);

export default LogInOutButton;
