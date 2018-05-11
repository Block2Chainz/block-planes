const router = require('express').Router();
const account = require('../controllers/account');
const webtoken = require('../controllers/webtoken');
const upload = require('../controllers/upload');
const search = require('../controllers/search');
const friends = require('../controllers/friends');



router.post('/newAccount', account.createAccount);
router.get('/signIn/:username/:password', account.signIn);
router.get('/updateToken', account.updateToken);
router.get('/signInToken', account.signInToken);

router.post('/upload', upload.saveProfilePicture);

router.get('/search', search.fetchUsers);
router.get('/friends', friends.checkIfFriends);
router.post('/friends', friends.addFriend);

module.exports = router;