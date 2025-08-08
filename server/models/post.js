const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // 👈 user se relation ban gaya
  },
  email: String,
  caption: String,
  location: String,
  url: String,
  public_id: String,
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  Comments: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now,
        required: true,
      },
    },
  ],
});
module.exports = mongoose.model("Post", postSchema);
