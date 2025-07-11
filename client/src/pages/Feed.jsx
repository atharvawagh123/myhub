// Feed.js
import React, { useEffect, useState } from "react";
import { fetchPosts } from "../api/post";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
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

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={30}
        slidesPerView={1}
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
              />
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default Feed;
