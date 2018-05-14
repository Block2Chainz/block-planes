import React, { Component } from 'react';
import { connect } from "react-redux";
import { Grid } from 'semantic-ui-react';
import { storeContract, storeUserAddress, storePlanes, logOut } from "../../actions/index";
import 'bluebird';
import './hangar.css';
import Web3 from 'web3';
import TruffleContract from 'truffle-contract'
import cryptoPlanes from '../../../../block-planes-solidity/BlockPlanes/build/contracts/BlockPlanes.json';
import Plane from './plane.jsx';

const mapDispatchToProps = dispatch => {
  return {
    // storeUserAddress: address => dispatch(storeUserAddress(address)),
    logOut: () => dispatch(logOut()),
    storePlanes: user => dispatch(storePlanes(user)),
  };
};

const mapStateToProps = state => {
  return {
    contract: state.contract, 
    userPlanes: state.userPlanes, 
    userAddress: state.userAddress,
  };
};

class ConnectedHangar extends Component {
  constructor(props) {
    super(props);

    if (typeof web3 != 'undefined') {
      this.web3Provider = web3.currentProvider;
    } else {
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }

    this.user;
    this.web3 = new Web3(this.web3Provider)
    this.blockplanes = TruffleContract(cryptoPlanes)
    this.blockplanes.setProvider(this.web3Provider)
  }

  componentDidMount() {
    // checks if a friend ID was passed in as props
    if (this.props.friend) {
      // if so - fetches that user's planes and renders
      this.user = this.props.friend;
      this.fetchPlanes();
    } else {
      // no friend ID was passed in, 
      web3.eth.getCoinbase((err, acct) => {
        // place within a setTimeout, so that the App.js has time to decode the JWT and put the address into the store
        setTimeout(() => {
          // makes sure you are still signed into the metamask account that is associated with your account in our DB 
          if (this.props.userAddress !== acct) {
            // this means you signed into a different metamask account, so it signs you out 
            alert('Please make sure you are signed in with the correct MetaMask Account!');
            sessionStorage.removeItem('jwtToken');
            this.props.logOut();
          } else {
            // fetches your planes and renders
            this.user = this.props.userAddress;
            this.fetchPlanes();
          }
        }, 500);
      })
    }
  }

  fetchPlanes() {
    this.props.contract.getPlanesByOwner(this.user)
    .then((planes) => {
      // putting the plane ids into an array
      let planeIds = [];
      return planes.map((plane) => {
        return plane.toNumber();
      });
    }).then((planeArray) => {
      // getting the attributes for each plane in their collection
      let hangar = [];
      for (let i = 0; i < planeArray.length; i++) {
        let planeAttr;
        this.props.contract.planes(planeArray[i]).then((plane) => {
          planeAttr = plane.toNumber();
          hangar.push([planeArray[i], planeAttr]);
          if (i === planeArray.length - 1) {
            this.props.storePlanes({ planes: hangar });
          }
        });
      }
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.userPlanes.length === 0 && this.props.userPlanes.length !== 0) {
      return false;
    } else {
      return true;
    }
  }

  render() {
      return (
          <Grid>
            {/* Should also generate a generic plane for all users and display it here */}
            <Grid.Row className='planerow'>
              {this.props.userPlanes.map((plane) => {
                return <Plane
                  key={Math.random()}
                  plane={plane} />
              })
              }
            </Grid.Row>
          </Grid>
      )
  }
}

const Hangar = connect(mapStateToProps, mapDispatchToProps)(ConnectedHangar);

export default Hangar;