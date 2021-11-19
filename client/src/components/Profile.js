import React, { useEffect, useState } from "react";
import "./styles/Profile.css";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "./Modal";
import { useStateValue } from "../context/StateProvider";
import { Link } from "react-router-dom";

toast.configure();

function Profile() {
  const [{ reload }, dispatch] = useStateValue();
  const [mypost, setMyposts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [innerLoad, setInnerLoad] = useState(true);
  const [image, setImage] = useState();
  const [isOpen, setIsOpen] = useState(false);

  const successNotify = (text) => {
    toast.success(text, { autoClose: 1500 });
  };
  const warnNotify = (text) => {
    toast.warn(text, { autoClose: 1500 });
  };

  useEffect(() => {
    setFollowers(JSON.parse(localStorage.getItem("user"))?.followers);
    setFollowing(JSON.parse(localStorage.getItem("user"))?.following);
  }, []);

  useEffect(() => {
    let isMount = true;
    fetch("/myposts", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("auth-token"),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (isMount) {
          setMyposts(result.mypost);
          setInnerLoad(false);
        }
      });
    return () => {
      isMount = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);
  const deletePost = (postID) => {
    setLoading(true);
    fetch(`/deletepost/${postID}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("auth-token"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        //Post Deleted
        dispatch({
          type: "SET_RELOAD",
          reload: Math.floor(Math.random() * 100 + 1),
        });
        setLoading(false);
        successNotify("Post Deleted Successfully");
      })
      .catch((err) => {
        warnNotify("Something Went Wrong");
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setIsOpen(false);
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "instagramm-clone");
    data.append("cloud_name", "skdtech");
    fetch("https://api.cloudinary.com/v1_1/skdtech/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.secure_url) {
          fetch("/updatepic", {
            method: "PUT",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("auth-token"),
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              pic: data?.secure_url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              setLoading(false);
              dispatch({
                type: "SET_RELOAD",
                reload: Math.floor(Math.random() * 100 + 1),
              });
            })
            .catch((err) => {
              setLoading(false);
              console.log(err);
            });
        }
      })
      .catch((err) => {
        setLoading(false);
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
        localStorage.setItem("user", JSON.stringify(result?.user));
      })
      .catch((err) => {
        console.log(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);

  return (
    <div className="profile">
      {loading && (
        <div className="load">
          <ClipLoader color="#fe5656" loading={loading} size={120} />
        </div>
      )}
      {isOpen && (
        <Modal closeModal={() => setIsOpen(false)}>
          {" "}
          <div className="create_post_grp">
            <h1> Update your Profile Pic</h1>
            <div className="create_post">
              <form onSubmit={handleSubmit}>
                <label className="upload_btn">
                  {!image ? "Upload Image" : `Selected: ${image.name}`}
                  <input
                    onChange={(e) => setImage(e.target.files[0])}
                    className="modal_file"
                    type="file"
                  />
                </label>
                <input className="modal_submit" type="submit" />
              </form>
            </div>
          </div>
        </Modal>
      )}
      <div className="profile_1">
        <div className="profile_1_child1">
          <img src={JSON.parse(localStorage.getItem("user"))?.pic} alt="" />
          <div
            onClick={() => {
              setIsOpen(true);
            }}
            className="pic_edit"
          >
            Edit
          </div>
        </div>
        <div className="profile_1_child2">
          <div className="profile_details1">
            <h2>{JSON.parse(localStorage.getItem("user"))?.name}</h2>{" "}
          </div>
          <div className="profile_details2">
            <span>{`${mypost.length} Posts`}</span>
            <span>{`${followers.length} Followers`}</span>
            <span>{`${following.length} Following`}</span>
          </div>
          <div className="profile_details3"></div>
        </div>
      </div>
      <div>
        <h3 className="user_posts_title">My Posts</h3>
      </div>
      <div className="inner_load">
        <ClipLoader color="#fe5656" loading={innerLoad} size={50} />
      </div>
      <div className="profile_2">
        {mypost &&
          mypost.map((item) => (
            <div key={item?._id} className="profile_posts">
              {item?.postedBy?._id ===
              JSON.parse(localStorage.getItem("user"))?._id ? (
                <div className="post_icons">
                  <div
                    onClick={() => {
                      deletePost(item?._id);
                    }}
                    className="post_del"
                  >
                    Delete
                  </div>
                  <div
                    style={{ marginTop: "0.5rem", letterSpacing: "2px" }}
                    className="post_del"
                  >
                    <Link
                      style={{
                        textDecoration: "none",
                        color: "#ffffff",
                      }}
                      to={`/home/post/${item?._id}`}
                    >
                      View
                    </Link>
                  </div>
                </div>
              ) : (
                ""
              )}

              <img src={item?.photo} alt={item?.message} />
            </div>
          ))}
      </div>
    </div>
  );
}

export default Profile;
