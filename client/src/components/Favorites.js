import React, { useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { BiShareAlt } from "react-icons/bi";
import { HiHeart, HiOutlineHeart } from "react-icons/hi";
import { RiChat1Line } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useStateValue } from "../context/StateProvider";
import "./styles/Favorites.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import ClipLoader from "react-spinners/ClipLoader";

toast.configure();

function Favorites() {
  const [{ reload }, dispatch] = useStateValue();
  const [favData, setFavData] = useState([]);
  const [innerLoad, setInnerLoad] = useState(true);

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

  useEffect(() => {
    fetch("/currUser", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("auth-token"),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setFavData(result?.user?.favorites);
        setInnerLoad(false);
      })
      .catch((err) => {
        console.log(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);

  const successNotify = (text) => {
    toast.success(text, { autoClose: 1500 });
  };
  return (
    <div className="fav_container">
      <div className="fav_grp">
        <h2>Favorites</h2>
        {favData.length === 0 ? (
          <div className="in_load">
            <ClipLoader color="#fe5656" loading={innerLoad} size={50} />
          </div>
        ) : (
          ""
        )}
        {favData &&
          favData.map((item) => (
            <div key={item?._id} style={{ width: "80%" }} className="post">
              <Link
                style={{
                  textDecoration: "none",
                  color: "#121212",
                }}
                to={`/home/post/${item?._id}`}
              >
                <div className="post_body fav_post">
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
                              "Bearer " + localStorage.getItem("auth-token"),
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
                              reload: Math.floor(Math.random() * 100 + 1),
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
                              "Bearer " + localStorage.getItem("auth-token"),
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
                              reload: Math.floor(Math.random() * 100 + 1),
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
                  <span>{`${item?.comments.length} Comments`}</span>
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
                {JSON.parse(localStorage.getItem("user")).favorites?.some(
                  function (elem) {
                    return elem._id === item?._id;
                  }
                ) ? (
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
  );
}

export default Favorites;
