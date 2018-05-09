const router = require('express').Router();
const account = require('../controllers/account');
const webtoken = require('../controllers/webtoken');

router.post('/newAccount', account.createAccount);
router.get('/signIn/:username/:password', account.signIn);
router.get('/signInToken', account.signInToken);

module.exports = router;