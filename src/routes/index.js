const router = require('express').Router();

const upload = require('../utils/multer');

const { auth } = require('../middlewares/auth');
const {
  login,
  register,
  getAllUsers,
  getOneUser,
  editUser,
  deleteUser,
  editUserWithPhoto,
  checkAuth,
} = require('../controllers/users');
const {
  addFollow,
  unFollow,
  getFollowing,
  getFollowers,
  getFollowingById,
  getFollowersById,
  isFollow,
} = require('../controllers/following');
const {
  postFeed,
  getFeeds,
  getAllFeeds,
  getFeedsByFollowing,
  deleteFeeds,
  getAllFeedsExceptMe,
} = require('../controllers/posts');
const {
  likePost,
  getUserWhoLikesPost,
  unLike,
  isLike,
} = require('../controllers/likes');
const {
  addComments,
  getComments,
  deleteComments,
} = require('../controllers/comments');
const {
  sendMessage,
  getMessagesFromConv,
  getUserConv,
} = require('../controllers/chats');

// users
router.post('/register', register);
router.post('/login', login);
router.get('/users', getAllUsers);
router.get('/user/:id', getOneUser);
router.get('/check-auth', auth, checkAuth);
router.delete('/user:id', deleteUser);
router.patch('/user', auth, editUser);
router.patch('/user-img', auth, upload.single('media'), editUserWithPhoto);

// follow
router.post('/follow/:id', auth, addFollow);
router.delete('/follow/:id', auth, unFollow);
router.get('/following', auth, getFollowing);
router.get('/followers', auth, getFollowers);
router.get('/following/:id', getFollowingById);
router.get('/followers/:id', getFollowersById);
router.get('/is-follow/:id', auth, isFollow);

// posts
router.post('/feed', auth, upload.single('media'), postFeed);
router.get('/feeds/:id', auth, getFeeds);
router.get('/feeds', auth, getAllFeeds);
router.get('/feeds-except-me', auth, getAllFeedsExceptMe);
router.get('/feeds-by-foll', auth, getFeedsByFollowing);
router.delete('/feed/:id', deleteFeeds);
// likes
router.post('/like/:id', auth, likePost);
router.delete('/like/:id', auth, unLike);
router.get('/like/:id', getUserWhoLikesPost);
router.get('/is-like/:id', auth, isLike);

// comments
router.post('/comment/:id', auth, addComments);
router.get('/comment/:id', getComments);
router.delete('/comment/:id', deleteComments);

// chats
router.post('/chat/:id', auth, sendMessage);
router.get('/inbox/:id', getMessagesFromConv);
router.get('/inboxs', auth, getUserConv);
module.exports = router;
