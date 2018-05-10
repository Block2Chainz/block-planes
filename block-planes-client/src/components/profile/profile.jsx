import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Image, Form, Grid, Button } from 'semantic-ui-react';
import { connect } from "react-redux";
import axios from 'axios';
import Moment from 'moment';
import Dropzone from 'react-dropzone';
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import cryptoPlanes from '../../../../block-planes-solidity/BlockPlanes/build/contracts/BlockPlanes.json';
import Plane from '../plane/plane.jsx';
import './profile.css';

const mapStateToProps = state => {
  console.log('state',state);
    return { 
        userId: state.id,
        username: state.username,
        profilePicture: state.profilePicture,
        totalPoints: state.totalPoints,
        createdAt: state.createdAt,
        tokenLogin: state.tokenLogin
    };
};

class ConnectedProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCollection: true,
      account: '0x0',
      planes: [],
      contract:''
    }
    if (typeof web3 != 'undefined') {
      this.web3Provider = web3.currentProvider;
    } else {
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    this.web3 = new Web3(this.web3Provider);
    this.blockplanes = TruffleContract(cryptoPlanes);
    this.blockplanes.setProvider(this.web3Provider);
    this.handleDrop = this.handleDrop.bind(this);
  }

  componentWillMount() {
    this.web3.eth.getCoinbase((err, account) => {
      this.setState({ account })
      this.blockplanes.deployed().then((blockplanesInstance) => {
        this.setState( {contract : blockplanesInstance} );
        return blockplanesInstance;
      }).then((contract) => {
        this.setState({planes : this.state.contract.getPlanesByOwner(this.state.account)});
        return contract.getPlanesByOwner(this.state.account);
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

  handleDrop(files) {
    const handleThis = this;
    const uploaders = files.map(file => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('tags', 'codeinfuse, medium, gist');
      formData.append('upload_preset', 'qsfgq2uy'); // Replace the preset name with your own
      formData.append('api_key', '482543561232562'); // Replace API key with your own Cloudinary key
      formData.append('timestamp', (Date.now() / 1000) | 0);

      // Make an AJAX upload request using Axios (replace Cloudinary URL below with your own)
      return axios.post('https://api.cloudinary.com/v1_1/ushanka/image/upload', formData, {
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      }).then(response => {
        const data = response.data;
        const fileURL = data.secure_url; // You should store this URL for future references in your app
        const resizedURL = [fileURL.slice(0, 48), 'w_300,h_300/', fileURL.slice(48)].join('');
        console.log('data!', data);
        console.log('url!', fileURL);
        console.log('resized url!', resizedURL, 'id', this.props.userId);
        axios.post('/upload', {
          url: resizedURL,
          userId: this.props.userId
        }).then(function (response) {
          console.log('saved to the db, response', response);
          console.log('token login function', handleThis.props.tokenLogin);
          let component = this;
          axios
            .get('/updateToken', {
              params: {
                username: handleThis.props.username
              }
            })
            .then(response => {
              if (response.data === 'wrong') {
                alert('Wrong username or password!');
              } else {
                console.log('response.data.token', response.data.token)
                sessionStorage.setItem('jwtToken', response.data.token);
                handleThis.props.tokenLogin();
              }
            })
            .catch(err => {
              console.log('Error from login', err);
            });
        });
      })
    });
  }

    render() {
        console.log(this.props);
        return (
            <Grid>
          <Grid.Row>
          </Grid.Row>
                  <Grid.Row className='userrow'>
                  <div className='profilepic' >
                  <Dropzone className='dropzone' onDrop={this.handleDrop} accept="image/*">
                  <Image src={this.props.profilePicture} size='medium' rounded />
                    </Dropzone>
                  <p className='joined'>Joined: {Moment(this.props.createdAt).format('MMMM Do YYYY')}</p>
              </div>
              <Grid.Column width={6} >
              <p className='username'>{this.props.username}</p>
              </Grid.Column >
              <Grid.Column width={6} >
                <p className='points'>{this.props.totalPoints}</p>
          </Grid.Column>
                </Grid.Row>
                <p className='hangar'>Hangar</p>
                <Grid.Row>
                <Plane planes={this.state.planes}/>
          </Grid.Row>
          </Grid>
        );
    }
}

const Profile = connect(mapStateToProps)(ConnectedProfile);

export default Profile;