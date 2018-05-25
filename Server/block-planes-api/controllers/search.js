const db = require('../db');
const Promise = require('bluebird');

const fetchUsers = (req, res) => {
  db.query('SELECT * FROM users', (err, data) => {
    if (err) {
      console.log(err);
    } else {
        res.json(data.map(user => {
          return {
            id: user.id,
            title: user.username,
            createdAt: user.created_at,
            totalPoints: user.total_points,
            image: user.profile_picture,
            blockchainAddress: user.blockchainAddress,
          };
        })
      );
    }
  });
}

module.exports.fetchUsers = fetchUsers;