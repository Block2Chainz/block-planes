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
import Hangar from '../hangar/hangar.jsx';
import './profile.css';

const mapStateToProps = state => {
    return { 
        userId: state.id,
        username: state.username,
        profilePicture: state.profilePicture,
        totalPoints: state.totalPoints,
        createdAt: state.createdAt,
        tokenLogin: state.tokenLogin,
        userAddress: state.userAddress
    };
};

class ConnectedProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCollection: true,
      totalScore: '',
      highScore: ''
    }
    this.handleDrop = this.handleDrop.bind(this);
  }

  componentDidMount() {
    this.fetchUserScores();
  }

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
        axios.post('/upload', {
          url: resizedURL,
          userId: this.props.userId
        }).then(function (response) {
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

  fetchUserScores() {
    let component = this;
    axios
      .get('/fetchHighScore', {
        params: {
          id: component.props.userId
        }
        })
      .then(response => {
        console.log('highscore', response);
          component.setState({
            highScore: response.data.high_score,
            totalScore: response.data.total_points
          });
      })
      .catch(err => {
        console.log('Error from login', err);
      });
  }

    render() {
        return (
          <div className='profilebg'>
            <Grid className='profile-grid'>
              <Grid.Row className='userrowprofile'>
                <Grid.Column className='profile-pic-column'>
                  <div className='profilepic' >
                    <Dropzone className='dropzone' onDrop={this.handleDrop} accept="image/*">
                      <Image src={this.props.profilePicture} size='medium' rounded />
                    </Dropzone>
                    <p className='joined'>Joined: {Moment(this.props.createdAt).format('MMMM Do YYYY')}</p>
                  </div>
                </Grid.Column>
                <Grid.Column width={5} className='username-column'>
                    <p className='usernameprofile'>{this.props.username}</p>
                </Grid.Column>
                <Grid.Column className='profile-score-column' >
                  <p className='scoreprofile'>Total Score</p>
                  <p className='scoreprofile'>{this.state.totalScore}</p>
                  <p className='scoreprofile'>High Score</p>
                  <p className='scoreprofile'>{this.state.highScore}</p>
                </Grid.Column>
              </Grid.Row>
                <p className='hangar'>Hangar</p>
              <Grid.Row>
                <Hangar />
              </Grid.Row>
            </Grid>
          </div>
        );
    }
}

const Profile = connect(mapStateToProps)(ConnectedProfile);

export default Profile;