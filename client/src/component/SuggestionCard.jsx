import { followuser} from "../api/user";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const SuggestionCard = ({ profilePicture, name, email ,userid}) => {

    const [currentuserfollow, setcurrentuserfollow] = useState(false);

    const isfollow = async (userid) => {
        try {
            const response = await followuser(userid);
            if (response) {
                setcurrentuserfollow(true);
                toast.success(response.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    

  return (
    <div className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-all p-3 rounded-md shadow-sm">
      {/* User info */}
      <div className="flex items-center gap-3">
        <img
          src={profilePicture || "/image.png"}
          alt={name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <a className="text-sm font-medium text-gray-800">
            <Link to={`/user/${userid}`}>{name}</Link>
          </a>
          <p className="text-xs text-gray-500">{email}</p>
        </div>
      </div>

      {/* Follow Button */}
      {currentuserfollow ? (
        <button
          onClick={() => {
            isfollow(userid);
          }}
          className="bg-blue-500 text-white px-4 py-1 rounded-full text-xs font-medium hover:bg-blue-600 transition"
        >
          Following
        </button>
      ) : (
        <button
          onClick={() => {
            isfollow(userid);
          }}
          className="bg-blue-500 text-white px-4 py-1 rounded-full text-xs font-medium hover:bg-blue-600 transition"
        >
          Follow
        </button>
      )}
    </div>
  );
};

export default SuggestionCard;
