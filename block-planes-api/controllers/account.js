const db = require('../db');
const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));

const createAccount = (req, res) => {
  console.log('made it to create account', req.body);
  db.query('SELECT `username` FROM `users` WHERE `username` = ?', [req.body.newUsername], (err, data) => {
    if (err) {
      res.send(err);
    } else {
      if (!data.length) {
        db.query(`INSERT INTO users (full_name, username, password, profile_picture, total_points) 
                VALUES (?, ?, ?, ?, ?) `, [req.body.fullName, req.body.newUsername, req.body.newPassword, req.body.profilePicture, 0], (err, data) => {
            if (err) {
              res.send(err);
            } else {
              req.session.userId = data.insertId;
              res.send({ id: data.insertId });
            }
          });
      } else {
        res.send('exists');
      }
    }
  });
};

const signIn = (req, res) => {
  db.query('SELECT * FROM users WHERE username = ?', [req.params.username], (err, data) => {
    if (data.length) {
      bcrypt.compareAsync(req.params.password, data[0].password)
        .then(response => {

          if (response) {
            req.session.userId = data[0].id;
            res.status(200).send({ id: data[0].id });
          } else {
            res.send('wrong');
          }
        })
        .catch(err => {
          res.status(404).send('Request failed');
        });
    } else {
      res.send('wrong');
    }
  });
}

module.exports.createAccount = createAccount;
module.exports.signIn = signIn;