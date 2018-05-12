import React, { Component } from 'react';
import axios from 'axios';
import './Score.css';



class Score extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
        <div className='score'>
            <p>{this.props.name}</p>                                           
            <p>{this.props.points}</p>
        </div>
        );
    }
}

export default Score;