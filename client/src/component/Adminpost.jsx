import React, { useState, useEffect } from "react";
import { deletepost } from "../api/post";
import { toast } from "react-toastify";
import { useAuth } from "../api/Authcontext";
import { likepost, unlikepost, fetchlikes } from "../api/post";

function Adminpost({ post, postdeleted ,checklike}) {
  const { user, token } = useAuth();
  const [open, setOpen] = useState(false);
  const [currentuserliked, setcurrentuserliked] = useState(false);
  const [liked, setLiked] = useState(0);

  useEffect(() => {
    fetchinglike();
  }, []);

  const handleDelete = async () => {
    try {
      const res = await deletepost(post.public_id);
      if (res) {
        toast.success(res.message);
        postdeleted();
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const fetchinglike = () => {
    const lenght = post.likes.length;
    setLiked(lenght);
    if (post.likes.includes(user.id)) {
      setcurrentuserliked(true);
    }
  };

  //like a post
  const handlelike = async () => {
    console.log(post.public_id);
    if (token) {
      const response = await likepost(post.public_id);
      if (response.success) {
        toast.success(response.message);
        // fetchdata();
        fetchinglike();
        checklike();
      } else {
        toast.error(response.message);
      }
    } else {
      toast.error("Please login to like");
    }
  };

  //unlike a post
  const handleunlike = async () => {
    const response = await unlikepost(post.public_id);
    if (response.success) {
      toast.success(response.message);
      // fetchdata();
      fetchinglike();
      checklike();
    } else {
      toast.error(response.message);
    }
  };

  return (
    <>
      <div
        onClick={() => {
          setOpen(true);
        }}
        className="cursor-pointer w-full max-w-[300px] h-[150px] sm:h-[180px] md:h-[200px] lg:h-[220px] bg-white shadow rounded overflow-hidden transition-transform duration-300 hover:scale-105 mx-auto"
      >
        <img
          src={post.url}
          alt={post.caption}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white rounded-lg overflow-hidden max-w-md w-full">
            <img
              src={post.url}
              alt={post.caption}
              className="w-full h-72 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">{post.caption}</h2>
              <div className="flex justify-between mt-4">
                <p className="text-gray-600">Likes: {liked}</p>
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
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Adminpost;
