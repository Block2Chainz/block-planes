import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Image, Form, Grid, Button } from 'semantic-ui-react';
import './header.css';
import NotificationSystem from 'react-notification-system';
import Socketio from 'socket.io-client';
import { connect } from "react-redux";


const mapStateToProps = state => {
  return {
    userId: state.id
  };
};

class ConnectedHome extends Component {
  constructor(props) {
       super(props);
       this.state = {
           notificationSystem: this.refs.notificationSystem
       };
       this.addNotification = this.addNotification.bind(this);
    this.socket = Socketio('http://ec2-52-53-167-183.us-west-1.compute.amazonaws.com:2345');
    }

    notificationSystem = null;

    componentDidMount() {
      let component = this;
        this.notificationSystem = this.refs.notificationSystem;
    }

    addNotification(event, notificationObj) {
        event.preventDefault();
        this.notificationSystem.addNotification({
          title: 'New Message from ' + notificationObj.username,
          message: notificationObj.messageText,
          level: 'info'
        });
    }
        
    render() {
      let component = this;
        return (
          <div className='homebg'>
            <NotificationSystem ref="notificationSystem" />

            <Grid className='homeSection firstportion'>

              <Grid.Row >
              </Grid.Row>

              <Grid.Column width={8} >
                <Grid.Row>
                  <div className="ui inverted container blurb">
                    <h2 className="about1">Collect Planes</h2>
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
                  <Image src='https://i.imgur.com/MBsbBkv.png' size='massive' rounded />
                </div>
              </Grid.Column>
            </Grid>

            <Grid className='homeSection secondportion'>
              <span className='secondhalf'></span>

              <Grid.Row className='secondhalfheader'>
                <p className='secondhalftext'>Calling All Pilots</p>
              </Grid.Row>

              <Grid.Row className='secondhalfpara2'>
                <p className='secondhalfpara'>
                  <br/><br/>If you’re reading this, the world needs your help.
                  <br/><br/>That’s right, the WORLD.
                  <br/><br/>As a species, we always dreamed of making contact beyond the stars- to find out if we are truly alone in this vast universe.
                  <br/><br/>Turns out that was humanity's biggest mistake.
                  <br/><br/>Our bad.
                  <br/><br/>Flash forward to right now.
                  <br/><br/>Beings from another world are converging on our little, blue planet with plans to destroy life as we know it…
                  <br/><br/>...and you know, in general. 
                  <br/><br/>They've stolen a high-powered, long-range, super-awesome laser canon capable of annihilating small celestial bodies.
                  <br/><br/>Its code name?
                  <br/><br/>MOON DESTROYER.
                  <br/><br/>You can guess what they're trying to achieve here.
                  <br/><br/>That’s why BlockPlanes needs your help. 
                  <br/><br/>We're suppling any able bodied pilot with the means to fight back.
                  <br/><br/>Because if we lose this one, it'll mean the complete and utter eradication of all humanity.
                  <br/><br/>No pressure or anything.
                  <br/><br/>So what do you say, hero?
                  <br/><br/>We have the PLANES. Do you have the GUTS?
                </p>
              </Grid.Row>

              {/* <Grid.Row className='signupbuttonhome'>
                <Link to='/signup'><Button className='ui inverted button' size='massive' >Sign Up</Button></Link>
              </Grid.Row> */}

            </Grid>

            <Grid className='homeSection thirdportion'>
              <span className='thirdline'></span>  
              
              <Grid.Row>
                <p className='thirdtext'>What are BlockPlanes?</p>
              </Grid.Row>

              <Grid.Row className='thirdpara'>
                <p className='thirdpara'>
                  <br/><br/>BlockPlanes are an <a href='http://erc721.org'>ERC-721</a> <strong>crypto-collectible</strong>.
                  <br/><br/>You are also able to take your planes and fly them in an <strong>action-packed</strong> aerial shooter.
                  <br/><br/>The randomized planes you purchase are uniquely yours, and only yours. You can purchase a brand new randomly-generated plane, 
                  <br/>or you can buy and sell planes on the BlockPlanes marketplace.
                  <br/><br/>The planes are generated dynamically, based on a 16 digit integer that is stored on the blockchain.
                  <br/><br/>There are over *64*-Million possible planes to collect.
                  <br/><br/>All transactions are conducted on the Ethereum blockchain, and your data is handled securely through the MetaMask extension.
                  <br/><br/><small>No purchase necessary to play, but a MetaMask account is required. Get it free <a href='https://metamask.io'>here</a>.</small>
                </p>
              </Grid.Row>

            </Grid>

            <Grid className='homeSection fourthportion'>
              <span className='thirdline'></span>

              <Grid.Row>
                <p className='thirdtext'>Development Team</p>
              </Grid.Row>

              <Grid.Row className='thirdpara'>
                <Grid.Column width={5}>
                  <p className='thirdpara'>Sean Malone</p><br/>
                  <a href='#'><img width='150px' src='https://s3-us-west-1.amazonaws.com/blockplanes/profile.png'/></a>
                </Grid.Column>
                <Grid.Column width={6}>
                  <p className='thirdpara'>Joseph Nguyen</p><br/>
                  <a href='#'><img width='150px' src='https://s3-us-west-1.amazonaws.com/blockplanes/profile.png'/></a>
                </Grid.Column>
                <Grid.Column width={5}>
                  <p className='thirdpara'>Nick Vrdoljak</p><br/>
                  <a href='https://www.linkedin.com/in/nicholas-vrdoljak-52111453/'><img width='150px' src='https://s3-us-west-1.amazonaws.com/blockplanes/profile.png'/></a>
                </Grid.Column>
              </Grid.Row>

              <span className='thirdline'></span>

              <Grid.Row>
                <p className='thirdtext'>About the Site</p>
              </Grid.Row>

              <Grid.Row className='thirdpara'>
                <p className='thirdpara'>
                <br/><br/><br/><br/>
                </p>
              </Grid.Row>

              <span className='thirdline'></span>


            </Grid>
        </div>
        );
    }
}

const Home = connect(mapStateToProps)(ConnectedHome);

export default Home;