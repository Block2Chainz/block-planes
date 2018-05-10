import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Image, Form, Grid, Button } from 'semantic-ui-react';
import { connect } from "react-redux";
import Moment from 'moment';
import './friends.css';

const mapStateToProps = state => {
  console.log('state',state);
    return { 
        userId: state.id,
        username: state.username,
        profilePicture: state.profilePicture,
        totalPoints: state.totalPoints,
        createdAt: state.createdAt
    };
};

class ConnectedFriends extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCollection: true
    };
  }

    render() {
        console.log(this.props);
        return (
            <Grid>
          <Grid.Row>
          </Grid.Row>
                  <Grid.Row className='userrow'>
                  <div className='profilepic' >
                <Image src={this.props.profilePicture} size='medium' rounded />
                  <p className='joined'>Joined: {Moment(this.props.createdAt).format('MMMM Do YYYY')}</p>
              </div>
              <Grid.Column width={6} >
              <p className='username'>Friend Name</p>
              </Grid.Column >
              <Grid.Column width={6} >
                <p className='points'>{this.props.totalPoints}</p>
          </Grid.Column>
                </Grid.Row>
                <Grid.Column width={4} >
                <p className='collection'>Collection</p>
          </Grid.Column>
          <Grid.Column width={9} >
          </Grid.Column>
                <Grid.Column width={4} >
          </Grid.Column>
          </Grid>
        );
    }
}

const Friends = connect(mapStateToProps)(ConnectedFriends);

export default Friends;