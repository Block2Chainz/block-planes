import React, { Component } from 'react';
import HighScores from '../highScore/HighScores.jsx';


class Leaderboard extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <div>
            <HighScores/>
            </div>
        )
    }
}

export default Leaderboard;