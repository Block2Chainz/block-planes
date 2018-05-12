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
        const divStyle = {
            color: 'white',
        };
        return (
            <Table basic='very' celled collapsing>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell style={divStyle}>Player</Table.HeaderCell>
                <Table.HeaderCell style={divStyle}>High Score</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
        
            <Table.Body>
              <Table.Row>
                <Table.Cell>
                  <Header as='h4' image>
                    <Image src='/assets/images/avatar/small/lena.png' rounded size='mini' />
                    <Header.Content>
                        Lena
                      <Header.Subheader>Human Resources</Header.Subheader>
                    </Header.Content>
                  </Header>
                </Table.Cell>
                <Table.Cell>
                    22
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <Header as='h4' image>
                    <Image src='/assets/images/avatar/small/matthew.png' rounded size='mini' />
                    <Header.Content>
                        Matthew
                      <Header.Subheader>Fabric Design</Header.Subheader>
                    </Header.Content>
                  </Header>
                </Table.Cell>
                <Table.Cell>
                    15
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <Header as='h4' image>
                    <Image src='/assets/images/avatar/small/lindsay.png' rounded size='mini' />
                    <Header.Content>
                        Lindsay
                      <Header.Subheader>Entertainment</Header.Subheader>
                    </Header.Content>
                  </Header>
                </Table.Cell>
                <Table.Cell>
                    12
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <Header as='h4' image>
                    <Image src='/assets/images/avatar/small/mark.png' rounded size='mini' />
                    <Header.Content>
                        Mark
                      <Header.Subheader>Executive</Header.Subheader>
                    </Header.Content>
                  </Header>
                </Table.Cell>
                <Table.Cell>
                    11
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        );
    }
}

export default HighScores;