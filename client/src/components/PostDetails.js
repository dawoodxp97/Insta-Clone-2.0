import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStateValue } from "../context/StateProvider";
import "./styles/PostDetails.css";
import { HiHeart } from "react-icons/hi";
import { HiOutlineHeart } from "react-icons/hi";
import { RiChat1Line } from "react-icons/ri";
import { BiShareAlt } from "react-icons/bi";
import Comments from "./Comments";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";

toast.configure();

function PostDetails() {
  const [{ allPosts }, dispatch] = useStateValue();
  const { postID } = useParams();
  const [post, setPost] = useState();
  const [msg, setMsg] = useState("");
  const [load, setLoad] = useState(false);

  useEffect(() => {
    setPost(allPosts.filter((item) => item?._id === postID)[0]);
  }, [allPosts, postID]);

  const successNotify = (text) => {
    toast.success(text, { autoClose: 1500 });
  };
  const errorNotify = (text) => {
    toast.error(text, { autoClose: 1500 });
  };

  const handleLike = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(`/api/post/${post?._id}`, {}, config);
      dispatch({
        type: "SET_LIKES",
        _id: post?._id,
        likes: data,
      });
    } catch (error) {
      errorNotify("Something went wrong, unable to like the Post");
    }
  };
  const handleUnlike = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.put(`/api/post/${post?._id}`, {}, config);
      dispatch({
        type: "SET_LIKES",
        id: post?._id,
        likes: data,
      });
    } catch (error) {
      errorNotify("Something went wrong, unable to unlike the Post");
    }
  };

  const createComment = async () => {
    setLoad(true);
    if (msg !== "") {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        };
        const { data } = await axios.post(
          `/api/post/${post?._id}/${"cID"}`,
          {
            text: msg,
          },
          config
        );
        dispatch({
          type: "SET_COMMENTS",
          _id: post?._id,
          comments: data.comments,
        });
        setLoad(false);
        if (data) {
          setMsg("");
        }
      } catch (error) {
        errorNotify("Something went wrong, unable to Comment the Post");
        setLoad(false);
      }
    }
  };

  return (
    <div className="ind_post">
      <div className="ind_post_body">
        <div className="ind_post_body1">
          <div className="post_header">
            <div className="post_header_child1">
              <img src={post?.postedBy?.pic} alt="" />
            </div>
            <div className="post_header_child2">
              <h5>
                {" "}
                <Link
                  style={{
                    textDecoration: "none",
                    color: "var(--text-primary)",
                  }}
                  to={
                    JSON.parse(localStorage.getItem("user"))?._id ===
                    post?.postedBy?._id
                      ? `/profile`
                      : `/userprofile/${post?.postedBy?._id}`
                  }
                >
                  {" "}
                  {post?.postedBy?.name}{" "}
                </Link>
              </h5>
              <span>@{post?.postedBy?.userName}</span>
            </div>
          </div>
        </div>
        <div className="ind_post_body2">
          <div className="post_body">
            <p>{post?.message}</p>
            <img src={post?.photo} alt="" />
          </div>
        </div>
        <div className="ind_post_body3">
          <div className="post_footer">
            <div className="post_footer_like">
              {post?.likes.includes(
                JSON.parse(localStorage.getItem("user"))?._id
              ) ? (
                <HiHeart onClick={handleUnlike} className="like_icon" />
              ) : (
                <HiOutlineHeart onClick={handleLike} className="unlike_icon" />
              )}

              <span>{`${post?.likes.length} Likes`}</span>
            </div>
            <div className="post_footer_comment">
              <RiChat1Line />
              <span>{`${post?.comments.length} Comments`}</span>
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
            {/* <div className="post_footer_saved"></div> */}
          </div>
        </div>
        <div className="ind_post_body4">
          {load ? (
            <div style={{ marginLeft: "5rem" }}>
              <ClipLoader color="#fe5656" loading={load} size={15} />
            </div>
          ) : (
            <div className="comment_input">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  createComment();
                }}
              >
                <input
                  type="text"
                  value={msg}
                  placeholder="Write your Comment here"
                  required
                  onChange={(e) => {
                    setMsg(e.target.value);
                  }}
                />
              </form>
            </div>
          )}

          {post?.comments.length === 0 ? (
            ""
          ) : (
            <div className="comment_div">
              <Comments comments={post?.comments} postId={post?._id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostDetails;
