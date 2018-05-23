const db = require('../db');
const Promise = require('bluebird');


const fetchHighScore = (req, res) => {
  db.query('SELECT * FROM users WHERE id = ?', [req.query.id], (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send(data[0]);
    }
  });
}

const addScoreToTotal = (req, res) => {
  console.log('add score to total begins', req.body.id, req.body.score);
  db.query('SELECT * FROM users WHERE id = ?', [req.body.id], (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log('got dat data', data);
      const newTotalScore = Number(data[0].total_points) + Number(req.body.score);
      console.log('newTotalScore is', newTotalScore, data[0].total_points, req.body.score);
      if (data[0].high_score < req.body.score) {
        console.log('updating total and high', String(newTotalScore), String(req.body.score), req.body.id);
        db.query(`UPDATE users SET total_points = ?, high_score = ? WHERE id = ? `, [String(newTotalScore), String(req.body.score), req.body.id], (err, newData) => {
          if (err) {
            res.send(err);
          } else {
            console.log('updated total and high');
            res.send(newData);
          }
        });
      } else {
        console.log('updating total');
        db.query(`UPDATE users SET total_points = ? WHERE id = ? `, [String(newTotalScore), req.body.id], (err, newData) => {
          if (err) {
            res.send(err);
          } else {
            console.log('updated total');
            res.send(newData);
          }
        });
      }
    }
  });
}


module.exports.fetchHighScore = fetchHighScore;
module.exports.addScoreToTotal = addScoreToTotal;