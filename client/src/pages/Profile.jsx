import { useAuth } from "../api/Authcontext";
import { useEffect, useState, useRef } from "react";
import { getadmin, updateuser } from "../api/user";
import { postImage } from "../api/post";
import { toast } from "react-toastify";
import Adminpost from "../component/Adminpost";

const Profile = () => {
  const { user } = useAuth();
  const dialog = useRef();
  const dialog2 = useRef();
  // Fix: initialize as object to prevent null-pointer issues
  const [currentuser, setcurrentuser] = useState({});
  const [userdata, setuserdata] = useState({ name: "", bio: "" });
  const [profile, setprofile] = useState(null);
  const [posts, setposts] = useState(null);
  const [postinfo, setpostinfo] = useState({ caption: "", location: "" });

  useEffect(() => {
    getinfo();
  }, []);

  const postdelete = () => getinfo();
  const checkliked = () => getinfo();

  const getinfo = async () => {
    const response = await getadmin();
    setcurrentuser(response);
    // Always fill the latest user data
    setuserdata({ name: response?.name || "", bio: response?.bio || "" });
  };

  const update = async (e) => {
    e.preventDefault();
    if (!userdata.name || !userdata.bio) {
      toast.error("❌ Please fill in all fields");
      return;
    }
    const formData = new FormData();
    formData.append("name", userdata.name);
    formData.append("photo", profile);
    formData.append("bio", userdata.bio);
    const response = await updateuser(formData);
    if (response) {
      getinfo();
      toast.success(response.message);
      dialog.current.close();
    }
  };

  const postimage = async (e) => {
    e.preventDefault();
    if (!postinfo.caption || !postinfo.location) {
      toast.error("❌ Please fill in all fields");
      return;
    }
    const formData = new FormData();
    formData.append("caption", postinfo.caption);
    formData.append("location", postinfo.location);
    formData.append("photo", posts);
    const response = await postImage(formData);
    if (response.success) {
      getinfo();
      toast.success(response.message);
      dialog2.current.close();
      // Optional: reset form
      setpostinfo({ caption: "", location: "" });
      setposts(null);
    }
  };

  // Defensive: Prevent rendering before user is loaded
  if (!currentuser || !currentuser.name) return <div>Loading...</div>;

  return (
    <div>
      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 md:gap-10">
          <img
            src={currentuser.profilePicture}
            alt="Profile"
            className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full object-cover border-2 border-gray-300"
          />
          <div className="flex-1 w-full space-y-4 text-center sm:text-left">
            <div className="flex gap-4 justify-center sm:justify-start text-base font-medium text-gray-800">
              <div>
                <span className="font-semibold">
                  {currentuser.images?.length || 0}
                </span>{" "}
                posts
              </div>
              <div>
                <span className="font-semibold">
                  {currentuser.followers?.length || 0}
                </span>{" "}
                followers
              </div>
              <div>
                <span className="font-semibold">
                  {currentuser.following?.length || 0}
                </span>{" "}
                following
              </div>
            </div>
            <h2 className="text-xl md:text-2xl font-semibold break-words">
              {currentuser.name}
            </h2>
            <p className="text-gray-600">{currentuser.bio}</p>
            <span className="inline-block bg-gray-300 text-gray-800 text-xs px-2 py-1 rounded">
              {currentuser.role}
            </span>
            <div className="flex gap-3 mt-2 justify-center sm:justify-start">
              <button
                onClick={() => dialog.current.showModal()}
                className="bg-blue-600 text-white px-4 py-1 rounded-md text-sm hover:bg-blue-700 transition"
              >
                Edit Profile
              </button>
              <button
                onClick={() => dialog2.current.showModal()}
                className="bg-blue-600 text-white px-4 py-1 rounded-md text-sm hover:bg-blue-700 transition"
              >
                Post Image
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Gallery */}
      <div className="max-w-4xl mx-auto mt-5 px-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
          {currentuser?.images?.length > 0 &&
            currentuser.images.map((post) => (
              <Adminpost
                key={post._id}
                post={post}
                postdeleted={postdelete}
                checklike={checkliked}
              />
            ))}
        </div>
      </div>

      {/* Post Image Dialog */}
      <dialog
        ref={dialog2}
        className="rounded-xl max-w-md w-full p-6 shadow-lg border border-gray-300 backdrop:bg-black/50"
      >
        <form onSubmit={postimage} className="space-y-4">
          <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
            Create a Post
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Caption
            </label>
            <textarea
              name="caption"
              value={postinfo.caption || ""}
              onChange={(e) =>
                setpostinfo({ ...postinfo, caption: e.target.value })
              }
              rows="3"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              placeholder="What's on your mind?"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={postinfo.location || ""}
              onChange={(e) =>
                setpostinfo({ ...postinfo, location: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              placeholder="Add location"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setposts(e.target.files[0])}
              className="mt-1 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
          </div>
          <div className="text-center flex gap-2">
            <button
              type="submit"
              className="inline-block rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition duration-200"
            >
              Post
            </button>
            <button
              type="button"
              onClick={() => dialog2.current.close()}
              className="inline-block rounded-md bg-gray-400 px-4 py-2 text-white hover:bg-gray-500 transition duration-200"
            >
              Close
            </button>
          </div>
        </form>
      </dialog>

      {/* Update Profile Dialog */}
      <dialog
        ref={dialog}
        className="w-full max-w-md p-6 rounded-xl bg-white shadow-lg backdrop:backdrop-blur-md"
      >
        <form
          onSubmit={update}
          className="flex flex-col gap-4"
          encType="multipart/form-data"
        >
          <h2 className="text-2xl font-semibold text-gray-700">
            Update Profile
          </h2>
          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="mb-1 text-sm font-medium text-gray-600"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={userdata.name}
              onChange={(e) =>
                setuserdata({ ...userdata, name: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="profileimage"
              className="mb-1 text-sm font-medium text-gray-600"
            >
              Profile Image
            </label>
            <input
              type="file"
              id="profileimage"
              className="file-input file-input-bordered file-input-sm w-full max-w-xs"
              onChange={(e) => setprofile(e.target.files[0])}
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="bio"
              className="mb-1 text-sm font-medium text-gray-600"
            >
              Bio
            </label>
            <input
              type="text"
              id="bio"
              value={userdata.bio}
              onChange={(e) =>
                setuserdata({ ...userdata, bio: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your bio"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => dialog.current.close()}
              className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              Close
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
};

export default Profile;
