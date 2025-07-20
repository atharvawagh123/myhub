import React from "react";

const Usercard = ({ user }) => {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-4 sm:p-6 md:p-8">
      {/* Profile header */}
      <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 mb-6 sm:mb-8">
        <img
          src={user.profilePicture}
          alt={user.name}
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border"
        />
        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
            <h2 className="text-xl sm:text-2xl font-bold">{user.name}</h2>
            {/* Follow Button */}
            <button className="ml-0 sm:ml-4 mt-2 sm:mt-0 px-5 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full hover:bg-blue-600 transition">
              Follow
            </button>
          </div>
          <p className="text-gray-500 mb-2 break-words">{user.bio}</p>
          <div className="flex gap-4 text-gray-700 mb-2 text-sm sm:text-base">
            <span>
              <strong>{user.images?.length || 0}</strong> posts
            </span>
            <span>
              <strong>{user.followers?.length || 0}</strong> followers
            </span>
            <span>
              <strong>{user.following?.length || 0}</strong> following
            </span>
          </div>
          <div className="text-xs sm:text-sm text-gray-400">{user.email}</div>
        </div>
      </div>
      {/* Image grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {(user.images || []).map((img, idx) => (
          <img
            key={idx}
            src={img.url || img}
            alt=""
            className="w-full aspect-square object-cover rounded-lg"
          />
        ))}
      </div>
    </div>
  );
};

export default Usercard;
