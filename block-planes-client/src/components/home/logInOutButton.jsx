import React from 'react';
import { Link } from 'react-router-dom'
import { Button } from 'semantic-ui-react';
import { Switch, Route, Redirect } from 'react-router-dom'


function LogInOutButton(props) {
    if (!!props.userId) {
      return <Button className='ui inverted button' size='small' onClick={props.logout} >Log Out</Button>;
    }
    return <Link to='/login'><Button className='ui inverted button' size='small' >Log In</Button></Link>;
  }

export default LogInOutButton;
