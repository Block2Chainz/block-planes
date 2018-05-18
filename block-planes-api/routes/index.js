const router = require('express').Router();
const account = require('../controllers/account');
const webtoken = require('../controllers/webtoken');
const upload = require('../controllers/upload');
const search = require('../controllers/search');
const friends = require('../controllers/friends');
const messages = require('../controllers/messages');

const leaderboard = require('../controllers/leaderboard');

router.post('/newAccount', account.createAccount);
router.get('/signIn/:username/:password/:blockchainAddress', account.signIn);
router.get('/updateToken', account.updateToken);
router.get('/signInToken', account.signInToken);

router.post('/upload', upload.saveProfilePicture);
router.get('/leaderboardHi', leaderboard.getHiScore);
router.get('/leaderboardTotal', leaderboard.getTotal);

router.get('/search', search.fetchUsers);
router.get('/friendsCheck', friends.checkIfFriends);
router.post('/friendsAdd', friends.addFriend);
router.get('/friendsFetch', friends.fetchFriends);
router.get('/friendsFetchByUsername', friends.fetchFriendByUsername);
router.get('/friendsDelete', friends.deleteFriend);
router.get('/friendsFetchRequests', friends.fetchRequests);
router.post('/friendsAccept', friends.acceptRequest);
router.post('/friendsDecline', friends.declineRequest);

router.get('/messages', messages.fetchMessages);
router.post('/messages', messages.saveMessage);



module.exports = router;