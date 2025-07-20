import React, { useState } from "react";
import { searchuser } from "../api/user";
import Searchresult from "../component/Searchresult";

const Search = () => {
  const [users, setUsers] = useState([]);
  const [search, setsearch] = useState("");
  const [loading, setLoading] = useState(false);

  const getuser = async () => {
    setLoading(true);
    const response = await searchuser(search);
    setUsers(response.users || []);
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="flex items-center bg-[#f0f0f0] p-3 rounded-full mb-6 shadow">
        <input
          type="text"
          className="flex-1 bg-transparent outline-none px-3"
          value={search}
          onChange={(e) => setsearch(e.target.value)}
          placeholder="Search for a user..."
        />
        <button
          onClick={getuser}
          className="bg-blue-500 text-white px-4 py-1 rounded-full font-semibold"
        >
          Search
        </button>
      </div>
      {loading && <div className="text-center">Searching...</div>}

      <div className="bg-white rounded-xl shadow">
        {users.length === 0 && !loading && (
          <div className="p-8 text-center text-gray-400">
            No users found yet
          </div>
        )}
        {users.map((user) => (
         <Searchresult key={user._id} _id={user._id} profilePicture={user.profilePicture} name={user.name} email={user.email} />
        ))}
      </div>
    </div>
  );
};

export default Search;
