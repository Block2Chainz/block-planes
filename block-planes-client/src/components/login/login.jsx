import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from "react-redux";
import { Image, Form, Grid, Button } from 'semantic-ui-react';
import axios from 'axios';
import './login.css';

const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));

const mapStateToProps = state => {
  return {
    userId: state.id,
    loggedIn: state.articles,
    username: state.username,
  };
};

class ConnectedLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
    this.login = this.login.bind(this);
  }

  storeUserInfoInState(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  login(event) {
    event.preventDefault();
    let component = this;
    axios
      .get(`/signIn/${this.state.username}/${this.state.password}`)
      .then(response => {
        if (response.data === 'wrong') {
          alert('Wrong username or password!');
        } else {
          sessionStorage.setItem('jwtToken', response.data.token);
          component.props.tokenLogin();
        }
      })
      .catch(err => {
        console.log('Error from login', err);
      });
  }

    render() {
      if (this.props.userId) {
        return (
          <Redirect to={'/collection'} />
        );
      }
        return (
            <div className='login'>
          <Grid>
              <Form className='STARTING-FORM' onSubmit={this.login} >
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
                    <Form.Input name='username' size={'small'} placeholder='Username ' width={7} onChange={this.storeUserInfoInState.bind(this)} />
                    <Form.Input name='password' size={'small'} placeholder='Password ' type='password' autoComplete='off' width={7} onChange={this.storeUserInfoInState.bind(this)} />
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


const Login = connect(mapStateToProps)(ConnectedLogin);

export default Login;