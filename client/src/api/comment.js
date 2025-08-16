import authAxios from "../axoisconfig/axios";

export const getcomments = async (postid) => {
  try {
    const response = await authAxios.get(
      `/api/comment/posts/${postid}/comments`
    );
    
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

export const addcomment = async (postid, comment) => {
  try {
    const response = await authAxios.post(
      `/api/comment/posts/${postid}/comments`,
      { comment }
    );
    console.log("Added comment:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
}

export const deletecomment = async (postid,commentid) => {
    try {
        const response = await authAxios.delete(
            `/api/comment/posts/${postid}/comments/${commentid}`
        );
    
        return response.data;
    } catch (error) {
        console.error("Error deleting comment:", error);
        throw error;
    }
}

export const editcomment = async (postid, commentid, comment) => {
    try {
        const response = await authAxios.put(
        `/api/comment/posts/${postid}/comments/${commentid}`,
        { comment }
        );
        return response.data;
    } catch (error) {
        console.error("Error editing comment:", error);
        throw error;
    }
    }
