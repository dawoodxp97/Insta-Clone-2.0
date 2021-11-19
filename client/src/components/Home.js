import React, { useEffect, useState } from "react";
import "./styles/Home.css";
import { MdHome } from "react-icons/md";
import { BsBookmark } from "react-icons/bs";
import { BsBookmarkFill } from "react-icons/bs";
import { FiSend } from "react-icons/fi";
import { HiHeart } from "react-icons/hi";
import { HiOutlineHeart } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi";
import { RiChat1Line } from "react-icons/ri";
import { BiShareAlt } from "react-icons/bi";
import { useHistory } from "react-router";
import { GrFormNext } from "react-icons/gr";
import { useStateValue } from "../context/StateProvider";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Profile from "./Profile";
import Usersprofile from "./Usersprofile";
import Post from "./Post";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Favorites from "./Favorites";
import ClipLoader from "react-spinners/ClipLoader";
import Direct from "./Direct";

toast.configure();

function Home() {
  const navBtns = document.getElementsByClassName("nav");
  const history = useHistory();
  const [{ reload }, dispatch] = useStateValue();
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [load, setLoad] = useState(true);
  const successNotify = (text) => {
    toast.success(text, { autoClose: 1500 });
  };

  const addToFav = (id) => {
    fetch("/addfav", {
      method: "put",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("auth-token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postID: id,
      }),
    })
      .then(async (response) => {
        try {
          const data = await response.json();
          localStorage.setItem("user", JSON.stringify(data));
          dispatch({
            type: "SET_RELOAD",
            reload: Math.floor(Math.random() * 100 + 1),
          });
        } catch (error) {
          console.log("Error happened here!");
          console.error(error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const deleteFav = (id) => {
    fetch("/deletefav", {
      method: "put",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("auth-token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postID: id,
      }),
    })
      .then(async (response) => {
        try {
          const data = await response.json();
          localStorage.setItem("user", JSON.stringify(data));
          dispatch({
            type: "SET_RELOAD",
            reload: Math.floor(Math.random() * 100 + 1),
          });
        } catch (error) {
          console.log("Error happened here!");
          console.error(error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const focusNav = () => {
    for (let i = 0; i < navBtns.length; i++) {
      navBtns[i].addEventListener("click", function () {
        const current = document.getElementsByClassName("nav_active");
        current[0].className = current[0].className.replace("nav_active", "");
        this.className += " nav_active";
      });
    }
  };
  focusNav();

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      history.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetch("/allusers", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("auth-token"),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result) {
          dispatch({
            type: "SET_SEARCHDATA",
            searchData: result?.data,
          });
          setUsers(
            result?.data?.filter(function (item) {
              return (
                item?._id !== JSON.parse(localStorage.getItem("user"))?._id &&
                !item?.followers.includes(
                  JSON.parse(localStorage.getItem("user"))?._id
                )
              );
            })
          );
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);

  const followTrendingUsers = (userID) => {
    fetch("/follow", {
      method: "put",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("auth-token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        followID: userID,
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

  useEffect(() => {
    fetch("/allposts", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("auth-token"),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result) {
          setData(result.posts);
          dispatch({
            type: "SET_ALLPOST",
            allPosts: result.posts,
          });
          setLoad(false);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);

  return (
    <div className="home">
      <Router>
        <div className="sidebar">
          <div className="sidebar1">
            <div className="sidebar1_child1">
              <img src={JSON.parse(localStorage.getItem("user"))?.pic} alt="" />
              <div>
                <p>
                  {" "}
                  <Link
                    to="/home/profile"
                    style={{
                      textDecoration: "none",
                      color: "var(--text-primary)",
                    }}
                  >
                    {JSON.parse(localStorage.getItem("user"))?.name}{" "}
                  </Link>{" "}
                </p>
                <span>
                  {" "}
                  @{JSON.parse(localStorage.getItem("user"))?.userName}
                </span>
              </div>
            </div>
            <div className="sidebar1_child2">
              <div>
                <p>
                  {JSON.parse(localStorage.getItem("user"))?.followers?.length}
                </p>
                <span>Followers</span>
              </div>
              <div>
                <p>
                  {JSON.parse(localStorage.getItem("user"))?.following?.length}
                </p>
                <span>Following</span>
              </div>
            </div>
          </div>
          <div className="sidebar2">
            <Link
              style={{ textDecoration: "none", color: "#c6c6c6" }}
              to="/home"
            >
              <div className="nav nav_active">
                {" "}
                <MdHome className="icon" /> <span>Home</span>{" "}
              </div>
            </Link>
            <Link
              style={{ textDecoration: "none", color: "#c6c6c6" }}
              to="/home/favorites"
            >
              <div className="nav">
                {" "}
                <BsBookmark className="icon" /> <span>Favorites</span>{" "}
              </div>
            </Link>
            <Link
              style={{ textDecoration: "none", color: "#c6c6c6" }}
              to="/home/direct"
            >
              <div className="nav">
                {" "}
                <FiSend className="icon" /> <span>Direct</span>{" "}
              </div>
            </Link>
          </div>
          <div className="sidebar3">
            <div
              onClick={() => {
                localStorage.clear();
                history.push("/");
              }}
            >
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
            <Route path="/home/direct">
              <Direct />
            </Route>
            <Route path="/home/favorites">
              <Favorites />
            </Route>
            <Route exact path="/home">
              <div className="feed_content">
                <div className="stories"></div>
                <div className="posts">
                  <h4>Feed</h4>
                  {data.length === 0 ? (
                    <div className="load">
                      <ClipLoader color="#fe5656" loading={load} size={80} />
                    </div>
                  ) : (
                    ""
                  )}
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
                              style={{
                                textDecoration: "none",
                                color: "var(--text-primary)",
                              }}
                              to={
                                JSON.parse(localStorage.getItem("user"))
                                  ?._id === item?.postedBy._id
                                  ? `/home/profile`
                                  : `/home/userprofile/${item?.postedBy?._id}`
                              }
                            >
                              {" "}
                              {item?.postedBy.name}{" "}
                            </Link>
                          </h5>
                          <span>@{item?.postedBy.userName}</span>
                        </div>
                      </div>
                      <Link
                        style={{
                          textDecoration: "none",
                          color: "#121212",
                        }}
                        to={`/home/post/${item?._id}`}
                      >
                        <div className="post_body">
                          <p>{item?.message}</p>
                          <img src={item?.photo} alt="" />
                        </div>
                      </Link>
                      <div className="post_footer">
                        <div className="post_footer_like">
                          {item?.likes.includes(
                            JSON.parse(localStorage.getItem("user"))?._id
                          ) ? (
                            <HiHeart
                              onClick={() => {
                                fetch("/unlike", {
                                  method: "put",
                                  headers: {
                                    Authorization:
                                      "Bearer " +
                                      localStorage.getItem("auth-token"),
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    postId: item?._id,
                                  }),
                                })
                                  .then((res) => res.json())
                                  .then((result) => {
                                    dispatch({
                                      type: "SET_RELOAD",
                                      reload: Math.floor(
                                        Math.random() * 100 + 1
                                      ),
                                    });
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
                                    Authorization:
                                      "Bearer " +
                                      localStorage.getItem("auth-token"),
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    postId: item?._id,
                                  }),
                                })
                                  .then((res) => res.json())
                                  .then((result) => {
                                    dispatch({
                                      type: "SET_RELOAD",
                                      reload: Math.floor(
                                        Math.random() * 100 + 1
                                      ),
                                    });
                                  })
                                  .catch((err) => console.log(err));
                              }}
                              className="unlike_icon"
                            />
                          )}

                          <span>{`${item?.likes.length} Likes`}</span>
                        </div>
                        <div className="post_footer_comment">
                          <RiChat1Line />
                          <Link
                            style={{
                              textDecoration: "none",
                              color: "var(--text-primary)",
                            }}
                            to={`/home/post/${item?._id}`}
                          >
                            <span>{`${item?.comments.length} Comments`}</span>
                          </Link>
                        </div>
                        <div className="post_footer_share">
                          <BiShareAlt />
                          <CopyToClipboard
                            text={`https://ins-skd.herokuapp.com/home/post/${item?._id}`}
                            onCopy={() => {
                              successNotify("Link Copied to Clipboard");
                            }}
                          >
                            <span style={{ cursor: "pointer" }}>Share</span>
                          </CopyToClipboard>
                        </div>
                        {JSON.parse(
                          localStorage.getItem("user")
                        ).favorites?.some(function (elem) {
                          return elem._id === item?._id;
                        }) ? (
                          <div className="post_footer_saved">
                            <BsBookmarkFill />
                            <span
                              onClick={() => {
                                deleteFav(item?._id);
                              }}
                              style={{ cursor: "pointer" }}
                            >
                              Saved
                            </span>
                          </div>
                        ) : (
                          <div className="post_footer_saved">
                            <BsBookmark />
                            <span
                              onClick={() => {
                                addToFav(item?._id);
                              }}
                              style={{ cursor: "pointer" }}
                            >
                              Save
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Route>
            <Route path="/home/post/:postID">
              <Post />
            </Route>
            <Route path="/home/userprofile/:userID">
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
