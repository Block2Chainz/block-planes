const db = require('../db');
const Promise = require('bluebird');


const checkIfFriends = (req, res) => {
  db.query('SELECT * FROM friends WHERE id_one = ? AND id_two = ?', [req.query.user, req.query.friend], (err, data) => {
    if (err) {
      console.log(err);
    } else {
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

const fetchFriends = (req, res) => {
  const queryId = req.query.id;
  db.query('SELECT * FROM friends WHERE id_one = (?) OR id_two = (?)', [queryId, queryId], (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const friends = data.map(user => {
        if (user.id_one + '' === queryId + '') {
          return user.id_two;
        } else {
          return user.id_one;
        }

      });
      if (!friends.length) {
        res.send([]);
      } else {
        db.query('SELECT * FROM users WHERE id IN ? ORDER BY username', [[friends]], (err, friendData) => {
          if (err) {
            console.log(err);
          } else {
            res.send(
              friendData.map((friend, i) => {
                return {
                  id: friend.id,
                  text: friend.username,
                  title: friend.username,
                  value: i,
                  image: friend.profile_picture,
                  totalPoints: friend.total_points,
                  createdAt: friend.created_at,
                  index: i
                };
              }));
          }
        });
      }
    }
  })
}

module.exports.checkIfFriends = checkIfFriends;
module.exports.addFriend = addFriend;
module.exports.fetchFriends = fetchFriends;