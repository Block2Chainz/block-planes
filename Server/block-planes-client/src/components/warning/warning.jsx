import React, { Component } from 'react';
// import { Redirect, Link } from 'react-router-dom';
import { Image, Form, Grid, Button } from 'semantic-ui-react';


class Warning extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <Grid className='homeSection firstportion'>

                <Grid.Row >
                </Grid.Row>

                <Grid.Column width={8} >
                    <Grid.Row>
                        <div className="ui inverted container blurb">
                            <h2>This site relies on the extension <a href='https://metamask.io'>MetaMask</a>  to work</h2>
                        </div>
                    </Grid.Row>
                </Grid.Column>

                <Grid.Column width={8} className='left-side-Login' >
                    <div className='left-picture' >
                        <Image src='http://res.cloudinary.com/dkkgoc7cc/image/upload/v1527873819/Screenshot_27.png' size='massive' rounded />
                    </div>
                </Grid.Column>

            </Grid>
        );
    }
}

export default Warning;