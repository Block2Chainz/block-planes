import React, { Component } from 'react';
<<<<<<< HEAD
=======
import { connect } from "react-redux";
>>>>>>> creating assets and revising the ship rendering
import './collection.css';
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import cryptoPlanes from '../../../../block-planes-solidity/BlockPlanes/build/contracts/BlockPlanes.json';
import Plane from '../plane/plane.jsx';

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

class ConnectedCollection extends Component {
  constructor(props) {
    super(props)

    if (typeof web3 != 'undefined') {
      this.web3Provider = web3.currentProvider
    } else {
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')
    }

    this.web3 = new Web3(this.web3Provider)
    this.blockplanes = TruffleContract(cryptoPlanes)
    this.blockplanes.setProvider(this.web3Provider)

  }

  componentWillMount() {
    this.web3.eth.getCoinbase((err, address) => {
      // storing the user blockchain address*****
      this.props.storeUserAddress(address);
      // get the contract instance
      this.blockplanes.deployed()
      .then((instance) => {
        // storing the contract*****
        this.props.storeContract(instance);
        return instance.getPlanesByOwner(this.props.userAddress);
      }).then((planes) => {
        // putting the plane ids into an array
        let planeIds = [];
        planes.forEach((plane) => {
          planeIds.push(plane.toNumber());
        });
        return planeIds;
      }).then((planeArray) => {
        // getting the attributes for each plane in their collection
        let hangar = [];
        planeArray.forEach((planeId) => {
          let planeAttr;
          this.props.contract.planes(planeId).then((plane) => {
             planeAttr = plane.toNumber();
             hangar.push([planeId, planeAttr]);
          });
        })        
        return hangar;
      }).then((finalArray) => {
            // storing the user's plane attributes
            this.props.storeUserPlanes(finalArray);
      }); 
    });
  }

  //TEST CODE CONTRACT COMMUNICATION
      // this.web3.eth.getCoinbase((err, account) => {
      //   this.setState({ account })
      //   this.blockplanes.deployed().then((blockplanesInstance) => {
      //     console.log('planessss: ', blockplanesInstance, 'account', this.state.account);
      //     this.setState( {contract : blockplanesInstance} );
      //     return blockplanesInstance;
      //   }).then((contract) => {
      //     // return contract.createRandomPlane();        
      //     return contract.createRandomPlane({ from: this.web3.eth.accounts[0], value: this.web3.toWei(0.001, 'ether')});
      //   }).then((receipt) => {
      //     console.log('receipt: ', receipt, 'state: ', this.state);
      //     return receipt.logs[0].args.planeId.toNumber();
      //   }).then((planeCount) => {
      //     console.log(this.state.contract.planeToOwner(planeCount));
      //     return this.state.contract.planeToOwner(planeCount);
      //   });
      // });  

  render() {
    return (
      <div>
        <Plane />
      </div>
    )
  }
}

const Collection = connect(mapStateToProps, mapDispatchToProps)(ConnectedCollection);

export default Collection;