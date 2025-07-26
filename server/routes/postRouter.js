const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");


const postController = require("../controllers/postcontroller");


router.get("/fetchpostofuser/:id", postController.fetchpostofuser);

//get posts of users that current user is following
router.get("/followingposts",auth ,postController.getFollowingPosts);

module.exports = router;