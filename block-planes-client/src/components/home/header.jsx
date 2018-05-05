import React from 'react';
import { Link } from 'react-router-dom'
import { Image, Form, Grid, Button } from 'semantic-ui-react';
import './header.css';


const Header = () => (
    <div>
    <header className='login-header' >
    <Grid>
            <Grid.Row>
              <Grid.Column width={5}>
              <Link to='/home'><h1 className='title' >BlockPlanes</h1></Link>
              </Grid.Column>
              <Grid.Column width={2}>
              <Link to='/collection'><Button className='ui inverted button' size={'small'}>Collection</Button></Link>
              </Grid.Column>
               <Grid.Column width={2}>
               <Link to='/marketplace'><Button className='ui inverted button' size={'small'}>Marketplace</Button></Link>
              </Grid.Column>
              <Grid.Column width={2}>
              <Link to='/game'><Button className='ui inverted button' size={'small'}>Find Game</Button></Link>
              </Grid.Column>
              <Grid.Column width={5}>
              <Link to='/login'><Button className='ui inverted button' size='small' >Log In</Button></Link>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          </header>
      </div>
)

export default Header;