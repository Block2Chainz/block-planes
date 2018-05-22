import React, { Component } from 'react';
import './marketplace.css';
import cryptoplanes from '../../../../block-planes-solidity/BlockPlanes/build/contracts/PlaneOwnership.json';
import TruffleContract from 'truffle-contract';
import Web3 from 'web3';
import Plane from '../hangar/plane.jsx';
import { Pagination, Grid, Button, Icon, Label, Input, Menu, Segment } from 'semantic-ui-react';
import 'bluebird';


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
            render: true,
        }
        this.pageChange = this.pageChange.bind(this);
        this.handleMenuClickBuy = this.handleMenuClickBuy.bind(this);
        this.handleMenuClickSell = this.handleMenuClickSell.bind(this);        
        this.sellPlane = this.sellPlane.bind(this);
        this.unlistPlane = this.unlistPlane.bind(this);

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
        this.getPlanesForSale();
        this.getPlanesByOwner();
    }

    getPlanesByOwner() {
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
    }

    getPlanesForSale() {
      let userAddress, contract;
      let planesForSale = [];
      let planesWithAttr = [];
      this.web3.eth.getCoinbase((err, address) => {
        // storing the user blockchain address*****
        userAddress = address;
        // get the contract instance
        this.blockplanes.deployed()
        .then((instance) => {
        // this.setState({contract : instance, userAddress : address});
        contract = instance;
        // instance.createRandomPlane({ from: this.web3.eth.accounts[0], value: this.web3.toWei(0.001, 'ether')});
        return instance.getPlanesForSale();
        }).then((planes) => {
          return planes.map((plane) => {
            return plane.toNumber();
          });
        }).then((planeArray) => {
          if (planeArray.length === 0) {
            this.setState({planesOnSale : []});
          }
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
      event.preventDefault();
      this.state.contract.sellPlane(planeInfo[0], parseInt(event.target.price.value) * 1000000000000000000, { from: this.web3.eth.accounts[0]});
    }

    unlistPlane(planeInfo) {
      this.state.contract.unlistPlane(planeInfo[0], { from: this.web3.eth.accounts[0]});
    }

    buyPlane(event, planeInfo) {
      event.preventDefault();      
      let etherAmt = planeInfo[3] / 1000000000000000000;
      this.state.contract.buyPlane(planeInfo[0], { from: this.web3.eth.accounts[0], value: this.web3.toWei(etherAmt, 'ether')});      
    }

    pageChange(e, { activePage }) {
      this.setState({
        currentPage: Number(activePage)
      });
    }

    async handleMenuClickBuy(e, { name }) {
      this.getPlanesByOwner();
      await this.getPlanesForSale();
      this.setState({ currentTab : name });
    }

    async handleMenuClickSell(e, { name }) {
      this.getPlanesForSale();
      await this.getPlanesByOwner();
      this.setState({ currentTab : name });      
    }

    render() {
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
          let buttonLabel;
          (plane[2] === true) ? buttonLabel = 'Re-list' : buttonLabel = 'Sell';
          return (
            <Grid.Column className='plane-column' key={plane[0]}>
            <div className='single-plane'>
            <Plane key={plane[0]} plane={plane} />
            <div className='plane-menu-sell'>
                <div className='plane-stats-div'>
                  <p className='plane-stats'>Speed: # <br/>Inertia: #<br/>Firing Rate: # </p>              
                </div>
              <div className='menu-sell-form'>
                {(plane[2] === true) ? 
                  <div className='posted-price-div'><label className='label-listed-price'>Listed Price: {parseInt(plane[3]) / 1000000000000000000}</label><img className='eth-symbol' src='https://openclipart.org/image/300px/svg_to_png/294014/ethereum-classic-logo.png'></img></div> 
                  : <div className='posted-price-div-null'><label className='label-listed-price'></label></div>  
                }
                <form  className='form-sell' onSubmit={(e) => this.sellPlane(e, plane)}>
                  <div className='sell-input-div'>
                    <input type='text' name='price' className='sell-input' placeholder='Price for Sale'/>
                  </div>
                  <div className='sell-buttons-div'>
                  <button className='sell-button'>{buttonLabel}</button>
                    {(plane[2] === true) ?
                      <button type='button' className='sell-button' onClick={(e) => this.unlistPlane(plane)}>Unlist</button> : null
                    }
                  </div>
                </form>
              </div>
            </div>
            </div>
            </Grid.Column>
          );
        });

        const renderBuyPlanes = planesOnSale.map((plane, index) => {
          return (
            <Grid.Column className='plane-column' key={plane[0]}>
            <div className='single-plane'>
            <Plane key={plane[0]} plane={plane} />
            <div className='plane-menu'>
              <div className='plane-stats-div'>
                  <p className='plane-stats'>Speed: # <br/>Inertia: #<br/>Firing Rate: # </p>              
              </div>
              <div className='menu-form'>
                <form onSubmit={(e) => this.buyPlane(e, plane)} className='buy-form'>
                  <div className='price-div'>
                  <label className='price-label'>{plane[3] / 1000000000000000000}</label><img className='eth-symbol' src='https://openclipart.org/image/300px/svg_to_png/294014/ethereum-classic-logo.png'></img>
                  </div>
                  <div>
                  <button className='buy-button'>Buy</button>
                  </div>
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
              <div>
              <p className="page-title">HANGAR</p>
              </div>
              <div className='body-div'>
                <div className='menu-div'>
                <Menu fluid widths={2}  color={'black'} inverted={false} className='menu-tab'>
                  <Menu.Item className='itemmarket' name='Buy'   color={'red'} active={currentTab === 'Buy'} onClick={this.handleMenuClickBuy} />
                  <Menu.Item className='itemmarket' name='Sell'  color={'red'} active={currentTab === 'Sell'} onClick={this.handleMenuClickSell} />
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