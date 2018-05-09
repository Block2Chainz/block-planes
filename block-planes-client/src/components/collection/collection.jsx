import React, { Component } from 'react';
import './collection.css';
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import cryptoPlanes from '../../../../block-planes-solidity/BlockPlanes/build/contracts/BlockPlanes.json';

class Collection extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      planes: [],
    }

    if (typeof web3 != 'undefined') {
      this.web3Provider = web3.currentProvider
    } else {
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')
    }

    this.web3 = new Web3(this.web3Provider)

    this.blockplanes = TruffleContract(cryptoPlanes)
    this.blockplanes.setProvider(this.web3Provider)

  }

  componentDidMount() {
    // TODO: Refactor with promise chain
    this.web3.eth.getCoinbase((err, account) => {
      this.setState({ account })
      this.blockplanes.deployed().then((blockplanesInstance) => {
        this.blockplanesInstance = blockplanesInstance;
        console.log('planessss: ', this.blockplanesInstance, 'account', this.state.account)
        
      })
    })

    // this.getPlanesByOwner(this.state.account).then(this.addPlanes);
  }

  //Look up all planes by current user in contract
  getPlanesByOwner(owner) {
      return this.state.cryptoPlanes.methods.getPlanesByOwner(owner).call()
  }  
  
  //Look up planes details in contract
  getPlanesDetails(id) {
      return cryptoPlanes.methods.planes(id).call()
  }
  
  //add each plane to plane array in state
  addPlanes(ids) {
      var planeArray = [];
      console.log('id in addPlane', ids);
      ids.forEach = (id) => {
        this.getPlaneDetails(id)
        .then(function(plane) {
          planeArray.concat(plane)} )
      }
      this.setState({planes: planeArray})
    }

  render() {
    return (
      <div>
        {this.state.planes}
      </div>
    )
  }
}

export default Collection;