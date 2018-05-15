import React, { Component } from 'react';
import './marketplace.css';


class Marketplace extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }

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
        let planesForSale = [];
        this.web3.eth.getCoinbase((err, address) => {
          // storing the user blockchain address*****
          userAddress = address;
          // get the contract instance
          this.blockplanes.deployed()
          .then((instance) => {
            // get all planes id that is for sale
            contract = instance;
            for(let i = 0; i < instance.planesOnSaleCount[0]; i++) {
                planesForSale.push(instance.planesOnSale[i]);
            };
            return instance;
          }).then((instance) => {
            this.setState({planes : planesForSale})
          });
      }

    getPlanesOnSale() {

    }


    render() {
        return (
            <div className="marketplace">
            Marketplace
            </div>
        );
    }
}

export default Marketplace;