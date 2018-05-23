import React, { Component } from 'react';
import {  BrowserRouter} from 'react-router-dom';
import axios from 'axios';
import { connect } from "react-redux";
import { logIn, logOut, storeContract } from "./actions/index"
import Header from './components/home/header.jsx';

import Web3 from 'web3';
import TruffleContract from 'truffle-contract'
import cryptoPlanes from '../../block-planes-solidity/BlockPlanes/build/contracts/PlaneOwnership.json';

import Main from './components/main/main.jsx';
import './App.css';
import jwtDecode from 'jwt-decode';
import Socketio from 'socket.io-client';


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
    this.logout = this.logout.bind(this);
    this.tokenLogin = this.tokenLogin.bind(this);
    this.socket = Socketio('http://localhost:4225');

    if (typeof web3 != 'undefined') {
      this.web3Provider = web3.currentProvider;
    } else {
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
  }

  componentDidMount() {
    this.tokenLogin();
    // Can use this for notifications
    // this.socket.on('notify', function (message) {
    //   
    // });
  }

  tokenLogin() {
    // checks that MetaMask is installed ***
    if (typeof web3 !== 'undefined') {
      this.web3 = new Web3(this.web3Provider);
      this.blockplanes = TruffleContract(cryptoPlanes);
      this.blockplanes.setProvider(this.web3Provider);
      this.blockplanes.deployed().then(instance => {
        this.props.storeContract(instance);
      });

      // check for a token in storage
      if (sessionStorage.getItem('jwtToken')) {
        axios.get('/signInToken', {
          params: {
            token: sessionStorage.getItem('jwtToken'),
          }
        }).then(response => {
          // compares the blockchain address stored on the token with the one you are logged in with
          this.web3.eth.getCoinbase((err, account) => {
            if(account === response.data.user.blockchainAddress) {
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
              alert('You are logging in with an different MetaMask account. Please log in with the correct MetaMask account');
              this.logout();
            }
          });
        }).catch(err => {
          console.log('Error getting session id', err);
        })
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
    var component = this;
    return (
      <div className="App">
        <BrowserRouter>
        <Header logout={this.logout} tokenLogin={this.tokenLogin}/>
        </BrowserRouter>
      </div>
    );
  }
}

const App = connect(mapStateToProps, mapDispatchToProps)(ConnectedApp);

export default App;
