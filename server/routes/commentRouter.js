const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const commentController = require("../controllers/Commentcontroller");

// Add a comment to a post
// Add a comment
router.post("/posts/:postId/comments",
    auth,
     commentController.addComment);

// Edit a comment
router.put(
  "/posts/:postId/comments/:commentId",
  auth,
  commentController.editComment
);

// Delete a comment
router.delete(
  "/posts/:postId/comments/:commentId",
  auth,
  commentController.deleteComment
);

// Get all comments
router.get("/posts/:postId/comments", commentController.getAllComments);

module.exports = router;