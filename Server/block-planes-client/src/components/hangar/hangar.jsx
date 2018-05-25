import React, { Component } from 'react';
import { connect } from "react-redux";
import { Grid } from 'semantic-ui-react';
import { storePlanes, logOut, selectPlane, deselectPlane } from "../../actions/index";
import 'bluebird';
import './hangar.css';
import Web3 from 'web3';
import TruffleContract from 'truffle-contract'
import cryptoPlanes from '../../../../block-planes-solidity/BlockPlanes/build/contracts/PlaneOwnership.json';
import Plane from './plane.jsx';

const mapDispatchToProps = dispatch => {
  return {
    logOut: () => dispatch(logOut()),
    storePlanes: planes => dispatch(storePlanes(planes)),
    selectPlane: plane => dispatch(selectPlane(plane)),
  };
};

const mapStateToProps = state => {
  return {
    contract: state.contract, 
    userPlanes: state.userPlanes, 
    userAddress: state.userAddress,
    selectedPlane: state.selectedPlane,
  };
};

class ConnectedHangar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      update: true,
      friendPlanes: [[999999, 50000071117]],
      planes: []
    }

    if (typeof web3 != 'undefined') {
      this.web3Provider = web3.currentProvider;
    } else {
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }

    this.web3 = new Web3(this.web3Provider);
    // this.blockplanes = TruffleContract(cryptoPlanes);
    // this.props.contract.setProvider(this.web3Provider);
}

  componentWillReceiveProps(next) {
      this.setState({ friendPlanes: [[999999, 50000071117]] }, () => {
        if (next.friend) {
          this.fetchPlanes(next.friend);
        }
      });
  }

  componentWillMount() {
    this.setState({planes: [[999999, 50000071117]]});
  }

  shouldComponentUpdate(next) {
    return next.friend != this.props.friend;
  }


  componentDidMount() {
    // clear out any selected plane if 
    // this.props.deselectPlane();
    // checks if a friend ID was passed in as props
    if (this.props.friend && this.state.friendPlanes.length <= 1) {
      // if so - fetches that user's planes and renders
      this.fetchPlanes(this.props.friend);
    } else {
      // no friend ID was passed in, 
      window.web3.eth.getAccounts((err, acct) => {
        // place within a setTimeout, so that the App.js has time to decode the JWT and put the address into the store
        setTimeout(() => {
          // makes sure you are still signed into the metamask account that is associated with your account in our DB 
          if (this.props.userAddress !== acct[0]) {
            // this means you signed into a different metamask account, so it signs you out 
            alert('Please make sure you are signed in with the correct MetaMask Account!');
            sessionStorage.removeItem('jwtToken');
            this.props.logOut();
          } else {
            // fetches your planes and renders
            this.fetchPlanes(this.props.userAddress);
          }
        }, 500);
      });
    }
  //   this.props.contractInstance.createRandomPlane({
  //     gas: 300000,
  //     from: window.web3.eth.accounts[0],
  //     value: window.web3.toWei(0.001, 'ether')
  //  }, (error, result) => {
  //    if (result) {
  //      console.log("successful woohoo");
  //    }
  //    if (error) {
  //     console.log('unsuccessful wahhhh');               
  //    }
  //     // Result is the transaction address of that function
  //  })
  }

  fetchPlanes(user) {
    console.log('what is user:', user);
    let userAddress;
      
      let planesForSale = [];
      let planesWithAttr = [];
 
        this.props.contract.getPlanesByOwner(user, (error, result) => {
          if (!error) {
            let planeArray = result.map((plane) => {
              return plane.toNumber();
            });
            let hangar = [];
            for (let i = 0; i < planeArray.length; i++) {
              let planeAttr;
              let planePrice;
              this.props.contract.planes(planeArray[i], (err, plane) => {
                if (err) console.log('err');
                else {
                  planeAttr = plane[0].toNumber();
                  hangar.push([planeArray[i], planeAttr]);
                  if (i === planeArray.length - 1) {
                    if (this.props.friend) {
                      this.setState({friendPlanes: this.state.friendPlanes.concat(hangar)});
                    } else {
                      this.props.storePlanes({ planes: hangar });
                    }
        
                  }
                }
              });
            }
          } else {
            console.log(err);
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

  highlight(plane) {
    if (!this.props.friend) {
      this.props.selectPlane(plane)
    }
  }

  render() {
    console.log('inside hangar: ', this.props.friend);
    let planes;
    if (this.props.friend) {
      planes = this.state.friendPlanes;
    } else {
      planes = this.props.userPlanes;
    }

 
      return (
        <div className='center-content'>
          <br/>
          <div className='planes-outerdiv'>
            <Grid>
              <Grid.Row className='planerow'>
                {
                  planes.map((plane) => {
                  if (this.props.selectedPlane === plane[1]) {
                    return <Plane
                    selected={this.props.friend ? false : true}
                    key={Math.random()}
                    plane={plane}
                    highlight={this.highlight.bind(this)} 
                    />
                  } else {
                    return <Plane 
                    selected={false}
                    key={Math.random()}
                    plane={plane}
                    highlight={this.highlight.bind(this)} />
                  }
                })
                }
              </Grid.Row>
            </Grid>
          </div>
        </div>
      )
  }
}

const Hangar = connect(mapStateToProps, mapDispatchToProps)(ConnectedHangar);

export default Hangar;