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
        console.log('hello')   
        let userAddress, contract;
        let planesForSale = [];
        let planesWithAttr = [];
        this.web3.eth.getCoinbase((err, address) => {
          // storing the user blockchain address*****
          userAddress = address;
          console.log(address);
          // get the contract instance
          this.blockplanes.deployed()
          .then((instance) => {
          this.setState({contract : instance, userAddress : address});
          contract = instance;
          return instance.getPlanesByOwner(address);
          }).then((planes) => {
            return planes.map((plane) => {
              return plane.toNumber();
            });
          }).then((planeArray) => {
            let hangar = [];
            for (let i = 0; i < planeArray.length; i++) {
              let planeAttr;
              contract.planes(planeArray[i]).then((plane) => {
                planeAttr = plane[0].toNumber();
                hangar.push([planeArray[i], planeAttr, plane[1]]);
                if (i === planeArray.length - 1) {
                  this.setState({yourPlanes : hangar});
                }
              });
            }
          });
          // console.log('planes on sale: ', planesForSale);
        });
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

    handleMenuClick(e, { name }) {
      console.log('what is name:', name)
      this.setState({ currentTab : name });
    }

    render() {
        console.log(this.state)
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
        const renderPlanes = currentPlanes.map((plane, index) => {
          return (
            <Grid.Column className='plane-column'>
            <div className='single-plane'>
            <Plane key={Math.random()} plane={plane} />
            <div className='plane-menu'>
                <div className='plane-stats-div'>
                  <p className='plane-stats'>Speed: # <br/>Inertia: #<br/>Firing Rate: # </p>              
                </div>
              <div className='menu-button'>
                <Button as='div' labelPosition='left'>
                  <Label as='a' basic>1000 ω</Label>
                  <Button>
                    Sell!
                  </Button>
                </Button>
              </div>
            </div>
            </div>
            </Grid.Column>
          )
        });

        const renderBuyPlanes = planesOnSale.map((plane, index) => {
          return (
            <Grid.Column className='plane-column'>
            <div className='single-plane'>
            <Plane key={Math.random()} plane={plane} />
            <div className='plane-menu'>
              <div className='menu-button'>
                <div>
                  <p>Speed: #</p>
                  <p>Inertia: #</p>
                  <p>Firing Rate: #</p>                  
                </div>
                <Button as='div' labelPosition='left'>
                  <Label as='a' basic>Price</Label>
                  <Button>
                    Buy!
                  </Button>
                </Button>
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
              <p className="page-title">WELCOME</p>
              </div> 

             
            
              <div className='body-div'>
                <div className='menu-div'>
                <Menu fluid widths={2}  color={'black'} inverted={false} className='menu-tab'>
                  <Menu.Item name='Buy'   color={'red'} active={currentTab === 'Buy'} onClick={this.handleMenuClick} />
                  <Menu.Item name='Sell'  color={'red'} active={currentTab === 'Sell'} onClick={this.handleMenuClick} />
                </Menu>
                </div>

                <div className='plane-grid'>
                  {(this.state.currentTab === 'Sell') ? (<Grid columns={4} children={renderPlanes} className='plane-grid'/>) :
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