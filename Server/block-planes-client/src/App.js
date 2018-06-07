import {} from 'dotenv/config'
import React, { Component } from 'react';
import { BrowserRouter} from 'react-router-dom';
import axios from 'axios';
import { connect} from "react-redux";
import { logIn,  logOut,  storeContract} from "./actions/index"
import Header from './components/home/header.jsx';
import Web3 from 'web3';
import Main from './components/main/main.jsx';
import './App.css';
import jwtDecode from 'jwt-decode';
import { Image,  Form,  Grid,  Button } from 'semantic-ui-react';
import Socketio from 'socket.io-client';
import contractABI from './solidity/contract.js';
import './components/home/header.css';

const mapDispatchToProps = dispatch => {
  return {
    logIn: user => dispatch(logIn(user)),
    logOut: () => dispatch(logOut()),
    storeContract: contract => dispatch(storeContract(contract))
  };
};
const mapStateToProps = state => {
  return {
    id: state.id,
    username: state.username,
    profilePicture: state.profilePicture,
    fullName: state.fullName,
    totalPoints: state.totalPoints,
    createdAt: state.createdAt,
    contract: state.contract,
    blockchainAddress: state.blockchainAddress,
  };
};

// use this.props.logIn(user) and this.props.logOut() instead of setState
class ConnectedApp extends Component {
  constructor() {
    super();

    if (window.web3 !== undefined) {
      console.log(contractABI)
      const MyContract = window.web3.eth.contract(contractABI);
      this.state = {
        warning: false,
        contractInstance: MyContract.at('5d274da173763dcfdd3d692a8992ad333da80a4e'),
      }
    } else {
      this.state = {
        warning: true
      }
    }

    this.logout = this.logout.bind(this);
    this.tokenLogin = this.tokenLogin.bind(this);
    console.log('process.env', process.env.REACT_APP_CHAT_PORT)
    this.socket = Socketio(process.env.REACT_APP_CHAT_PORT);
    if (typeof web3 != 'undefined') {
      this.web3Provider = web3.currentProvider;
    } else {
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
  }
  componentDidMount() {
    this.tokenLogin();
  }

  tokenLogin() {
    // checks that MetaMask is installed ***
    if (typeof web3 !== 'undefined') {
      this.web3 = new Web3(this.web3Provider);
      this.props.storeContract(this.state.contractInstance);
      // check for a token in storage
      if (sessionStorage.getItem('jwtToken')) {
        axios.get('/signInToken', {
          params: {
            token: sessionStorage.getItem('jwtToken'),
          }
        }).then(response => {
          // compares the blockchain address stored on the token with the one you are logged in with
          window.web3.eth.getAccounts((err, account) => {
            if (account[0] === response.data.user.blockchainAddress) {
              // if they match, then save the login information
              this.props.logIn({
                // this gets the data off of the jwt token and saves it into state
                id: response.data.user.id,
                username: response.data.user.username,
                profilePicture: response.data.user.profilePicture,
                fullName: response.data.user.fullName,
                totalPoints: response.data.user.totalPoints,
                createdAt: response.data.user.createdAt,
                tokenLogin: this.tokenLogin,
                blockchainAddress: response.data.user.blockchainAddress,
              });
            } else {
              // otherwise, alert that the site will not function correctly if signed in with the incorrect account
              alert('what You are logging in with a different MetaMask account. Please log in with the correct MetaMask account');
              this.logout();
            }
          });
        }).catch(err => {
          console.log('Error getting session id', err);
        });
      }
    } else {
      // metamask is not installed ***
      alert('This site needs a web3 provider(MetaMask) to run properly. Please make sure metamask is installed!');
    }
  }
  logout() {
    sessionStorage.removeItem('jwtToken');
    this.props.logOut();
  }
    render() {
    if (this.state.warning) {
      return (
        <div>
          <Grid className = 'homeSection secondportion'>
            <span className = 'secondhalf'> </span>

            <Grid.Column width = {8}>
              <Grid.Row>
                <div className = "ui inverted container blurb">
                  <h2> This site relies on the extension <a href = 'https://metamask.io'> MetaMask </a> to work</h2>
                  <h2> Please download and install it  <a href = 'https://metamask.io'> here </a> and then refresh the page.</h2>
                </div> 
              </Grid.Row> 
            </Grid.Column>

            <Grid.Column width = {8} className = 'left-side-Login'>
              <div className = 'left-picture' >
                <Image src = 'http://res.cloudinary.com/dkkgoc7cc/image/upload/v1527873819/Screenshot_27.png' size = 'massive' rounded / >
              </div> 
            </Grid.Column>

            <span className = 'secondhalf' > </span>

          </Grid>
        </div>
      )
    } else {
      return ( 
        <div className = "App" >
          <BrowserRouter >
            <Header logout = { this.logout } tokenLogin = { this.tokenLogin } /> 
          </BrowserRouter> 
        </div>
      )
    }
  }
}
const App = connect(mapStateToProps, mapDispatchToProps)(ConnectedApp);
export default App;