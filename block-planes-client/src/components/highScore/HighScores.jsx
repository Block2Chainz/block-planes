import React, { Component } from 'react';
import axios from 'axios';
import Score from '../score/Score.jsx';
import './HighScore.css';
import { Header, Image, Table } from 'semantic-ui-react';



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
        let title;
        let title2;
        let title3;
        let cellColor;        
        return (
            <Table basic='very' celled collapsing className="leaderboard">
            <Table.Header>
            <Table.Row>
                <Table.HeaderCell >Weekly High Score Leaders</Table.HeaderCell>
            </Table.Row>
              <Table.Row>
                <Table.HeaderCell className="table-header">Rank</Table.HeaderCell>
                <Table.HeaderCell className="table-header">Player</Table.HeaderCell>
                <Table.HeaderCell className="table-header">High Score</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
          <Table.Body>
            {this.state.highScores.map((set, index) => {
              (index === (this.state.highScores.length - 1)) ? (title = 'cell-player-bottom') : (title = 'cell-player');
              (index === (this.state.highScores.length - 1)) ? (title2 = 'cell-score-bottom') : (title2 = 'cell-score'); 
              (index === (this.state.highScores.length - 1)) ? (title3 = 'cell-rank-bottom') : (title3 = 'cell-rank');
              (index % 2 === 0) ? (cellColor = 'cell-color-gray') : (cellColor = 'cell-color-black');                                          
              return (
                <Table.Row >
                    <Table.Cell className={`${title3} ${cellColor}`}>
                    {index +  1}
                  </Table.Cell>
                <Table.Cell className={`${title} ${cellColor}`}>
                  <Header as='h4' image>
                    <Image src={set.picture} rounded size='mini' />
                    <Header.Content className="cell-player-header">
                        {set.name}
                      {/* <Header.Subheader>Cool Player</Header.Subheader> */}
                    </Header.Content>
                  </Header>
                </Table.Cell>
                <Table.Cell className={`${title2} ${cellColor}`}>
                    {set.score}
                </Table.Cell>
              </Table.Row>);
            })
            };
            </Table.Body>
          </Table>
        );
    }
}

export default HighScores;