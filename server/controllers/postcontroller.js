const Post = require("../models/post");

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

module.exports = {fetchpostofuser};