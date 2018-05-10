const db = require('../db');

const saveProfilePicture = function (req, res) {
  const picture = req.body;
  console.log('picture', picture);
  db.query('UPDATE users SET profile_picture = ? WHERE id = ?',
    [picture.url, picture.userId],
    function (err, data) {
      if (err) {
        res.send(err);
      } else {
        res.send(data);
      }
    });
};

exports.saveProfilePicture = saveProfilePicture;