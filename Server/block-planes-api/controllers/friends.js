const db = require('../db');
const Promise = require('bluebird');


const checkIfFriends = (req, res) => {
  db.query('SELECT * FROM friends WHERE id_one = ? AND id_two = ? OR id_one = ? AND id_two = ?', [req.query.user, req.query.friend, req.query.friend, req.query.user], (err, data) => {
    if (err) {
      console.log(err);
    } else {
      if (!data.length) {
        res.send({
          exists: false,
          pending: '',
          requestBy: ''
        });
      } else {
        res.send({
          exists: true,
          pending: data[0].pending,
          requestBy: data[0].request_by
        });
      }
    }
  });
}

const addFriend = (req, res) => {
  db.query(`INSERT INTO friends (id_one, id_two, pending, request_by) 
                VALUES (?, ?, ?, ?) `, [req.body.userId, req.body.friendId, 1, req.body.userId], (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.send(data);
      }
    });
}

const fetchFriends = (req, res) => {
  const queryId = req.query.id;
  db.query('SELECT * FROM friends WHERE id_one = (?) AND pending = ? OR id_two = (?) AND pending = ?', [queryId, 0, queryId, 0], (err, data) => {
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
                  index: i,
                  blockchainAddress: friend.blockchainAddress,
                };
              }));
          }
        });
      }
    }
  })
}

const fetchFriendByUsername = (req, res) => {
  db.query('SELECT * FROM users WHERE username = ?', [req.query.username], (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send({
        id: data[0].id,
        title: data[0].username,
        image: data[0].profile_picture,
        fullName: '',
        totalPoints: data[0].total_points,
        createdAt: data[0].created_at,
        blockchainAddress: data[0].blockchainAddress,
      });
    }
  });
}

const deleteFriend = (req, res) => {
  db.query('DELETE FROM friends WHERE id_one = ? AND id_two = ? OR id_one = ? AND id_two = ?', [req.query.user, req.query.friend, req.query.friend, req.query.user], (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send(data);
    }
  });
}


const fetchRequests = (req, res) => {
  const queryId = req.query.id;
  db.query('SELECT friends.id, request_by, request_created_at, users.username, users.profile_picture FROM friends ' +
  'INNER JOIN users ON users.id = friends.request_by ' +
  'WHERE id_one = (?) AND pending = ? AND request_by <> ? OR id_two = (?) AND pending = ? AND request_by <> ?', [queryId, 1, queryId, queryId, 1, queryId], (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send(
        data.map((request) => {
          return {
            id: request.id,
            friendId: request.request_by,
            sentAt: request.request_created_at,
            profilePicture: request.profile_picture,
            username: request.username,
          };
        }));
    }
  })
}

const acceptRequest = (req, res) => {
  db.query(`UPDATE friends SET pending = ? WHERE id = ? `, [0, req.body.friendsTableId], (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.send(data);
      }
    });
}

const declineRequest = (req, res) => {
  db.query('DELETE FROM friends WHERE id = ? ', [req.body.friendsTableId], (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send(data);
    }
  });
}

module.exports.checkIfFriends = checkIfFriends;
module.exports.addFriend = addFriend;
module.exports.fetchFriends = fetchFriends;
module.exports.fetchFriendByUsername = fetchFriendByUsername;
module.exports.deleteFriend = deleteFriend;
module.exports.fetchRequests = fetchRequests;
module.exports.acceptRequest = acceptRequest;
module.exports.declineRequest = declineRequest;