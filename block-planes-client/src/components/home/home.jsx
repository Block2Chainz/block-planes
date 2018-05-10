import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Image, Form, Grid, Button } from 'semantic-ui-react';
import './header.css';

class Home extends Component {
    render() {
        return (
            <div>
          <Grid>
            <Grid.Column width={8} >
                <Grid.Row>
                  <div className="ui inverted container blurb">
                    <h2 className="about1">Build your Hangar</h2>
                    <h2 className="about2">Team Up</h2>
                    <h2 className="about3">Save the World</h2>
                    <h3 className="about4">Welcome to BlockPlanes.<br></br>Strap in.</h3>
                  </div>
                </Grid.Row>
                <Grid.Row className='create-account'>
                <br></br>
                <Link to='/signup'><Button className='ui inverted button' size='massive' >Sign Up</Button></Link>
                </Grid.Row>
            </Grid.Column>
            <Grid.Column width={8} className='left-side-Login' >
              <div className='left-picture' >
                <Image src='https://i.imgur.com/wjtMMUC.png' size='huge' rounded />
              </div>
            </Grid.Column>
          </Grid>
          <Grid>
          <Grid.Row className='secondhalf'>
          </Grid.Row>
          <Grid.Column width={6} >
          </Grid.Column>
          <Grid.Row className='secondhalfheader'>
                  <p className='secondhalftext'>Calling All Pilots</p>
                  </Grid.Row>
                  <Grid.Row>
                  <div className='mid-picture2' >
                <Image src='https://i.imgur.com/VNZZjii.png' size='large' rounded />
              </div>
                </Grid.Row>
                <Grid.Column width={4} >
          </Grid.Column>
          <Grid.Column width={9} >
                <Grid.Row className='secondhalfpara2'>
                  <p className='secondhalfpara'>Operation: MOONSHOT</p>
                </Grid.Row>
                <Grid.Row className='secondhalfpara2'>
                  <p className='secondhalfpara'>Priority: ALPHA</p>
                </Grid.Row>
                <Grid.Row className='secondhalfpara2'>
                  <p className='secondhalfpara'>Objectives: RESCUE THE PRESIDENT'S DAUGHTER</p>
                </Grid.Row>
                <Grid.Row className='secondhalfpara2'>
                  <p className='secondhalfpara'><br></br><br></br>Listen up, pilot.<br></br><br></br>The President's daughter has been abducted by the terrorist organization known as BLACK ROGUE DARK SPIDER HACK DEATH.<br></br><br></br>And she is way too fine for us to just stand idly by. <br></br><br></br>Seriously, she's just...I mean, DAMN. <br></br><br></br>Your mission is to tear through the enemies defenses, invade their fortified airbase, grab the hottie, and get the hell out.<br></br><br></br>How you do it, and who flies with you is up to you.<br></br><br></br>Her life and hotness are in your hands.<br></br><br></br>Good luck. </p>
                </Grid.Row>
                <Grid.Row className='signupbuttonhome'>
                <Link to='/signup'><Button className='ui inverted button' size='massive' >Sign Up</Button></Link>
                </Grid.Row>
          </Grid.Column>
                <Grid.Column width={4} >
          </Grid.Column>
          </Grid>
        </div>
        );
    }
}

export default Home;