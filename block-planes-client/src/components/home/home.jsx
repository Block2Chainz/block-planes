import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Image, Form, Grid, Button } from 'semantic-ui-react';
import './header.css';

class Home extends Component {
    render() {
        return (
            <div>
          <Grid>
            <Grid.Column width={6} >
                <Grid.Row className='info'>
                  <Grid.Column width={2}>
                  <div className="ui inverted container  blurb">
                    <h2 className="about1">Pew</h2>
                    <h2 className="about2">Pew</h2>
                    <h2 className="about3">Pew</h2>
                    <h3 className="about4">Strap in and get blasting.</h3>
                  </div>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row className='create-account'>
                <br></br>
                <Link to='/signup'><Button className='ui inverted button' size='massive' >Sign Up</Button></Link>
                </Grid.Row>
            </Grid.Column>
            <Grid.Column width={8} className='left-side-Login' >
              <div className='left-picture' >
                <Image src='https://i.imgur.com/wjtMMUC.png' size='big' rounded />
              </div>
            </Grid.Column>
          </Grid>
        </div>
        );
    }
}

export default Home;