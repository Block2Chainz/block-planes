import React, { Component } from 'react';
import { connect } from "react-redux";
import { Grid } from 'semantic-ui-react';
import { storeContract, storeUserAddress, storeUserPlanes } from "../../actions/index";
import 'bluebird';
import './hangar.css';
import Web3 from 'web3';
import TruffleContract from 'truffle-contract'
import cryptoPlanes from '../../../../block-planes-solidity/BlockPlanes/build/contracts/BlockPlanes.json';
import Plane from './plane.jsx';

const mapDispatchToProps = dispatch => {
  return {
    storeContract: contract => dispatch(storeContract(contract)),
    storeUserAddress: address => dispatch(storeUserAddress(address)),
    storeUserPlanes: user => dispatch(storeUserPlanes(user)),
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

    this.web3 = new Web3(this.web3Provider)
    this.blockplanes = TruffleContract(cryptoPlanes)
    this.blockplanes.setProvider(this.web3Provider)
  }

  componentDidMount() {
    let userAddress, contract;
    this.web3.eth.getCoinbase((err, address) => {
      // storing the user blockchain address*****
      userAddress = address;
      // get the contract instance
      this.blockplanes.deployed()
      .then((instance) => {
        // storing the contract*****
        contract = instance;
        return instance.getPlanesByOwner(userAddress);
      }).then((planes) => {
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
          contract.planes(planeArray[i]).then((plane) => {
            planeAttr = plane.toNumber();
            hangar.push([planeArray[i], planeAttr]);
            if (i === planeArray.length - 1) {
              this.props.storeUserPlanes({ contract, userAddress, userPlanes: hangar });
            }
          });
        }
      })
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