import React, { useEffect, useState } from "react";
import { fetchPosts } from "../api/post";
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
        console.log(data.posts[0])
        setPosts(data.posts); // Make sure this returns an array
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    getPosts();
  }, []);

  return (
    <div className="w-full flex gap-5">
      {/* Left Swiper Section */}
      <div className="w-1/2 max-w-4xl mx-auto h-full">
        <Swiper
          pagination={{ clickable: true }}
          spaceBetween={30}
          slidesPerView={2}
          
        >
          {Array.isArray(posts) &&
            posts.map((post) => (
              <SwiperSlide key={post._id}>
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
              </SwiperSlide>
            ))}
        </Swiper>
      </div>

      {/* Right Section */}
      <div className="w-1/2 max-w-4xl mx-auto bg-red-600">
        <div className="w-full bg-slate-400 h-full"></div>
      </div>
    </div>
  );
};

export default Feed;
