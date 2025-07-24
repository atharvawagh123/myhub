import React, { useEffect, useState } from "react";
import { likepost, unlikepost, fetchlikes, } from "../api/post";
import { useAuth } from "../api/Authcontext";
import { followuser, unfollowuser, isfollowing } from "../api/user";
import { toast } from "react-toastify";

const Usercard = ({ user, posts }) => {
  const { user: currentUser } = useAuth();
  const [selectedImg, setSelectedImg] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [isfollow, setisfollow] = useState(null);

  useEffect(() => {
    const checkIsFollowing = async () => {
      try {
        const response = await isfollowing(user._id);
        setisfollow(response.isFollowing); // always set, true or false
      } catch (error) {
        console.log(error);
      }
    };

    if (user?._id) {
      checkIsFollowing();
    }
  }, [user._id]); 

  const fetchlike = async (id) => {
    try {
      const response = await fetchlikes(id);
      setLikeCount(response.length);
      setUserLiked(response.includes(currentUser.id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async (id) => {
    // Optimistic UI: increase count & set liked = true right away
    setLikeCount((prev) => prev + 1);
    setUserLiked(true);

    try {
      const response = await likepost(id);
      // (Optional) In case backend fails, revert:
      if (!response.success) {
        setLikeCount((prev) => prev - 1);
        setUserLiked(false);
        // Optionally show error
      } else {
        fetchlike(id); // If you want to sync with backend always
        console.log(response.message);
      }
    } catch (error) {
      setLikeCount((prev) => prev - 1);
      setUserLiked(false);
      console.error("Error liking post:", error);
    }
  };

  const handleunLike = async (id) => {
    // Instant UI feedback: decrease count, set liked = false
    setLikeCount((prev) => Math.max(0, prev - 1));
    setUserLiked(false);

    try {
      const response = await unlikepost(id);
      if (!response.success) {
        setLikeCount((prev) => prev + 1);
        setUserLiked(true);
      } else {
        fetchlike(id); // For strict sync
        console.log(response.message);
      }
    } catch (error) {
      setLikeCount((prev) => prev + 1);
      setUserLiked(true);
      console.error("Error unliking post:", error);
    }
  };

  const handlefollow = async () => {
    try {
      const response = await followuser(user._id);
      if (response) {
        toast.success(response.message);
      }
      console.log(response);
       setisfollow(true);
     } catch (error) {
      console.log(error);
    }
  } 
    const handleunfollow = async () => {
      try {
        const response = await unfollowuser(user._id);
        if (response) {
          toast.success(response.message);
        }
        console.log(response);
        setisfollow(false);
      } catch (error) {
        console.log(error);
      }
    }; 

  const checkfollow = async (params) => {};
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-4 sm:p-6 md:p-8">
      {/* Profile header */}
      <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 mb-6 sm:mb-8">
        <img
          src={user.profilePicture}
          alt={user.name}
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border"
        />
        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
            <h2 className="text-xl sm:text-2xl font-bold">{user.name}</h2>
            {/* Follow Button */}
            {isfollow !== null &&
              (isfollow ? (
                <button
                  onClick={() => {
                    handleunfollow();
                  }}
                  className="px-5 py-2 bg-blue-700 text-white font-semibold rounded-full hover:bg-blue-800 transition duration-200"
                >
                  Unfollow
                </button>
              ) : (
                <button
                  onClick={() => {
                    handlefollow();
                  }}
                  className="px-5 py-2 bg-blue-700 text-white font-semibold rounded-full hover:bg-blue-800 transition duration-200"
                >
                  Follow
                </button>
              ))}
          </div>
          <p className="text-gray-500 mb-2 break-words">{user.bio}</p>
          <div className="flex gap-4 text-gray-700 mb-2 text-sm sm:text-base">
            <span>
              <strong>{user.images?.length || 0}</strong> posts
            </span>
            <span>
              <strong>{user.followers?.length || 0}</strong> followers
            </span>
            <span>
              <strong>{user.following?.length || 0}</strong> following
            </span>
          </div>
          <div className="text-xs sm:text-sm text-gray-400">{user.email}</div>
        </div>
      </div>

      {/* Image grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {posts.posts.map((img, idx) => (
          <img
            src={img.url}
            alt={img.caption}
            key={idx}
            onClick={() => {
              setSelectedImg(img);
              fetchlike(img._id);
            }}
            className="w-full aspect-square object-cover rounded-lg"
          />
        ))}
      </div>

      {selectedImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <div className="bg-white rounded-xl overflow-hidden max-w-md w-full relative shadow-lg animate-fadein">
            <button
              onClick={() => setSelectedImg(null)}
              className="absolute top-2 right-2 bg-gray-800 text-white rounded-full px-3 py-1 text-sm hover:bg-gray-600 transition"
            >
              Close
            </button>
            <img
              src={selectedImg.url}
              alt={selectedImg.caption}
              className="w-full max-h-[400px] object-contain"
            />
            <div className="p-4">
              <div className="flex items-center gap-4 mb-2">
                <span className="font-semibold text-gray-700">
                  Likes: {likeCount}
                </span>
                {userLiked ? (
                  <button
                    onClick={() => handleunLike(selectedImg.public_id)}
                    className="px-4 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full hover:bg-blue-600 transition"
                  >
                    Unlike
                  </button>
                ) : (
                  <button
                    onClick={() => handleLike(selectedImg.public_id)}
                    className="px-4 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full hover:bg-blue-600 transition"
                  >
                    Like
                  </button>
                )}
              </div>
              <p className="font-semibold">{selectedImg.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usercard;
