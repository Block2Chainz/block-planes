const db = require('../db');
const Promise = require('bluebird');

module.exports.postScores = (req, res) => {
    db.query('SELECT * FROM users WHERE id = (?)', [req.body.user], (err, data) => {
        if (err) {
            console.log(err);
        } else {
            let total = parseInt(data[0].total_points) + parseInt(req.body.score);
            let high = data[0].high_score > req.body.score ? data[0].high_score : req.body.score;
            db.query('UPDATE users SET total_points = ?, high_score = ? WHERE id = ?', [total, high, req.body.user], (err, data) => {
                if (err) console.log(err)
                else {
                    res.json(data.total_points);
                }
            })
        }
    });
}