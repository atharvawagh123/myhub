import authAxios from "../axoisconfig/axios";

// fetch all posts
export const fetchPosts = async () => {
  try {
    const response = await authAxios.get("/api/auth/posts");
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

//fetch likes
export const fetchlikes = async (postId) => {
  try {
    const response = await authAxios.get(`/api/auth/postlike/${postId}`);
    return response.data.likes;
  } catch (error) {
    console.error("Error fetching likes:", error);
    throw error;
  }
};

//like a post
export const likepost = async (postId) => {
  try {
    const response = await authAxios.post("/api/auth/like", { postId });
    return { message: "Post liked successfully", success: true };
  } catch (error) {
    if (error.response.status === 400) {
      return { message: "Post already liked", success: false };
    }
    console.error("Error liking post:", error);
    throw error;
  }
};

//unlike the post
export const unlikepost = async (postId) => {
  try {
    const response = await authAxios.post("/api/auth/unlike", { postId });
    return { message: "post unliked successfully", success: true };
  } catch (error) {
    if (error.response.status === 404) {
      return { message: "frontend issue", success: false };
    }
    throw error;
  }
};

//post image
export const postImage = async (data) => {
  try {
    const response = await authAxios.post("/api/auth/postImage", data);
    return response.data;
  } catch (error) {
    console.error("Error posting image:", error);
    throw error;
  }
};

//delete post
export const deletepost = async (public_id) => {
  try {
    const response = await authAxios.delete("/api/auth/deletepost", {
      data: { public_id },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

//fetch post according to userid
export const fetchpostofuser = async (id) => {
  try {
    const response = await authAxios.get(`/api/post/fetchpostofuser/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching post of user:", error);
    throw error;
  }
};

//get posts of users that current user is following
export const getFollowingPosts = async () => {
  try {
    const response = await authAxios.get("/api/post/followingposts");
    return response.data;
  } catch (error) {
    console.error("Error fetching following posts:", error);
    throw error;
  }
};