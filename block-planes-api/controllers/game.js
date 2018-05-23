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
  db.query('SELECT * FROM users WHERE id = ?', [req.body.id], (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const newTotalScore = Number(data[0].total_points) + Number(req.body.score);
      if (data[0].high_score < req.body.score) {
        db.query(`UPDATE users SET total_points = ?, high_score = ? WHERE id = ? `, [String(newTotalScore), String(req.body.score), req.body.id], (err, newData) => {
          if (err) {
            res.send(err);
          } else {
            res.send(newData);
          }
        });
      } else {
        db.query(`UPDATE users SET total_points = ? WHERE id = ? `, [String(newTotalScore), req.body.id], (err, newData) => {
          if (err) {
            res.send(err);
          } else {
            res.send(newData);
          }
        });
      }
    }
  });
}


module.exports.fetchHighScore = fetchHighScore;
module.exports.addScoreToTotal = addScoreToTotal;