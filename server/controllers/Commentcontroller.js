const Post = require('../models/post');
const User = require('../models/User'); 
const mongoose = require('mongoose');

// const GenrateCommentId = () => {
//   return Math.floor(Math.random() * 1000000);
// };


exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { comment } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Use real Mongo ObjectId
    const newComment = {
      _id: new mongoose.Types.ObjectId(),
      userId: req.user._id,
      comment,
      createdAt: new Date(),
    };

    // 1. Add comment to Post model
    post.Comments.push(newComment);
    await post.save();

    // 2. Add comment to User model (user who owns the image)
    const user = await User.findById(post.userid);
    if (user && Array.isArray(user.images)) {
      const image = user.images.find((img) => img.public_id === post.public_id);
      if (image) {
        image.Comments.push(newComment);
        await user.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Comment added successfully to post and user image",
      comments: post.Comments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};



exports.deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const cleanCommentId = commentId.replace(/:/g, "").trim();

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Find the comment
    const comment = post.Comments.find((c) =>
      c._id.equals(new mongoose.Types.ObjectId(cleanCommentId))
    );

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check authorization
    if (!comment.userId.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    }

    // Remove from Post.comments
    post.Comments = post.Comments.filter((c) => !c._id.equals(comment._id));
    await post.save();

    // Also remove from User.images.Comments
    const user = await User.findById(post.userid);
    if (user) {
      const image = user.images.find((img) => img.public_id === post.public_id);
      if (image) {
        image.Comments = image.Comments.filter(
          (c) => !c._id.equals(comment._id)
        );
        await user.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Comment deleted from post and user image",
      comments: post.Comments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};




exports.editComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { comment: updatedComment } = req.body;

    const cleanCommentId = commentId.replace(/:/g, "").trim();

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Find the comment from post
    const comment = post.Comments.find((c) =>
      c._id.equals(new mongoose.Types.ObjectId(cleanCommentId))
    );

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user is owner
    if (!comment.userId.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this comment" });
    }

    // Time restriction
    const now = new Date();
    const diffInMinutes = (now - new Date(comment.createdAt)) / (1000 * 60);
    if (diffInMinutes > 15) {
      return res
        .status(403)
        .json({ message: "Edit time expired (15 minutes)" });
    }

    // Update comment
    comment.comment = updatedComment;
    await post.save();

    // Update in User model too
    const user = await User.findById(post.userid);
    if (user) {
      const image = user.images.find((img) => img.public_id === post.public_id);
      if (image) {
        const imgComment = image.Comments.find((c) =>
          c._id.equals(comment._id)
        );
        if (imgComment) {
          console.log("Updating comment in user image");
          imgComment.comment = updatedComment;
          await user.save();
        }
      }
    }

    res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      comments: post.Comments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.getAllComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId).populate(
      "Comments.userId",
      "name profilePicture _id"
    ); 

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({
      success: true,
      totalComments: post.Comments.length,
      comments: post.Comments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

