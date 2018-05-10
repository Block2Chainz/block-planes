const router = require('express').Router();
const account = require('../controllers/account');
const webtoken = require('../controllers/webtoken');
const upload = require('../controllers/upload');

router.post('/newAccount', account.createAccount);
router.get('/signIn/:username/:password', account.signIn);
router.get('/updateToken', account.updateToken);
router.get('/signInToken', account.signInToken);

router.post('/upload', upload.saveProfilePicture);

module.exports = router;