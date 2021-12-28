import React from "react";
import "./styles/Feed.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Post from "./Post";
import ClipLoader from "react-spinners/ClipLoader";
import { useStateValue } from "../context/StateProvider";

toast.configure();

function Feed() {
  const [{ allPosts }] = useStateValue();

  return (
    <div className="feed_content">
      {/* <div className="stories"></div> */}
      <div className="posts">
        <h4>Feed</h4>
        {allPosts.length === 0 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              height: "55vh",
              width: "100%",
              color: "#161d25",
            }}
          >
            <ClipLoader color="#161d25" loading={true} size={30} />
            <p>Loading</p>
          </div>
        ) : (
          allPosts.map((item) => <Post key={item._id} post={item} />)
        )}
      </div>
    </div>
  );
}

export default Feed;
