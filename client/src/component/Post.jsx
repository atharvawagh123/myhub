import { useEffect, useState } from "react";
import { likepost, unlikepost, fetchlikes } from "../api/post";
import { getuser, followuser, unfollowuser, isfollowing } from "../api/user";
import { toast } from "react-toastify";
import { useAuth } from "../api/Authcontext";
import { getcomments , addcomment } from "../api/comment";

const Post = ({ _id, caption, location, url, public_id, userid }) => {
  const { user, token } = useAuth();
  const [liked, setLiked] = useState(0);
  const [currentuserliked, setcurrentuserliked] = useState(false);
  const [currentuserfollow, setcurrentuserfollow] = useState(false);
  const [comments, setComments] = useState([]);
  const [postowner, setpostowner] = useState({
    profile: "",
    name: "",
    _id: "",
    followers: [],
    following: [],
  });
  const [newComment, setNewComment] = useState("");


  //you can also user backend to fetch likes
  useEffect(() => {
    fetchdata();
    getpostowner();
    isfollow();
   fetchComments(_id);
  }, [currentuserfollow]);

  const isfollow = async () => {
    try {
      const response = await isfollowing(userid);
      if (response.isfollowing) {
        setcurrentuserfollow(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const followhandle = async () => {
    try {
      const response = await followuser(userid);
      if (response.success) {
        toast.success("Followed successfully");
        isfollow();
      }
    } catch (error) {
      toast.error(error);
      console.error(error);
    }
  };

  const unfollowhandle = async () => {
    try {
      const response = await unfollowuser(userid);
      if (response.success) {
        toast.success("Unfollowed successfully");
        isfollow();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getpostowner = async () => {
    try {
      const response = await getuser(userid);

      if (!response || !response._id || !Array.isArray(response.followers)) {
        console.warn("Invalid user data received", response);
        return;
      }

      setpostowner({
        profile: response.profilePicture,
        name: response.name,
        _id: response._id,
        followers: response.followers || [],
        following: response.following || [],
      });

      // check if current user is following the post owner
      setcurrentuserfollow(response.followers.includes(user.id));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchdata = async () => {
    const response = await fetchlikes(_id);
    setLiked(response.length);
    setcurrentuserliked(response.includes(user.id));
  };

  const handlelike = async () => {
     console.log("From the feed  ", public_id);
    if (token) {
      const response = await likepost(public_id);
      if (response.success) {
        toast.success(response.message);
        fetchdata();
      } else {
        toast.error(response.message);
      }
    } else {
      toast.error("Please login to like");
    }
  };

  const handleunlike = async () => {
    console.log("From the feed  ",public_id);
    const response = await unlikepost(public_id);
    if (response.success) {
      toast.success(response.message);
      fetchdata();
    } else {
      toast.error(response.message);
    }
  };

  const fetchComments = async (_id) => {
    if (!_id) {
      console.error("Post ID is required to fetch comments");
      return;
    }
    try {
      const response = await getcomments(_id);
     if(response.success && Array.isArray(response.comments)) {
        setComments(response.comments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);

    }
  }
  
  
const handleAddComment = async() => {
  if (newComment.trim() === "") return;

  try {
    const response = await addcomment(_id, newComment);
    if (response.success) {
      const {message} = response;
      toast.success(message);
      setComments((prevComments) => [
        ...prevComments,
        {
          user: user
            ? user.name || "Anonymous"
            : "Anonymous",
          comment: newComment,
          _id: response.commentId, // Assuming the response contains the new comment ID
        },
      ]);
      setNewComment("");
    }
   } catch (error) {
    console.error("Error adding comment:", error);
    
  }
 
  setNewComment("");
};

  return (
    <div className="flex flex-col p-4 sm:p-5 border rounded-2xl shadow-lg hover:shadow-xl transition-shadow bg-white max-w-full sm:max-w-md w-full">
      {/* Header: Profile + Follow/Unfollow */}
      <div className="flex items-center justify-between w-full mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gray-200 ring-2 ring-blue-100">
            <img
              src={postowner.profile || "/image.png"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <strong className="text-blue-800 text-sm sm:text-base font-semibold">
              {postowner.name}
            </strong>
            <p className="text-gray-500 text-xs sm:text-sm">{location}</p>
          </div>
        </div>

        {currentuserfollow ? (
          <button
            onClick={unfollowhandle}
            className="px-3 py-1 text-xs sm:text-sm rounded-full bg-red-500 text-white hover:bg-red-600 transition"
          >
            Unfollow
          </button>
        ) : (
          <button
            onClick={followhandle}
            className="px-3 py-1 text-xs sm:text-sm rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            Follow
          </button>
        )}
      </div>

      {/* Main Image */}
      <div className="w-full rounded-xl overflow-hidden mb-3 relative group">
        <img
          src={url}
          alt={caption}
          className="w-full h-48 sm:h-60 object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Caption */}
      <p className="text-gray-700 text-sm sm:text-base mb-3 leading-relaxed break-words">
        {caption}
      </p>

      {/* Likes */}
      <div className="border-t pt-3 mb-3 flex items-center justify-between">
        <p className="text-xs sm:text-sm text-gray-600">❤️ {liked} Likes</p>
        {currentuserliked ? (
          <button
            onClick={handleunlike}
            className="text-green-600 hover:text-green-800 transition font-semibold text-xs sm:text-sm"
          >
            Liked
          </button>
        ) : (
          <button
            onClick={handlelike}
            className="text-red-600 hover:text-red-800 transition font-semibold text-xs sm:text-sm"
          >
            Like
          </button>
        )}
      </div>

      {/* Comments Section */}
      <div className="bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto mb-2">
        <p className="text-gray-700 text-xs sm:text-sm font-medium mb-2">
          Comments:
        </p>

        {comments.length > 0 ? (
          <ul className="space-y-2">
            {comments.map((comment) => (
              <li
                key={comment._id}
                className="flex items-center justify-between text-xs sm:text-sm text-gray-600 border-b last:border-none pb-2"
              >
                {/* Left: user + comment */}
                <div className="flex-1 pr-2">
                  <span className="font-semibold text-blue-700">
                    {comment.user}
                  </span>
                  : {comment.comment}
                </div>

                {/* Right: actions */}
                <div className="flex gap-2">
                  <button
                    className="px-2 py-0.5 text-[11px] sm:text-xs rounded bg-red-100 text-red-600 hover:bg-red-200 transition"
                    // onClick={() => handleDelete(comment._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="px-2 py-0.5 text-[11px] sm:text-xs rounded bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                    // onClick={() => startEditing(comment)}
                  >
                    Edit
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs sm:text-sm text-gray-500">No comments yet</p>
        )}
      </div>

      {/* Add Comment Box */}
      <div className="flex items-center gap-2 mt-1">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 border rounded-full px-3 py-1 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleAddComment}
          className="px-3 py-1 text-xs sm:text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default Post;
