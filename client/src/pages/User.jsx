import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getuserinfo } from "../api/user";
import { fetchpostofuser } from "../api/post";
import Usercard from "../component/Usercard";

const User = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [posts, setposts] = useState([]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const getinfo = async () => {
      try {
        const response = await getuserinfo(id);
        setUser(response);
      } catch (err) {
        setError("Error fetching user info.");
      } finally {
        setLoading(false);
      }
    };
    getinfo();
    getpost();
  }, [id]);

  const getpost=async () => {
    try {
      const response = await fetchpostofuser(id);
      console.log(response);
      setposts(response);
    }catch (error) {
      console.log(error); 
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>User not found.</div>;

  return <Usercard user={user} posts={posts} />;
};

export default User;
