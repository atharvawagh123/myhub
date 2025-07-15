import { useEffect, useState } from "react";
import { likepost, unlikepost, fetchlikes } from "../api/post";
import { getuser, followuser, unfollowuser, isfollowing } from "../api/user";
import { toast } from "react-toastify";
import { useAuth } from "../api/Authcontext";

const Post = ({ _id, caption, location, url, public_id, userid }) => {
  const { user, token } = useAuth();
  const [liked, setLiked] = useState(0);
  const [currentuserliked, setcurrentuserliked] = useState(false);
  const [currentuserfollow, setcurrentuserfollow] = useState(false);
  const [postowner, setpostowner] = useState({
    profile: "",
    name: "",
    _id: "",
    followers: [],
    following: [],
  });
  //you can also user backend to fetch likes
  useEffect(() => {
    fetchdata();
    getpostowner();
    isfollow();
  }, []);

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
    const response = await unlikepost(public_id);
    if (response.success) {
      toast.success(response.message);
      fetchdata();
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className="flex flex-col items-start justify-start p-4 border rounded-2xl shadow-md m-4 bg-white max-w-md w-full">
      <div className="flex items-center justify-between gap-20 mb-2">
        {/* Left: Profile image and user info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
            <img
              src={postowner.profile || "/image.png"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <strong className="text-blue-800 text-sm font-medium">
              {postowner.name}
            </strong>
            <p className="text-gray-600 text-xs">{location}</p>
          </div>
        </div>

        {currentuserfollow ? (
          <button
            onClick={unfollowhandle} // ✅ Correct
            className="text-xs px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Unfollow
          </button>
        ) : (
          <button
            onClick={followhandle} // ✅ Correct
            className="text-xs px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Follow
          </button>
        )}
      </div>

      {/* Image */}
      <div className="w-full h-[200px] overflow-hidden rounded-lg mb-3">
        <img
          src={url}
          alt={caption}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Caption */}
      <p className="text-gray-700 text-base mb-4">{caption}</p>

      {/* Like Section */}
      <div className="w-full flex items-center justify-between border-t pt-3">
        <p className="text-sm text-gray-600">Likes: {liked}</p>
        {currentuserliked ? (
          <button
            onClick={handleunlike}
            className="text-green-600 hover:text-green-800 transition font-semibold"
          >
            ❤️ Liked
          </button>
        ) : (
          <button
            onClick={handlelike}
            className="text-red-600 hover:text-red-800 transition font-semibold"
          >
            🤍 Like
          </button>
        )}
      </div>
    </div>
  );
};

export default Post;
