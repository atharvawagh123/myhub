import authAxios from "../axoisconfig/axios";

//user detail
export const getuser = async (id)=>{
    try {
        const response = await authAxios.get(`/api/auth/getuser/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return {message:"error while fetching",success:false}
    }
}

//get info of admin
export const getadmin = async () => {
  try {
    const response = await authAxios.get("/api/auth/getadmin");
    return response.data;
  } catch (error) {
    console.log(error);
    return { message: "error while fetching", success: false };
  }
}
//follow account
export const followuser = async (id) => {
  try {
    const response = await authAxios.post("/api/auth/follow", { id });
    return response.data;
  } catch (error) {
    console.error(
      "Follow failed:",
      error.response?.data?.message || error.message
    );
    return {
      success: false,
      message: error.response?.data?.message || "Unknown error",
    };
  }
};
  

//unfollow account
export const unfollowuser = async (id) => {
    try {
        const response = await authAxios.delete(`/api/auth/unfollow/${id}`);
        return response.data
    }
    catch (error) {
        console.log(error);
    }
}

//is following
export const isfollowing = async (id) => {
    try {
        const response = await authAxios.get(`/api/auth/isfollowing/${id}`);
        return response.data
    }
    catch (error) {
        console.log(error);
    }
}

//info of user login
export const getuserinfo = async (id) => {
  try {
    const response = await authAxios.get(`/api/auth/getuser/${id}`);
    return response.data
  }catch (error) {
    console.log(error);
  }
}

//update user 
export const updateuser = async (data) => {
  try {
    const response = await authAxios.put("/api/auth/updateuser",data);
    return response.data
  }catch (error) {
    console.log(error);
  }
}

