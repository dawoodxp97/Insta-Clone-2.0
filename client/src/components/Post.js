import React, { useEffect, useState } from "react";
import "./styles/Post.css";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { BiShareAlt } from "react-icons/bi";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { HiHeart, HiOutlineHeart } from "react-icons/hi";
import { RiChat1Line } from "react-icons/ri";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useStateValue } from "../context/StateProvider";
import { Link } from "react-router-dom";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

toast.configure();

function Post({ post }) {
  const [{ userDetails }, dispatch] = useStateValue();
  const [likes, setLikes] = useState(post?.likes);
  const [favorites, setFavorites] = useState(userDetails?.favorites);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setFavorites(userDetails?.favorites);
  }, [userDetails?.favorites]);
  const successNotify = (text) => {
    toast.success(text, { autoClose: 1500 });
  };
  const errorNotify = (text) => {
    toast.error(text, { autoClose: 1500 });
  };
  const likePost = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(`/api/post/${post?._id}`, {}, config);
      setLikes((likes) => {
        return (likes = data);
      });
      dispatch({
        type: "SET_LIKES",
        id: post?._id,
        likes: data,
      });
    } catch (error) {
      errorNotify("Something went wrong, unable to like the Post");
    }
  };
  const unLikePost = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.put(`/api/post/${post?._id}`, {}, config);
      setLikes((likes) => {
        return (likes = data);
      });
      dispatch({
        type: "SET_LIKES",
        id: post?._id,
        likes: data,
      });
    } catch (error) {
      errorNotify("Something went wrong, unable to like the Post");
    }
  };
  const addToFav = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        `/api/post/fav/${post?._id}`,
        {},
        config
      );
      setFavorites((favorites) => {
        return (favorites = data);
      });
      setLoading(false);
      dispatch({
        type: "SET_FAVS",
        favs: data,
      });
    } catch (error) {
      errorNotify("Something went wrong, unable to like the Post");
      setLoading(false);
    }
  };

  const deleteFav = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.put(
        `/api/post/fav/${post?._id}`,
        {},
        config
      );
      setFavorites((favorites) => {
        return (favorites = data);
      });
      setLoading(false);
      dispatch({
        type: "SET_FAVS",
        favs: data,
      });
    } catch (error) {
      errorNotify("Something went wrong, unable to like the Post");
      setLoading(false);
    }
  };
  return (
    <div key={post?._id} className="post">
      <div className="post_header">
        <div className="post_header_child1">
          <img src={post?.postedBy.pic} alt="" />
        </div>
        <div className="post_header_child2">
          <h5>
            <Link
              style={{
                textDecoration: "none",
                color: "var(--text-primary)",
              }}
              to={
                JSON.parse(localStorage.getItem("user"))?._id ===
                post?.postedBy._id
                  ? `/profile`
                  : `/userprofile/${post?.postedBy?._id}`
              }
            >
              {post?.postedBy.name}
            </Link>
          </h5>
          <span>@{post?.postedBy.userName}</span>
        </div>
      </div>
      <Link
        style={{
          textDecoration: "none",
          color: "#121212",
        }}
        to={`/postDetails/${post?._id}`}
      >
        <div className="post_body">
          <p>{post?.message}</p>
          <img src={post?.photo} alt="" />
        </div>
      </Link>
      <div className="post_footer">
        <div className="post_footer_like">
          {likes.includes(JSON.parse(localStorage.getItem("user"))?._id) ? (
            <HiHeart onClick={unLikePost} className="like_icon" />
          ) : (
            <HiOutlineHeart onClick={likePost} className="unlike_icon" />
          )}
          <span>{`${likes.length} Likes`}</span>
        </div>
        <div className="post_footer_comment">
          <RiChat1Line />
          <Link
            style={{
              textDecoration: "none",
              color: "var(--text-primary)",
            }}
            to={`/postDetails/${post?._id}`}
          >
            <span>{`${post?.comments.length} Comments`}</span>
          </Link>
        </div>
        <div className="post_footer_share">
          <BiShareAlt />
          <CopyToClipboard
            text={`https://ins-skd.herokuapp.com/postDetails/${post?._id}`}
            onCopy={() => {
              successNotify("Link Copied to Clipboard");
            }}
          >
            <span style={{ cursor: "pointer" }}>Share</span>
          </CopyToClipboard>
        </div>
        {favorites?.some(function (elem) {
          return elem._id === post?._id;
        }) ? (
          <div className="post_footer_saved">
            <BsBookmarkFill />
            {loading ? (
              <span>
                <ClipLoader color="#161d25" loading={loading} size={10} />
              </span>
            ) : (
              <span onClick={deleteFav} style={{ cursor: "pointer" }}>
                Saved
              </span>
            )}
          </div>
        ) : (
          <div className="post_footer_saved">
            <BsBookmark />
            {loading ? (
              <span>
                <ClipLoader color="#161d25" loading={loading} size={10} />
              </span>
            ) : (
              <span onClick={addToFav} style={{ cursor: "pointer" }}>
                Save
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Post;
