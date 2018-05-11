import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from "react-redux";
import { Image, Form, Grid, Button } from 'semantic-ui-react';
import axios from 'axios';
import './signup.css';
import cryptoPlanes from '../../../../block-planes-solidity/BlockPlanes/build/contracts/BlockPlanes.json';


const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));


const mapDispatchToProps = dispatch => {
  return {
    logIn: user => dispatch(logIn(user)),
    logOut: () => dispatch(logOut()),
  };
};

const mapStateToProps = state => {
  return {
    userId: state.id,
    loggedIn: state.articles,
    username: state.username,
  };
};

class ConnectedSignup extends Component {
  constructor() {
    super();
    this.state = {
      fullName: '',
      newUsername: '',
      newPassword: '',
      blockAccount: null
    };
    this.createAccount = this.createAccount.bind(this);
    if (typeof web3 != 'undefined') {
      this.web3Provider = web3.currentProvider
      this.web3 = new Web3(this.web3Provider)
  
      this.blockplanes = TruffleContract(cryptoPlanes)
      this.blockplanes.setProvider(this.web3Provider)
    } else {
      alert('This site needs a web3 provider(MetaMask) to run properly. Please install one and refresh!');
    }
  }

  componentDidMount() {
    if (!this.state.blockAccount && typeof web3 != 'undefined') {
      this.web3.eth.getCoinbase((err, account) => {
        this.setState({ blockAccount : account });
      });
    }
  }

  storeUserInfoInState(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  createAccount(event) {
    if (!this.state.newUsername && !this.state.newPassword) {
      alert('Please enter a username and password!');
    } else if (!this.state.newUsername) {
      alert('Please enter a username!');
    } else if (!this.state.newPassword) {
      alert('Please enter a password!');
    } else {
      bcrypt.genSaltAsync(10)
        .then(salt => {
          bcrypt.hashAsync(this.state.newPassword, salt, null)
            .then(hashedPassword => {
              const newUserInfo = {
                fullName: this.state.fullName,
                newUsername: this.state.newUsername,
                newPassword: hashedPassword,
                profilePicture:
                  'http://tekno.rakyatku.com/thumbs/img_660_442_asteroid-b_1492568184roid.jpg'
              };
              let component = this;
              axios
                .post('/newAccount', newUserInfo)
                .then(response => {
                  if (response.data === 'exists') {
                    alert('Sorry, that username already belongs to another pilot.');
                  } else if (response.data.user.id) {
                    sessionStorage.setItem('jwtToken', response.data.token);
                    component.props.tokenLogin();
                  }
                })
                .catch(err => {
                  console.log('Error from handleCreateAccount', err);
                });
              event.preventDefault();
            });
        });
    }
  }
  render() {
    if (this.props.userId) {
      return (
        <Redirect to={'/profile'} />
      );
    }
    return (
      <div>
        {console.log(this.state, 'state inside')}
        {(typeof web3 != 'undefined') ? (
          <div className='signup'>
            <Grid>
              <Form className='STARTING-FORM' onSubmit={this.createAccount} >
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
                  <Form.Input name='fullName' size={'small'} placeholder='Full name' width={14} onChange={this.storeUserInfoInState.bind(this)} />
                </Grid.Row>
                <Grid.Row className='new-username-password'>
                  <Form.Group>
                    <Form.Input name='newUsername' size={'small'} placeholder='New username ' width={7} onChange={this.storeUserInfoInState.bind(this)} />
                    <Form.Input name='newPassword' size={'small'} placeholder='New password ' type='password' autoComplete='off' width={7} onChange={this.storeUserInfoInState.bind(this)} />
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
          </div>) : (
            <img src="https://safetymanagementgroup.com/wp-content/uploads/2017/07/Oopsbutton.jpg"/>
          )}
      </div>
    );
  }
}

const Signup = connect(mapStateToProps)(ConnectedSignup);


export default Signup;