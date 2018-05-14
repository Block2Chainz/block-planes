const db = require('../db');
const redis = require('redis');
const client = redis.createClient();
const Promise = require ('bluebird');

client.on('connect', function() {
  console.log('connected to redis client at leaderboard');
});


const getHiScore = (req, res) => {
  
  db.query('SELECT username, id, profile_picture FROM users', (err, data) => {
    for (let i = 0; i < data.length; i++) {
      // console.log('id: ', data[i].id, 'username: ', data[i].username);
      client.zadd('leaderboardHi', data[i].id, data[i].username + '___' + data[i].profile_picture);
    }
    // console.log('data from db: ', data)
    
    client.zrevrange('leaderboardHi', 0, 9, 'withscores', function(error, scores){
      console.log('scores: ', scores);
      let highScores = [];
      while (scores.length) {
        let tup = scores.splice(0,2);
        // console.log('tup: ', tup, 'scores: ', scores)
        highScores.push({name: tup[0].split('___')[0], picture: tup[0].split('___')[1], score: tup[1]});
        console.log('highScores array: ', highScores);
      }

      res.send(highScores);
    });
  });
};

const getTotal = (req, res) => {
  db.query('SELECT username, id, profile_picture FROM users', (err, data) => {
    for (let i = 0; i < data.length; i++) {
      client.zadd('leaderboardTotal', data[i].id, data[i].username + '___' + data[i].profile_picture);
    }
    
    client.zrevrange('leaderboardTotal', 0, 9, 'withscores', function(error, scores){
      let topScores = [];
      while (scores.length) {
        let tup = scores.splice(0,2);
        topScores.push({name: tup[0].split('___')[0], picture: tup[0].split('___')[1], score: tup[1]});
        console.log('topScores array: ', topScores);
      }

      res.send(topScores);
    });
  });
};

module.exports.getHiScore = getHiScore;
module.exports.getTotal = getTotal;