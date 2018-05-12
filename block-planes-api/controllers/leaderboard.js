const db = require('../db');
const redis = require('redis');
const client = redis.createClient();
const Promise = require ('bluebird');

client.on('connect', function() {
  console.log('connected to redis client at leaderboard');
});


const getHiScore = (req, res) => {
  
  db.query('SELECT username, id FROM users', (err, data) => {
    for (let i = 0; i < data.length; i++) {
      console.log('id: ', data[i].id, 'username: ', data[i].username);
      client.zadd('leaderboard', data[i].id, data[i].username);
    }
    // console.log('data from db: ', data)
    
    client.zrevrange('leaderboard', 0, 2, 'withscores', function(err, scores){
      console.log('scores: ', scores);
      let highScores = [];
      while (scores.length) {
        let tup = scores.splice(0,2)
        console.log('tup: ', tup, 'scores: ', scores)
        highScores.push({name: tup[0], score: tup[1]});
        console.log('highScores array: ', highScores)
      }
      
      res.send(highScores);
    });
  })

  // .then(function() {
  //   console.log('highScores array: ', highScores)
  // })
  
  // return highScores;
// console.log('flag1', highScores)
// res.send(highScores);
}

const getTotal = () => {

}

module.exports.getHiScore = getHiScore;
module.exports.getTotal = getTotal;