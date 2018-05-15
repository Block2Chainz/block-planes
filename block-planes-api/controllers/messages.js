const db = require('../db');
const Promise = require('bluebird');


const fetchMessages = (req, res) => {
  const queryId = req.query.id;
  db.query('SELECT messages.id, message_text, messages.created_at, messages.id_sender, users.username, users.profile_picture FROM messages ' +
    'INNER JOIN users ON users.id = messages.id_sender ' +
    'WHERE id_sender = (?) AND id_sendee = (?) OR id_sender = (?) AND id_sendee = (?) ', [queryId, req.query.friendId, req.query.friendId, queryId], (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.send(data.map(message => {
          if (message.id_sender + '' === queryId + '') {
            return {
              message: message.message_text,
              delay: 0,
              avatar: message.profile_picture,
              username: message.username,
              alignment: 'right',
              createdAt: message.created_at
            };
          } else {
            return {
              message: message.message_text,
              delay: 0,
              avatar: message.profile_picture,
              username: message.username,
              alignment: 'left',
              createdAt: message.created_at
            };
          }
        })
        )
      }
    })
}

const saveMessage = function (req, res) {
  const message = req.body;
  db.query('INSERT INTO messages (message_text, id_sender, id_sendee) VALUES (?, ?, ?)',
    [message.messageText, message.userId, message.friendId],
    function (err, data) {
      if (err) {
        res.send(err);
      } else {
        res.send(data);
      }
    });
};

module.exports.fetchMessages = fetchMessages;
module.exports.saveMessage = saveMessage;