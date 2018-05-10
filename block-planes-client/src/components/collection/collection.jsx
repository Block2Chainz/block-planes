import React, { Component } from 'react';
import './collection.css';
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import cryptoPlanes from '../../../../block-planes-solidity/BlockPlanes/build/contracts/BlockPlanes.json';
import Plane from '../plane/plane.jsx';

class Collection extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      planes: [],
      contract:'',
    }

    if (typeof web3 != 'undefined') {
      this.web3Provider = web3.currentProvider
      this.web3 = new Web3(this.web3Provider)
  
      this.blockplanes = TruffleContract(cryptoPlanes)
      this.blockplanes.setProvider(this.web3Provider)
    } else {
      alert('This site needs a web3 provider(MetaMask) to run properly. Please install one and refresh!');
    }


  }

  componentWillMount() {
    if (typeof web3 != "undefined") {
      this.getPlanes();
    }
  }

  getPlanes() {
    this.web3.eth.getCoinbase((err, account) => {
      if (this.props.friendsAccount) {
        account = this.props.friendsAccount;
      }
      this.setState({ account })
      this.blockplanes.deployed().then((blockplanesInstance) => {
        this.setState( {contract : blockplanesInstance} );
        return blockplanesInstance.getPlanesByOwner(account);
      }).then((planes) => {
        let planeIds = [];
        planes.forEach((plane) => {
          planeIds.push(plane.toNumber());
        });
        return planeIds;
      }).then((planeArray) => {
        let hangar = [];
        planeArray.forEach((planeId) => {
          let planeAttr;
          this.state.contract.planes(planeId).then((plane) => {
             planeAttr = plane.toNumber();
             hangar.push([planeId, planeAttr]);
          });
        })
        console.log(hangar, 'flag1');          
        return hangar;
      }).then((finalArray) => {
            console.log(finalArray, 'flag2');
            this.setState({planes : finalArray});
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
        {(typeof web3 != 'undefined') ? (
        <Plane planes={this.state.planes}/>
        ) : (
        <img src="https://safetymanagementgroup.com/wp-content/uploads/2017/07/Oopsbutton.jpg"/>
        )}
      </div>
    )
  }
}

export default Collection;