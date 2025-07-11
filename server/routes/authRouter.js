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
    assignRoomId
} = require('../controllers/authcontroller');
const auth = require('../middleware/auth');
const { upload } = require('../config/cloudinary');


// Register route
router.post('/register', register);

// getuser
router.post('/getuser', getUser);
// Login route
router.post('/login', login);
// Follow routes
router.post('/follow/:id', auth, followUser);
router.post('/unfollow/:id', auth, unfollowUser);
// Logout route
router.post('/logout', auth, logout);
// Image routes
router.post('/postImage', auth, upload.single('photo'), postImage);
router.post('/setProfilePhoto', auth, upload.single('photo'), setprofile);

// like the post 
router.post('/like',auth, likepost);

//fetch user
router.get('/postlike/:id', fetchpostlike);

//fetch all posts
router.get('/posts', fetchallpost);

//delete User post 
router.delete('/deletepost',auth, deletePost);

//updateuser
router.post('/updateuser', auth , upload.single('photo') , updateUser);

// user  ko input ke baad search karne ke liye
router.post('/search', searchUser);

// Room fo chatting 
router.post('/room',assignRoomId)

module.exports = router;
