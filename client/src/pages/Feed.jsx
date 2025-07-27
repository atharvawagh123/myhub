import React, { useEffect, useState } from "react";
import { fetchPosts, getFollowingPosts } from "../api/post";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Post from "../component/Post";

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const data = await fetchPosts();
        setPosts(data.posts); // Make sure this returns an array
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    getPosts();
  }, []);

  // Fetch posts from users that the current user is following
  const getpostsOfFollowing = async () => {
    try {
      const data = await getFollowingPosts();
      console.log(data);
      setPosts(data.posts); // Make sure this returns an array
    } catch (error) {
      console.error("Error fetching following posts:", error);
    }
  }


  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-gray-50">
      

      {/* Feed Section (Middle) */}
      <main className="flex-1 max-w-2xl mx-auto px-4 py-6 w-full ">
        {/* Filter Dropdown */}
        <div className="flex justify-center mb-6 ">
          <select
            name="posts"
            className="px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:ring focus:ring-blue-300 w-full max-w-xs"
            onChange={(e) => {
              const value = e.target.value;
              if (value === "all") {
                fetchPosts().then((data) => setPosts(data.posts));
              } else if (value === "following") {
                getpostsOfFollowing();
              }
            }}
          >
            <option value="all">All Posts</option>
            <option value="following">Following Posts</option>
          </select>
        </div>

  
        <div className="flex flex-col gap-6 h-[500px] w-[500px] overflow-y-auto overflow-hidden">
          {Array.isArray(posts) && posts.length > 0 ? (
            posts.map((post) => (
              <div key={post._id} className="bg-white p-4 rounded-lg shadow-md">
                <Post
                  _id={post._id}
                  email={post.email}
                  caption={post.caption}
                  location={post.location}
                  url={post.url}
                  public_id={post.public_id}
                  likes={post.likes}
                  userid={post.userid}
                />
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-10">
              No posts found.
            </div>
          )}
        </div>
      </main>

      {/* Right Section (Suggestions) */}
      <aside className="hidden xl:block w-[320px] p-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">Suggested for you</h2>
          <ul className="space-y-4">
            {["user_1", "user_2", "user_3"].map((user, idx) => (
              <li key={idx} className="flex justify-between items-center">
                <span className="text-sm text-gray-700 font-medium">
                  {user}
                </span>
                <button className="text-blue-500 text-sm font-medium">
                  Follow
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Feed;
