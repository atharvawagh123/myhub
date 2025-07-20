import React, { useState, useEffect, useRef } from "react";
import { deletepost, likepost, unlikepost } from "../api/post";
import { toast } from "react-toastify";
import { useAuth } from "../api/Authcontext";

/**
 * Instagram-style admin post modal with like/unlike/delete.
 */
function Adminpost({ post, postdeleted, checklike }) {
  const { user, token } = useAuth();
  const [open, setOpen] = useState(false);
  const [currentUserLiked, setCurrentUserLiked] = useState(false);
  const [liked, setLiked] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);
  const modalRef = useRef();

  // Setup likes info
  useEffect(() => {
    setLiked(post.likes.length);
    setCurrentUserLiked(post.likes.includes(user.id));
  }, [post, user]);

  // Handle open modal on ESC key
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Outside click to close modal
  useEffect(() => {
    if (!open) return;
    function onClick(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  // Delete post (with confirm)
  const handleDelete = async () => {
    const sure = window.confirm("Are you sure you want to delete this post?");
    if (!sure) return;
    try {
      const res = await deletepost(post.public_id);
      if (res) {
        toast.success(res.message);
        setOpen(false);
        postdeleted();
      }
    } catch (err) {
      toast.error("Error deleting post!");
    }
  };

  // Like
  const handleLike = async () => {
    if (!token) return toast.error("Please login to like");
    setLikeLoading(true);
    const response = await likepost(post.public_id);
    if (response.success) {
      setLiked(liked + 1);
      setCurrentUserLiked(true);
      checklike();
      toast.success("Post liked!");
    } else {
      toast.error(response.message);
    }
    setLikeLoading(false);
  };

  // Unlike
  const handleUnlike = async () => {
    setLikeLoading(true);
    const response = await unlikepost(post.public_id);
    if (response.success) {
      setLiked(Math.max(0, liked - 1));
      setCurrentUserLiked(false);
      checklike();
      toast.success("Like removed.");
    } else {
      toast.error(response.message);
    }
    setLikeLoading(false);
  };

 
  return (
    <>
      <div
        key={post._id}
        onClick={() => setOpen(true)}
        className="cursor-pointer hover:opacity-80 transition"
      >
        <img
          src={post.url}
          alt={post.caption}
          className="rounded-lg w-full aspect-square object-cover border"
        />
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 animate-fadein">
          <div
            className="bg-white rounded-xl shadow-xl max-w-sm sm:max-w-md w-[90vw] sm:w-[380px] overflow-hidden flex flex-col"
            ref={modalRef}
          >
            <img
              src={post.url}
              alt={post.caption}
              className="w-full h-60 sm:h-72 object-cover border-b"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-1 break-words">
                {post.caption}
              </h2>
              <div className="flex justify-between items-center my-2 text-gray-600 text-sm">
                <span>Likes: {liked}</span>
                <span className="text-xs text-gray-400">
                  {post.createdAt && new Date(post.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {currentUserLiked ? (
                  <button
                    onClick={handleUnlike}
                    disabled={likeLoading}
                    className={`px-4 py-1 rounded-full border flex items-center gap-1 text-pink-600 border-pink-300 bg-pink-50 hover:bg-pink-100 transition font-semibold ${
                      likeLoading && "opacity-60 pointer-events-none"
                    }`}
                  >
                    <span role="img" aria-label="Liked">
                      ❤️
                    </span>
                    Liked
                  </button>
                ) : (
                  <button
                    onClick={handleLike}
                    disabled={likeLoading}
                    className={`px-4 py-1 rounded-full border flex items-center gap-1 text-gray-700 border-gray-300 bg-gray-50 hover:bg-gray-100 transition font-semibold ${
                      likeLoading && "opacity-60 pointer-events-none"
                    }`}
                  >
                    <span role="img" aria-label="Like">
                      🤍
                    </span>
                    Like
                  </button>
                )}
                <button
                  onClick={handleDelete}
                  className="px-4 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 font-semibold transition"
                >
                  Delete
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-1 bg-gray-400 text-white rounded-full hover:bg-gray-500 font-semibold transition"
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
