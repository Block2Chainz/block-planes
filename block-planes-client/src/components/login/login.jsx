import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Image, Form, Grid, Button } from 'semantic-ui-react';
import axios from 'axios';
import './login.css';

const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));

class Login extends Component {
    render() {
        return (
            <div className='login'>
          <Grid>
              <Form className='STARTING-FORM' onSubmit={console.log()} >
                <Grid.Row className='signuptext'>
                  <p className='splash'>Good, You're Back</p>
                  <div className='mid-picture' >
                <Image src='https://i.imgur.com/VNZZjii.png' size='medium' rounded />
              </div>
                </Grid.Row>
                <Grid.Row className='signuptext'>
                  <p className='splash2'>Time to get to work.</p>
                </Grid.Row>
                <Grid.Row className='new-username-password'>
                  <Form.Group>
                    <Form.Input name='newUsername' size={'small'} placeholder='Username ' width={7} onChange={console.log()} />
                    <Form.Input name='newPassword' size={'small'} placeholder='Password ' type='password' autoComplete='off' width={7} onChange={console.log()} />
                  </Form.Group>
                </Grid.Row>
                <Grid.Row className='signupbutton4'>
                  <Button className='ui inverted button' type='submit' size='massive'>Log In</Button>
                </Grid.Row>
                <Grid.Row className='signuptext2'>
                  <p className='splash2'>Or</p>
                </Grid.Row>
                <Grid.Row className='signupbutton2'>
                <Link to='/signup'><Button className='ui inverted button' size='big' >Sign Up</Button></Link>
                </Grid.Row>
              </Form>
          </Grid>
        </div>
        );
    }
}

export default Login;