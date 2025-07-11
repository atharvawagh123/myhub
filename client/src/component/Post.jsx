
import { useEffect, useState } from "react";

const Post = ({_id, email, caption, location, url, public_id, likes }) => {

  const [liked, setLiked] = useState(0);

  //you can also user backend to fetch likes
  // useEffect(() => {
  //   const fetchlike = async () => {
  //     const response = await fetchlikes(_id);
  //     setLiked(response.length);
  //   }
  //   fetchlike();
  // }, [])

  useEffect(() => {
        const likelenght =  likes.length;
        setLiked(likelenght);  
  }, [])
  
  

  return (
    <div className="flex flex-col items-center justify-center p-4 border rounded-lg shadow-md m-2">
      <div className="">
        <strong>{email}</strong>
        <p>{location}</p>
      </div>
      <div className="w-[300px] h-[300px] flex items-center justify-center">
        <img
          src={url}
          alt={caption}
          className="w-full h-auto rounded-lg mb-2"
        />
      </div>
      <p className="text-gray-700">{caption}</p>
      <div
        className="flex flex-col items-center justify-center p-4 border rounded-lg shadow-md
      m-2"
      >
        {/* <p className="text-gray-700">Likes: {liked}</p> */}
        <a className="text-red-600 rounded-e-sm" onClick={() => setLiked(liked + 1)}>
          {liked} like
        </a>
      </div>
    </div>
  );
}

export default Post