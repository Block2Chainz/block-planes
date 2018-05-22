const db = require('../db');
const redis = require('redis');
const client = redis.createClient();
const Promise = require ('bluebird');
const CronJob = require ('cron').CronJob;

client.on('connect', function() {
  console.log('connected to redis client at leaderboard');
});

const pullData = new CronJob ( '10 * * * * *', function() {
    queryDb();
  },
  null,
  true,
  'America/Los_Angeles'
);

const queryDb = () => {
  db.query('SELECT username, id, profile_picture FROM users', (err, data) => {
    for (let i = 0; i < data.length; i++) {
      client.zadd('leaderboardHi', data[i].id, data[i].username + '___' + data[i].profile_picture);
      client.zadd('leaderboardTotal', data[i].id, data[i].username + '___' + data[i].profile_picture);
    }
  });
};

const getHiScore = (req, res) => {
  client.zrevrange('leaderboardHi', 0, 9, 'withscores', function(error, scores){
    let highScores = [];
    while (scores.length) {
      let tup = scores.splice(0,2);
      highScores.push({name: tup[0].split('___')[0], picture: tup[0].split('___')[1], score: tup[1]});
    }
    res.send(highScores);
  });
};

const getTotal = (req, res) => {
  client.zrevrange('leaderboardTotal', 0, 9, 'withscores', function(error, scores){
    let topScores = [];
    while (scores.length) {
      let tup = scores.splice(0,2);
      topScores.push({name: tup[0].split('___')[0], picture: tup[0].split('___')[1], score: tup[1]});
    }
    res.send(topScores);
  });
};

module.exports.getHiScore = getHiScore;
module.exports.getTotal = getTotal;