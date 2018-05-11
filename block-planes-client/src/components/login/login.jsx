import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from "react-redux";
import { Image, Form, Grid, Button } from 'semantic-ui-react';
import axios from 'axios';
import './login.css';
import cryptoPlanes from '../../../../block-planes-solidity/BlockPlanes/build/contracts/BlockPlanes.json';


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
      password: '',
      blockAccount: null
    };
    this.login = this.login.bind(this);
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

  login(event) {
    event.preventDefault();
    let component = this;
    console.log('user, pass', this.state.username, this.state.password);
    if (!this.state.username && !this.state.password) {
      alert('Please enter a username and password!');
    } else if (!this.state.username) {
      alert('Please enter a username!');
    } else if (!this.state.password) {
      alert('Please enter a password!');
    } else {
      axios
      .get(`/signIn/${this.state.username}/${this.state.password}`)
      .then(response => {
        if (response.data === 'wrong') {
          alert('Wrong username or password!');
        } else {
          console.log('response.data.token', response.data.token)
          sessionStorage.setItem('jwtToken', response.data.token);
          component.props.tokenLogin();
        }
      })
      .catch(err => {
        console.log('Error from login', err);
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
          {console.log(this.state, 'state inside login')}
          {(typeof web3 != 'undefined') ? (
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
            </div>) : (
            <img src="https://safetymanagementgroup.com/wp-content/uploads/2017/07/Oopsbutton.jpg"/>                
            )}
        </div>
        );
    }
}


const Login = connect(mapStateToProps)(ConnectedLogin);

export default Login;