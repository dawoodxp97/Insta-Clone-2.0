import React, { useEffect, useState } from "react";
import "./styles/Home.css";
import { MdHome } from "react-icons/md";
import { BsCollection } from "react-icons/bs";
import { BsBookmark } from "react-icons/bs";
import { FiSend } from "react-icons/fi";
import { BsDisplay } from "react-icons/bs";
import { HiHeart } from "react-icons/hi";
import { HiOutlineHeart } from "react-icons/hi";
import { RiSettings4Line } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi";
import { RiChat1Line } from "react-icons/ri";
import { BiShareAlt } from "react-icons/bi";
import { useHistory } from "react-router";
import { GrFormNext } from "react-icons/gr";
import { useStateValue } from "../context/StateProvider";
import Comments from "./Comments";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "./Modal";
import ClipLoader from "react-spinners/ClipLoader";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Profile from "./Profile";
import Usersprofile from "./Usersprofile";

toast.configure();

function Home() {
  const history = useHistory();
  const [{ token, user }, dispatch] = useStateValue();
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [shouldLoad, setShouldLoad] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [postId, setPostId] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      history.push("/");
    }
  });
  useEffect(() => {
    fetch("/allusers", {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result) {
          setUsers(
            result.data.filter(function (item) {
              return (
                item?._id !== user?._id && !item?.followers.includes(user?._id)
              );
            })
          );
        }
      });
  }, [token, user?._id, shouldLoad]);

  const followTrendingUsers = (userID) => {
    fetch("/follow", {
      method: "put",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        followID: userID,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setShouldLoad(Math.floor(Math.random() * 100 + 1));
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetch("/allposts", {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result) {
          setData(result.posts);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldLoad]);

  const handleLogout = () => {
    dispatch({
      type: "SET_TOKEN",
      token: "",
    });
    dispatch({
      type: "SET_USER",
      user: "",
    });
  };
  const successNotify = (text) => {
    toast.success(text, { autoClose: 1500 });
  };
  const warnNotify = (text) => {
    toast.warn(text);
  };
  const createComment = (e) => {
    setIsOpen(false);
    setLoading(true);
    e.preventDefault();
    fetch("/comment", {
      method: "put",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: msg,
        postId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //Comment Added
        setMsg("");
        setPostId("");
        setShouldLoad(Math.floor(Math.random() * 100 + 1));
        setLoading(false);
        successNotify("Successfully Commented");
      })
      .catch((err) => {
        console.log(err);
        warnNotify("Something went wrong");
      });
  };

  return (
    <div className="home">
      <Router>
        {loading && (
          <div className="load">
            <ClipLoader color="#fe5656" loading={loading} size={120} />
          </div>
        )}
        {isOpen && (
          <Modal closeModal={() => setIsOpen(false)}>
            {" "}
            <div className="create_post_grp">
              <h1> Comment</h1>
              <div className="create_post">
                <form onSubmit={createComment}>
                  <input
                    className="post_inp"
                    type="text"
                    onChange={(e) => setMsg(e.target.value.trimStart())}
                    required
                    value={msg}
                    name="msg"
                  />
                  <input className="modal_submit" type="submit" />
                </form>
              </div>
            </div>
          </Modal>
        )}
        <div className="sidebar">
          <div className="sidebar1">
            <div className="sidebar1_child1">
              <img src={user?.pic} alt="" />
              <div>
                <p>
                  {" "}
                  {user?.name}{" "}
                  <Link to="/home/profile">
                    {" "}
                    <GrFormNext />{" "}
                  </Link>{" "}
                </p>
                <span> @{user?.userName}</span>
              </div>
            </div>
            <div className="sidebar1_child2">
              <div>
                <p>{user?.followers?.length}</p>
                <span>Followers</span>
              </div>
              <div>
                <p>{user?.following?.length}</p>
                <span>Following</span>
              </div>
            </div>
          </div>
          <div className="sidebar2">
            <div id="nav_active">
              {" "}
              <MdHome className="icon" />{" "}
              <Link
                style={{
                  textDecoration: "none",
                  color: "#fe456e",
                  marginLeft: "1rem",
                }}
                to="/home"
              >
                {" "}
                <span>Home</span>{" "}
              </Link>{" "}
            </div>
            <div>
              {" "}
              <BsCollection className="icon" />
              <Link
                style={{
                  textDecoration: "none",
                  color: "#c6c6c6",
                  marginLeft: "1rem",
                }}
                to="/explore"
              >
                <span>Explore</span>{" "}
              </Link>
            </div>
            <div>
              {" "}
              <BsBookmark className="icon" />{" "}
              <Link
                style={{
                  textDecoration: "none",
                  color: "#c6c6c6",
                  marginLeft: "1rem",
                }}
                to="/favorites"
              >
                {" "}
                <span>Favorites</span>{" "}
              </Link>{" "}
            </div>
            <div>
              {" "}
              <FiSend className="icon" />{" "}
              <Link
                style={{
                  textDecoration: "none",
                  color: "#c6c6c6",
                  marginLeft: "1rem",
                }}
                to="/direct"
              >
                {" "}
                <span>Direct</span>{" "}
              </Link>
            </div>
            <div>
              {" "}
              <BsDisplay className="icon" />{" "}
              <Link
                style={{
                  textDecoration: "none",
                  color: "#c6c6c6",
                  marginLeft: "1rem",
                }}
                to="/ig"
              >
                {" "}
                <span>IG TV</span>{" "}
              </Link>{" "}
            </div>
            <div>
              {" "}
              <RiSettings4Line className="icon" />{" "}
              <Link
                style={{
                  textDecoration: "none",
                  marginLeft: "1rem",
                  color: "#c6c6c6",
                }}
                to="/settings"
              >
                {" "}
                <span>Settings</span>{" "}
              </Link>{" "}
            </div>
          </div>
          <div className="sidebar3">
            <div onClick={handleLogout}>
              {" "}
              <FiLogOut className="icon" /> <span>Logout</span>
            </div>
          </div>
        </div>
        <div className="feed">
          <Switch>
            <Route path="/home/profile">
              <Profile />
            </Route>
            <Route path="/home">
              <div className="feed_content">
                <div className="stories"></div>
                <div className="posts">
                  <h4>Feed</h4>
                  {data?.map((item) => (
                    <div key={item?._id} className="post">
                      <div className="post_header">
                        <div className="post_header_child1">
                          <img src={item?.postedBy.pic} alt="" />
                        </div>
                        <div className="post_header_child2">
                          <h5>
                            {" "}
                            <Link
                              style={{ textDecoration: "none", color: "black" }}
                              to={
                                user?._id === item?.postedBy._id
                                  ? `/home/profile`
                                  : `/profile/${item?.postedBy?._id}`
                              }
                            >
                              {" "}
                              {item?.postedBy.name}{" "}
                            </Link>
                          </h5>
                          <span>@{item?.postedBy.userName}</span>
                        </div>
                      </div>
                      <div className="post_body">
                        <p>{item?.message}</p>
                        <img src={item?.photo} alt="" />
                      </div>
                      <div className="post_footer">
                        <div className="post_footer_like">
                          {item?.likes.includes(user?._id) ? (
                            <HiHeart
                              onClick={() => {
                                fetch("/unlike", {
                                  method: "put",
                                  headers: {
                                    Authorization: "Bearer " + token,
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    postId: item?._id,
                                  }),
                                })
                                  .then((res) => res.json())
                                  .then((result) => {
                                    setShouldLoad(
                                      Math.floor(Math.random() * 100 + 1)
                                    );
                                  })
                                  .catch((err) => console.log(err));
                              }}
                              className="like_icon"
                            />
                          ) : (
                            <HiOutlineHeart
                              onClick={() => {
                                fetch("/like", {
                                  method: "put",
                                  headers: {
                                    Authorization: "Bearer " + token,
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    postId: item?._id,
                                  }),
                                })
                                  .then((res) => res.json())
                                  .then((result) => {
                                    setShouldLoad(
                                      Math.floor(Math.random() * 100 + 1)
                                    );
                                  })
                                  .catch((err) => console.log(err));
                              }}
                              className="unlike_icon"
                            />
                          )}

                          <span>{`${item?.likes.length} Likes`}</span>
                        </div>
                        <div
                          onClick={() => {
                            setPostId(item?._id);
                            setIsOpen(true);
                          }}
                          className="post_footer_comment"
                        >
                          <RiChat1Line />
                          <span>{`${item?.comments.length} Comments`}</span>
                        </div>
                        <div className="post_footer_share">
                          <BiShareAlt />
                          <span>Shares</span>
                        </div>
                        <div className="post_footer_saved">
                          <BsBookmark />
                          <span>Save</span>
                        </div>
                      </div>
                      {item?.comments.length === 0 ? (
                        ""
                      ) : (
                        <div className="comment_div">
                          <Comments
                            postedUser={item?.postedBy._id}
                            comments={item?.comments}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Route>
            <Route path="/profile/:userID">
              <Usersprofile />
            </Route>
          </Switch>
        </div>
        <div className="trending_feeds">
          <p>Suggestions</p>
          {users?.map((item) => (
            <div key={item?._id} className="trending_user">
              <img src={item?.pic} alt="" />
              <p>{item?.name.substring(0, 7)}...</p>
              <div
                onClick={() => followTrendingUsers(item?._id)}
                className="trending_user_follow"
              >
                Follow
              </div>
            </div>
          ))}
        </div>
      </Router>
    </div>
  );
}

export default Home;
