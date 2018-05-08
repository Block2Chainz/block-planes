const getSession = (req, res) => {
  res.status(200).send({ id: req.session.userId });
};

const logout = (req, res) => {
  req.session = null;
  res.status(200).send();
};

module.exports.getSession = getSession;
module.exports.logout = logout;