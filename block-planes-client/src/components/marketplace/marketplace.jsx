import React, { Component } from 'react';
import './marketplace.css';
import cryptoplanes from '../../../../block-planes-solidity/BlockPlanes/build/contracts/PlaneOwnership.json';
import TruffleContract from 'truffle-contract';
import Web3 from 'web3';
import Plane from '../hangar/plane.jsx';
import { Pagination, Grid, Button, Icon, Label } from 'semantic-ui-react'


class Marketplace extends Component {
    constructor(props) {
        super(props);
        this.state = {
            yourPlanes : [],
            contract: null,
            userAddress: null,
            currentPage: 1,
            planesPerPage: 12
        }
        this.pageChange = this.pageChange.bind(this);
        if (typeof web3 != 'undefined') {
            this.web3Provider = web3.currentProvider;
            } else {
            this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }
    
        this.web3 = new Web3(this.web3Provider);
        this.blockplanes = TruffleContract(cryptoplanes);
        this.blockplanes.setProvider(this.web3Provider);
    }

    componentDidMount() {
        let userAddress, contract;
        let planesForSale = [];
        let planesWithAttr = [];
        this.web3.eth.getCoinbase((err, address) => {
          // storing the user blockchain address*****
          userAddress = address;
          // get the contract instance
          this.blockplanes.deployed()
          .then((instance) => {
          this.setState({contract : instance, userAddress : address});
          contract = instance;
          // instance.createRandomPlane({ from: this.web3.eth.accounts[0], value: this.web3.toWei(0.001, 'ether')});
          setTimeout(function() {console.log('flag2', address, 'address: ', instance);}, 2000);
          return instance.getPlanesByOwner(address);
          }).then((planes) => {
            return planes.map((plane) => {
              return plane.toNumber();
            });
          }).then((planeArray) => {
            console.log('plane array: ', planeArray);
            let hangar = [];
            for (let i = 0; i < planeArray.length; i++) {
              let planeAttr;
              contract.planes(planeArray[i]).then((plane) => {
                planeAttr = plane.toNumber();
                hangar.push([planeArray[i], planeAttr]);
                if (i === planeArray.length - 1) {
                  this.setState({yourPlanes : hangar});
                }
              });
            }
          });
          // console.log('planes on sale: ', planesForSale);
        });
    }

    getPlanesOnSale() {
        console.log('plane array within marketplace: ', this.state.planes);
    }

    sellPlane(planeId) {
      this.state.contract.sellPlane(planeId, )
    }

    askPrice(planeId) {
      let price = prompt('Please provide selling price:');
    }

    buyPlane() {

    }

    pageChange(e, { activePage }) {
      this.setState({
        currentPage: Number(activePage)
      });
    }

    render() {
        const { yourPlanes, currentPage, planesPerPage } = this.state;
        const pageNumbers = [];

        //calculating plane index in current page
        const indexOfLastPlane = currentPage * planesPerPage;
        const indexOfFirstPlane = indexOfLastPlane - planesPerPage;
        const currentPlanes = yourPlanes.slice(indexOfFirstPlane, indexOfLastPlane);
        
        //render planes for current page
        const renderPlanes = currentPlanes.map((plane, index) => {
          return (
            <Grid.Column className='plane-column'>
            <div className='single-plane'>
            <Plane key={Math.random()} plane={plane} />
            <div className='plane-menu'>
              {/* <button>Buy!</button> */}
              <div>
                <Button as='div' labelPosition='left'>
                  <Label as='a' basic>2,048</Label>
                  <Button icon>
                    <Icon name='fork' />
                  </Button>
                </Button>
              </div>
            </div>
            </div>
            </Grid.Column>
          )
        });

        //calculating number of pages based on number of items per page
        for (let i = 1; i <= Math.ceil(yourPlanes.length / planesPerPage); i++) {
          pageNumbers.push(i);
        }

        return (
            <div className="marketplace">

                Buy, trade and sell right hurr  

              <div>
              <p className="page-title">BUY AND SELL</p>
              </div> 

              <div>
                <div className='plane-grid'>
                  <Grid columns={4} children={renderPlanes} className='plane-grid'/>
                </div>
                <div className='page-selector'>
                  <Pagination defaultActivePage={1} totalPages={pageNumbers.length} onPageChange={this.pageChange}/>
                </div>
              </div>
            </div>
        )
    }
}

export default Marketplace;