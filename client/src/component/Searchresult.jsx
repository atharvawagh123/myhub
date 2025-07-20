import React from 'react'

const Searchresult = ({ _id, profilePicture ,name,email}) => {
    return (
      <>
        <div
          key={_id}
          className="flex items-center gap-4 px-5 py-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 transition-all"
        >
          <img
            src={profilePicture}
            alt={name}
            className="w-12 h-12 rounded-full object-cover border"
          />
          <div>
            <div className="font-semibold text-gray-900">{name}</div>
            <div className="text-sm text-gray-500">{email}</div>
          </div>
        </div>
      </>
    );
};

export default Searchresult