const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  followUser,
  unfollowUser,
  postImage,
  setprofile,
  likepost,
  fetchallpost,
  getUser,
  fetchpostlike,
  updateUser,
  searchUser,
  deletePost,
  assignRoomId,
  unlikepost,
  isFollowing,
  getUserInfo,
  getSuggestions,
  forgotPassword,
  resetPassword,
} = require("../controllers/authcontroller");
const auth = require('../middleware/auth');
const { upload } = require('../config/cloudinary');


// Register route
router.post('/register', register);

// getuser
router.get('/getuser/:id', auth, getUser);

//get info of admin user
router.get("/getadmin", auth, getUserInfo);



// Login route
router.post('/login', login);
// Follow routes
router.post('/follow', auth, followUser);
//is following
router.get('/isfollowing/:id', auth, isFollowing);

router.delete('/unfollow/:id', auth, unfollowUser);
// Logout route
router.post('/logout', auth, logout);
// Image routes
router.post('/postImage', auth, upload.single('photo'), postImage);
router.post('/setProfilePhoto', auth, upload.single('photo'), setprofile);

// like the post 
router.post('/like', auth, likepost);

// unlike the post
router.post("/unlike", auth, unlikepost);

//fetch user
router.get('/postlike/:id', fetchpostlike);

//fetch all posts
router.get('/posts', fetchallpost);

//delete User post 
router.delete('/deletepost',auth, deletePost);

//updateuser
router.put('/updateuser', auth , upload.single('photo') , updateUser);

// user  ko input ke baad search karne ke liye
router.get('/search', searchUser);

// Room fo chatting 
router.post('/room', assignRoomId)

// get suggestions
router.get('/suggestions', auth, getSuggestions);

// Get user info
router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

module.exports = router;
