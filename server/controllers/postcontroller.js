const Post = require("../models/post");
const User = require("../models/User");

//get post according userid
 const fetchpostofuser = async (req, res) => {
    try {
        const {id} = req.params;
        const posts = await Post.find({ userid: id });
        console.log("tHis is post",posts);
        res.status(200).json({posts});
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

const getFollowingPosts = async (req, res) => {
  try {
    // 1️⃣ Get current user (who is logged in)
    const currentUser = await User.findById(req.user._id);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2️⃣ Get the list of users that current user is following
    const followingUsers = currentUser.following;

    // 3️⃣ Fetch posts where 'postedBy' is in the following list
    const posts = await Post.find({ userid: { $in: followingUsers } })
      .sort({ createdAt: -1 }) // optional: sort latest first
      .populate(" userid", "username profilePic") // optional: get details of the poster
      .exec();

    // 4️⃣ Return the posts
    res.status(200).json({ posts, success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {fetchpostofuser, getFollowingPosts};