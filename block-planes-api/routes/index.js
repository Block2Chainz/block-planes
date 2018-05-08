const router = require('express').Router();
const account = require('../controllers/account');
const session = require('../controllers/session');
const user = require('../controllers/user');

router.get('/userSession', session.getSession);
router.get('/logout', session.logout);

router.post('/newAccount', account.createAccount);
router.get('/signIn/:username/:password', account.signIn);

router.get('/user', user.fetchUser);

module.exports = router;