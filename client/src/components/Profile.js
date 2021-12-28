import React, { useState } from "react";
import "./styles/Profile.css";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "./Modal";
import { useStateValue } from "../context/StateProvider";
import { Link } from "react-router-dom";

toast.configure();

function Profile() {
  const [{ userDetails, userPosts }, dispatch] = useStateValue();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState();
  const [isOpen, setIsOpen] = useState(false);

  const successNotify = (text) => {
    toast.success(text, { autoClose: 1500 });
  };
  const warnNotify = (text) => {
    toast.warn(text, { autoClose: 1500 });
  };
  const deletePost = (postID) => {
    setLoading(true);
    fetch(`/api/post/${postID}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        //Post Deleted
        dispatch({
          type: "DELETE_POST",
          id: postID,
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
          fetch("/api/user", {
            method: "PUT",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              pic: data?.secure_url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              console.log(result);
              dispatch({
                type: "SET_PIC",
                pic: result?.pic,
              });
              setLoading(false);
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
                  {!image
                    ? "Upload Image"
                    : `Selected: ${image.name.substring(0, 7)}...`}
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
          <img src={userDetails?.pic} alt="" />
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
            <h2>{userDetails?.name}</h2>{" "}
          </div>
          <div className="profile_details2">
            <span>{`${userPosts?.length} Posts`}</span>
            <span>{`${userDetails?.followers?.length} Followers`}</span>
            <span>{`${userDetails?.following?.length} Following`}</span>
          </div>
          <div className="profile_details3"></div>
        </div>
      </div>
      <div>
        <h3 className="user_posts_title">My Posts</h3>
      </div>

      <div className="profile_2">
        {userPosts.length === 0 ? <p>No Posts yet</p> : ""}
        {userPosts &&
          userPosts.map((item) => (
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
                      to={`/postDetails/${item?._id}`}
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
