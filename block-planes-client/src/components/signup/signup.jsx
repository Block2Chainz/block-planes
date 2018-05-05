import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Image, Form, Grid, Button } from 'semantic-ui-react';
import axios from 'axios';
import './signup.css';

const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));

class Signup extends Component {
    render() {
        return (
            <div className='signup'>
          <Grid>
              <Form className='STARTING-FORM' onSubmit={console.log()} >
                <Grid.Row className='signuptext'>
                  <p className='splash'>Get Ready</p>
                  <div className='left-picture' >
                <Image src='https://i.imgur.com/ZfNDUvX.png' size='medium' rounded />
              </div>
                </Grid.Row>
                <Grid.Row className='signuptext'>
                  <p className='splash2'>All we need is your name, what you want to call yourself and a password. Easy.</p>
                </Grid.Row>
                <Grid.Row className='full-name-row'>
                  <Form.Input name='fullName' size={'small'} placeholder='Full name' width={14} onChange={console.log()} />
                </Grid.Row>
                <Grid.Row className='new-username-password'>
                  <Form.Group>
                    <Form.Input name='newUsername' size={'small'} placeholder='New username ' width={7} onChange={console.log()} />
                    <Form.Input name='newPassword' size={'small'} placeholder='New password ' type='password' autoComplete='off' width={7} onChange={console.log()} />
                  </Form.Group>
                </Grid.Row>
                <Grid.Row className='signupbutton'>
                  <Button className='ui inverted button' type='submit' size='massive'>Create Account</Button>
                </Grid.Row>
                <Grid.Row className='signupor'>
                  <p className='splash2'>Or</p>
                </Grid.Row>
                <Grid.Row className='loginbutton'>
                <Link to='/login'><Button className='ui inverted button' size='big' >Log In</Button></Link>
                </Grid.Row>
              </Form>
          </Grid>
        </div>
        );
    }
}

export default Signup;