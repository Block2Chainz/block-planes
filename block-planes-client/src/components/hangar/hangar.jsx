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
      friendPlanes: [[999999, 50000071117]]
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

  componentWillReceiveProps(next) {
      this.setState({ friendPlanes: [[999999, 50000071117]] }, () => {
        if (next.friend) {
          this.fetchPlanes(next.friend);
        }
      });
  }

  shouldComponentUpdate(next) {
    return next.friend != this.props.friend;
  }


  componentDidMount() {
    // clear out any selected plane if 
    // this.props.deselectPlane();
    // checks if a friend ID was passed in as props
    if (this.props.friend && this.state.friendPlanes.length <= 1) {
      console.log('FRIEND', this.props.friend);
      // if so - fetches that user's planes and renders
      this.fetchPlanes(this.props.friend);
    } else {
      // no friend ID was passed in, 
      console.log('NO FRIEND', this.props.userAddress);
      web3.eth.getCoinbase((err, acct) => {
        // place within a setTimeout, so that the App.js has time to decode the JWT and put the address into the store
        setTimeout(() => {
          // makes sure you are still signed into the metamask account that is associated with your account in our DB 
          if (this.props.userAddress !== acct) {
            // this means you signed into a different metamask account, so it signs you out 
            alert('Please make sure you are signed in with the correct MetaMask Account!');
            sessionStorage.removeItem('jwtToken');
            this.props.logOut();
          } else {
            // fetches your planes and renders
            this.fetchPlanes(this.props.userAddress);
          }
        }, 500);
      })
    }
  }

  fetchPlanes(user) {
    console.log('FETCHING PLANES #@O)#IU$@O#IU$O@I#U$OI@#U$O@I#U$O@I#U$OI@#U$')
    this.props.contract.getPlanesByOwner(user)
    .then((planes) => {
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
        this.props.contract.planes(planeArray[i]).then((plane) => {
          planeAttr = plane[0].toNumber();
          console.log('hangar sitch', [planeArray[i], planeAttr]);
          hangar.push([planeArray[i], planeAttr]);
          if (i === planeArray.length - 1) {
            if (this.props.friend) {
              this.setState({friendPlanes: this.state.friendPlanes.concat(hangar)})
            } else {
              this.props.storePlanes({ planes: hangar });
            }
          }
        });
      }
    }).catch((err) => {console.log('NO PLANES')});
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (nextProps.userPlanes.length === 0 && this.props.userPlanes.length !== 0) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }

  highlight(plane) {
    if (!this.props.friend) {
      this.props.selectPlane(plane)
    }
  }

  render() {
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