import React, {  Component} from 'react';
import {  BrowserRouter} from 'react-router-dom';
import axios from 'axios';
import {  connect} from "react-redux";
import {  logIn,  logOut,  storeContract} from "./actions/index"
import Header from './components/home/header.jsx';
import Web3 from 'web3';
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
    const MyContract = window.web3.eth.contract([
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "previousOwner",
            "type": "address"
          },
          {
            "indexed": true,
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_planeId",
            "type": "uint256"
          }
        ],
        "name": "buyPlane",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "createRandomPlane",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "_owner",
            "type": "address"
          },
          {
            "indexed": true,
            "name": "_approved",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "_tokenId",
            "type": "uint256"
          }
        ],
        "name": "Approval",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "from",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "to",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "planeId",
            "type": "uint256"
          }
        ],
        "name": "Transfer",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "planeId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "attributes",
            "type": "uint256"
          }
        ],
        "name": "NewPlane",
        "type": "event"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_to",
            "type": "address"
          },
          {
            "name": "_tokenId",
            "type": "uint256"
          }
        ],
        "name": "approve",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_planeId",
            "type": "uint256"
          },
          {
            "name": "price",
            "type": "uint256"
          }
        ],
        "name": "sellPlane",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_fee",
            "type": "uint256"
          }
        ],
        "name": "setPurchaseFee",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_tokenId",
            "type": "uint256"
          }
        ],
        "name": "takeOwnership",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_to",
            "type": "address"
          },
          {
            "name": "_tokenId",
            "type": "uint256"
          }
        ],
        "name": "transfer",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_planeId",
            "type": "uint256"
          }
        ],
        "name": "unlistPlane",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_owner",
            "type": "address"
          }
        ],
        "name": "balanceOf",
        "outputs": [
          {
            "name": "_balance",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_planeId",
            "type": "uint256"
          }
        ],
        "name": "getPlanePrice",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_owner",
            "type": "address"
          }
        ],
        "name": "getPlanesByOwner",
        "outputs": [
          {
            "name": "",
            "type": "uint256[]"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "getPlanesForSale",
        "outputs": [
          {
            "name": "",
            "type": "uint256[]"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_tokenId",
            "type": "uint256"
          }
        ],
        "name": "ownerOf",
        "outputs": [
          {
            "name": "_owner",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "name": "ownerPlaneCount",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "planes",
        "outputs": [
          {
            "name": "attributes",
            "type": "uint256"
          },
          {
            "name": "sell",
            "type": "bool"
          },
          {
            "name": "price",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "planeSellCount",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "planeToOwner",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      }
    ]);
    this.state = {
      contractInstance: MyContract.at('5d274da173763dcfdd3d692a8992ad333da80a4e'),
    }
    this.logout = this.logout.bind(this);
    this.tokenLogin = this.tokenLogin.bind(this);
    this.socket = Socketio('http://ec2-13-57-209-229.us-west-1.compute.amazonaws.com:2345');
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
      console.log('checking flag1', this.state);
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
            console.log('heyyy', account);
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
    var component = this;
    return ( <div className = "App" >
      <BrowserRouter >
      <Header logout = { this.logout } tokenLogin = { this.tokenLogin }      /> 
      </BrowserRouter> </div>
    );
  }
}
const App = connect(mapStateToProps, mapDispatchToProps)(ConnectedApp);
export default App;