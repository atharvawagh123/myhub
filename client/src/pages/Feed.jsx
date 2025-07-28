import  { useEffect, useState } from "react";
import { fetchPosts, getFollowingPosts } from "../api/post";
import { getSuggestions } from "../api/user";
import Post from "../component/Post";
import SuggestionCard from "../component/SuggestionCard";
import Link from "react-router-dom"
import { useAuth } from "../api/Authcontext";

const Feed = () => {
  const { user, forgotPassword } = useAuth();
  const [posts, setPosts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    getPosts();
    getSuggestion();
  }, []);

   const getPosts = async () => {
     try {
       const data = await fetchPosts();
       setPosts(data.posts); // Make sure this returns an array
     } catch (error) {
       console.error("Error fetching posts:", error);
     }
  };
  
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

  const getSuggestion = async () => {
    try { 
      const data = await getSuggestions();
      setSuggestions(data.suggestions); // Make sure this returns an array
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  }


 

  return (
    <div className="w-full flex gap-5">
      {/* Left Swiper Section */}
      <div className="w-full max-w-4xl px-4 md:w-1/2 mx-auto flex flex-col items-center justify-center">
        <select
          name=""
          id=""
          className="mb-6 px-4 py-2 rounded-md border border-gray-300 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          defaultValue="all"
          onChange={(e) => {
            if (e.target.value === "all") {
              getPosts();
            }
            if (e.target.value === "following") {
              getpostsOfFollowing();
            }
          }}
        >
          <option value="all">All Posts</option>
          <option value="following">Posts from Following</option>
        </select>

        <div className="w-full h-[500px] overflow-y-auto ">
          {Array.isArray(posts) &&
            posts.map((post) => (
              <Post
                key={post._id}
                _id={post._id}
                email={post.email}
                caption={post.caption}
                location={post.location}
                url={post.url}
                public_id={post.public_id}
                likes={post.likes}
                userid={post.userid}
              />
            ))}
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden md:block w-full max-w-md mx-auto bg-white rounded-lg shadow-md">
        {/* Suggestion Container */}
        <div className="w-full h-[500px] overflow-y-auto flex flex-col gap-4 p-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            Suggestions for you
          </h2>

          {Array.isArray(suggestions) && suggestions.length > 0 ? (
            suggestions.map((user) => (
              <SuggestionCard
                key={user._id}
                profilePicture={user.profilePicture}
                name={user.name}
                email={user.email}
                userid={user._id}
              />
            ))
          ) : (
            <p className="text-gray-500 text-sm">No suggestions available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;
