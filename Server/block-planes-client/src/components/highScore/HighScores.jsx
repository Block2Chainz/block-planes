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
        topScores: []
      };
    }

    componentWillMount() {
      this.getHighScores();
      this.getTopScores();
    }

    getHighScores() {
      axios
      .get(`/leaderboardhi`)
      .then(response => {
        this.setState({highScores : response.data});
      })
      .catch(err => {
        console.log('Error from get high scores', err);
      });
    }

    getTopScores() {
      axios
      .get(`/leaderboardTotal`)
      .then(response => {
        this.setState({topScores : response.data});
      })
      .catch(err => {
        console.log('Error from get top scores', err);
      });
    }

    render() {
        let title = null;
        let title2 = null;
        let title3 = null;
        let cellColor = null;
        let title4 = null;
        let title5 = null;
        let title6 = null;
        return (
          <div>
            <div>
              <p className="page-title">LEADERBOARD</p>
            </div>
            <div className="half-width">
              <div className="table-title">
                <p>Top High Score</p>
              </div>
              <div className="center">
              <Table basic='very' celled collapsing className="hi-leaderboard">
                <Table.Header>
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
                      <Table.Row key={index}>
                          <Table.Cell className={`${title3} ${cellColor}`}>
                          {index + 1}
                        </Table.Cell>
                      <Table.Cell className={`${title} ${cellColor}`}>
                        <Header as='h4' image>
                          <Image src={set.picture} rounded size='mini'/>
                          <Header.Content className="cell-player-header">
                            {set.name}
                          </Header.Content>
                        </Header>
                      </Table.Cell>
                      <Table.Cell className={`${title2} ${cellColor}`}>
                        {set.score}
                      </Table.Cell>
                    </Table.Row>);
                    })
                  }
                  </Table.Body>
                </Table>
                </div>
              </div>

              <div className='half-width'>
                <div className="table-title">
                  <p>Top Total Score</p>
                </div>
                <div className="center">
                  <Table basic='very' celled collapsing className="hi-leaderboard">
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell className="table-header">Rank</Table.HeaderCell>
                        <Table.HeaderCell className="table-header">Player</Table.HeaderCell>
                        <Table.HeaderCell className="table-header">Top Score</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {this.state.topScores.map((set, index) => {
                        (index === (this.state.topScores.length - 1)) ? (title4 = 'cell-player-bottom') : (title4 = 'cell-player');
                        (index === (this.state.topScores.length - 1)) ? (title5 = 'cell-score-bottom') : (title5 = 'cell-score');
                        (index === (this.state.topScores.length - 1)) ? (title6 = 'cell-rank-bottom') : (title6 = 'cell-rank');
                        (index % 2 === 0) ? (cellColor = 'cell-color-gray') : (cellColor = 'cell-color-black');
                        return (
                          <Table.Row key={index}>
                            <Table.Cell className={`${title6} ${cellColor}`}>
                              {index + 1}
                            </Table.Cell>
                            <Table.Cell className={`${title4} ${cellColor}`}>
                              <Header as='h4' image>
                                <Image src={set.picture} rounded size='mini'/>
                                <Header.Content className="cell-player-header">
                                  {set.name}
                                </Header.Content>
                              </Header>
                            </Table.Cell>
                            <Table.Cell className={`${title5} ${cellColor}`}>
                              {set.score}
                            </Table.Cell>
                          </Table.Row>);
                      })
                      }
                      </Table.Body>
                    </Table>
                  </div>
                </div>
            </div>
          );
      }
}

export default HighScores;