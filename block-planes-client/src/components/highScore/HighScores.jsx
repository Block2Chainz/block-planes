import React, { Component } from 'react';
import axios from 'axios';
import Score from '../score/Score.jsx';



class HighScores extends Component {
    constructor(props) {
        super(props);
        this.state = {
          highScores: [],
        };
    }

    componentWillMount() {
        this.getHighScores();
    }

    getHighScores() {
      axios
      .get(`/leaderboardhi`)
      .then(response => {
        console.log('flag1: ', response.data);
        this.setState({highScores : response.data});
      })
      .catch(err => {
        console.log('Error from get high scores', err);
      });
    }

    render() {
        return (
        <div className="high-score">
            <div className='username'>
            Username
            {this.state.highScores.map((set) => {
            console.log('flag2', set)
            return <Score name={set.name}/>
            })
            }
            </div>
            
            <div className='score'>
            Score
            {this.state.highScores.map((set) => {
            console.log('flag2', set)
            return <Score points={set.score}/>
            })}
            </div>
            
        </div>
        );
    }
}

export default HighScores;