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
    console.log(postId);
  try {
      const response = await authAxios.get(`/api/auth/postlike/${postId}`); 
   
      return response.data.likes;
      
  } catch (error) {
    console.error("Error fetching likes:", error);
    throw error;
  }
};

//like a post

