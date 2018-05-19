import React, { Component } from 'react';
import './marketplace.css';
import cryptoplanes from '../../../../block-planes-solidity/BlockPlanes/build/contracts/PlaneOwnership.json';
import TruffleContract from 'truffle-contract';
import Web3 from 'web3';
import Plane from '../hangar/plane.jsx';
import { Pagination, Grid, Button, Icon, Label, Input, Menu, Segment } from 'semantic-ui-react'


class Marketplace extends Component {
    constructor(props) {
        super(props);
        this.state = {
            yourPlanes : [],
            planesOnSale: [],
            contract: null,
            userAddress: null,
            currentPage: 1,
            planesPerPage: 12,
            currentTab: 'Buy',
        }
        this.pageChange = this.pageChange.bind(this);
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.sellPlane = this.sellPlane.bind(this);

        if (typeof web3 != 'undefined') {
            this.web3Provider = web3.currentProvider;
            } else {
            this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }
    
        this.web3 = new Web3(this.web3Provider);
        this.blockplanes = TruffleContract(cryptoplanes);
        this.blockplanes.setProvider(this.web3Provider);
    }

    componentWillMount() {   
        let userAddress, contract;
        let planesForSale = [];
        let planesWithAttr = [];
        this.web3.eth.getCoinbase((err, address) => {
          // storing the user blockchain address*****
          userAddress = address;
          // get the contract instance
          this.blockplanes.deployed()
          .then((instance) => {
          // console.log('all planes: ', instance.planes()[1]);
          this.setState({contract : instance, userAddress : address});
          contract = instance;
          // instance.createRandomPlane({ from: this.web3.eth.accounts[0], value: this.web3.toWei(0.001, 'ether')});  
          return instance.getPlanesByOwner(address);
          }).then((planes) => {
            return planes.map((plane) => {
              return plane.toNumber();
            });
          }).then((planeArray) => {
            let hangar = [];
            for (let i = 0; i < planeArray.length; i++) {
              let planeAttr;
              let planePrice;
              contract.planes(planeArray[i]).then((plane) => {
                planeAttr = plane[0].toNumber();
                planePrice = plane[2].toNumber();
                hangar.push([planeArray[i], planeAttr, plane[1], planePrice]);
                if (i === planeArray.length - 1) {
                  this.setState({yourPlanes : hangar});
                }
              });
            }
          });
        });
        this.web3.eth.getCoinbase((err, address) => {
          // storing the user blockchain address*****
          userAddress = address;
          // get the contract instance
          this.blockplanes.deployed()
          .then((instance) => {
          // console.log('all planes: ', instance.planes()[1]);
          // this.setState({contract : instance, userAddress : address});
          contract = instance;
          // instance.createRandomPlane({ from: this.web3.eth.accounts[0], value: this.web3.toWei(0.001, 'ether')});
          return instance.getPlanesForSale();
          }).then((planes) => {
            return planes.map((plane) => {
              return plane.toNumber();
            });
          }).then((planeArray) => {
            let hangar = [];
            for (let i = 0; i < planeArray.length; i++) {
              let planeAttr;
              let planePrice;
              contract.planes(planeArray[i]).then((plane) => {
                contract.getPlanePrice(planeArray[i]).then((price) => {
                  planePrice = price.toNumber()
                  planeAttr = plane[0].toNumber();
                  hangar.push([planeArray[i], planeAttr, plane[1], planePrice]);
                  if (i === planeArray.length - 1) {
                    this.setState({planesOnSale : hangar});
                  }
                });
              });
            }
          });
        });
    }

    sellPlane(event, planeInfo) {
      // event.preventDefault();
      // console.log('sellPlane target:', parseInt(event.target.price.value), planeInfo[0]);
      this.state.contract.sellPlane(planeInfo[0], parseInt(event.target.price.value), { from: this.web3.eth.accounts[0]});
    }

    buyPlane(event, planeInfo) {
      console.log('sellPlane target:', parseInt(event.target.cost.value), planeInfo);      
    }

    pageChange(e, { activePage }) {
      this.setState({
        currentPage: Number(activePage)
      });
    }

    handleMenuClick(e, { name }) {
      this.setState({ currentTab : name });
    }

    render() {
        console.log('owned planes: ', this.state.yourPlanes, 'for Sale: ', this.state.planesOnSale)
        const { yourPlanes, currentPage, planesPerPage, planesOnSale, currentTab } = this.state;
        const pageNumbers = [];

        let buyClass = null;
        let sellClass = null;

        currentTab === 'Buy' ? (buyClass = '.menu-active') : (sellClass = '.menu-active');

        //calculating plane index in current page
        const indexOfLastPlane = currentPage * planesPerPage;
        const indexOfFirstPlane = indexOfLastPlane - planesPerPage;
        const currentPlanes = yourPlanes.slice(indexOfFirstPlane, indexOfLastPlane);
        
        //render planes for current page
        const renderOwnPlanes = currentPlanes.map((plane, index) => {
          let sellPrice;
          return (
            <Grid.Column className='plane-column'>
            <div className='single-plane'>
            <Plane key={Math.random()} plane={plane} />
            <div className='plane-menu'>
                <div className='plane-stats-div'>
                  <p className='plane-stats'>Speed: # <br/>Inertia: #<br/>Firing Rate: # </p>              
                </div>
              <div className='menu-button'>
              {(plane[2] === true) ? <label>Current posted price: {plane[3]}</label> : null }
              <form onSubmit={(e) => this.sellPlane(e, plane)}>
                <input type='text' name='price' />
                <button>Sell</button>
              </form>
                {/* <Button as='div' labelPosition='left'>
                  <Label as='a' basic>1000 ω</Label>
                  <Button onClick={() => {this.sellPlane(plane[0], 200)}}>
                    Sell!
                  </Button>
                </Button> */}
              </div>
            </div>
            </div>
            </Grid.Column>
          );
        });

        const renderBuyPlanes = planesOnSale.map((plane, index) => {
          return (
            <Grid.Column className='plane-column'>
            <div className='single-plane'>
            <Plane key={Math.random()} plane={plane} />
            <div className='plane-menu'>
              <div className='plane-stats-div'>
                  <p className='plane-stats'>Speed: # <br/>Inertia: #<br/>Firing Rate: # </p>              
                </div>
                <div className='menu-button'>
                <form onSubmit={(e) => this.buyPlane(e, plane)}>
                <label>{plane[3]}</label>
                <button>Buy</button>
              </form>
              </div>
            </div>
            </div>
            </Grid.Column>
          )
        });

        //calculating number of pages based on number of items per page
        let currentSelection;
        (this.state.currentTab !== 'Buy') ? currentSelection = yourPlanes : currentSelection = planesOnSale;
        for (let i = 1; i <= Math.ceil(currentSelection.length / planesPerPage); i++) {
          pageNumbers.push(i);
        }

        return (
            <div className="marketplace">

                Buy, trade and sell right hurr  

              <div>
              <p className="page-title">HANGAR</p>
              </div> 

             
            
              <div className='body-div'>
                <div className='menu-div'>
                <Menu fluid widths={2}  color={'black'} inverted={false} className='menu-tab'>
                  <Menu.Item name='Buy'   color={'red'} active={currentTab === 'Buy'} onClick={this.handleMenuClick} />
                  <Menu.Item name='Sell'  color={'red'} active={currentTab === 'Sell'} onClick={this.handleMenuClick} />
                </Menu>
                </div>

                <div className='plane-grid'>
                  {(this.state.currentTab === 'Sell') ? (<Grid columns={4} children={renderOwnPlanes} className='plane-grid'/>) :
                  (<Grid columns={4} children={renderBuyPlanes} className='plane-grid'/>)}
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