import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStateValue } from "../context/StateProvider";
import "./styles/Post.css";
import { HiHeart } from "react-icons/hi";
import { HiOutlineHeart } from "react-icons/hi";
import { RiChat1Line } from "react-icons/ri";
import { BiShareAlt } from "react-icons/bi";
import { BsBookmark } from "react-icons/bs";
import Comments from "./Comments";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ClipLoader from "react-spinners/ClipLoader";

toast.configure();

function Post() {
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
  const warnNotify = (text) => {
    toast.warn(text);
  };

  const handleLike = () => {
    fetch("/like", {
      method: "put",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("auth-token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: post?._id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        dispatch({
          type: "SET_RELOAD",
          reload: Math.floor(Math.random() * 100 + 1),
        });
      })
      .catch((err) => console.log(err));
  };
  const handleUnlike = () => {
    fetch("/unlike", {
      method: "put",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("auth-token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: post?._id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        dispatch({
          type: "SET_RELOAD",
          reload: Math.floor(Math.random() * 100 + 1),
        });
      })
      .catch((err) => console.log(err));
  };

  const createComment = () => {
    setLoad(true);
    if (msg !== "") {
      fetch("/comment", {
        method: "put",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("auth-token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: msg,
          postId: post?._id,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          //Comment Added
          dispatch({
            type: "SET_RELOAD",
            reload: Math.floor(Math.random() * 100 + 1),
          });
          setMsg("");
          setLoad(false);
          successNotify("Successfully Commented");
        })
        .catch((err) => {
          console.log(err);
          setLoad(false);
          warnNotify("Something went wrong");
        });
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
                      ? `/home/profile`
                      : `/home/userprofile/${post?.postedBy?._id}`
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
                text={`https://ins-skd.herokuapp.com/home/post/${post?._id}`}
                onCopy={() => {
                  successNotify("Link Copied to Clipboard");
                }}
              >
                <span style={{ cursor: "pointer" }}>Share</span>
              </CopyToClipboard>
            </div>
            <div className="post_footer_saved">
              <BsBookmark />
              <span style={{ cursor: "pointer" }}>Save</span>
            </div>
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

export default Post;
