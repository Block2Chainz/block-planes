const db = require('../db');
const Promise = require('bluebird');


const checkIfFriends = (req, res) => {
  console.log('checking req from check if friends', req.query);
  db.query('SELECT * FROM friends WHERE id_one = ? AND id_two = ?', [req.query.user, req.query.friend], (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log('data from check if friends', data);
      if (!data.length) {
        res.send('not friends');
      } else {
        res.send('friends');
      }
    }
  });
}

const addFriend = (req, res) => {
  db.query(`INSERT INTO friends (id_one, id_two) 
                VALUES (?, ?) `, [req.body.userId, req.body.friendId], (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.send(data);
      }
    });
}


module.exports.checkIfFriends = checkIfFriends;
module.exports.addFriend = addFriend;