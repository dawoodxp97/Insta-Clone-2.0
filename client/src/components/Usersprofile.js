import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useStateValue } from "../context/StateProvider";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

function Usersprofile() {
  const { userID } = useParams();
  const [, dispatch] = useStateValue();
  const [actuser, setActuser] = useState({});
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [mypost, setMyposts] = useState([]);
  const [innerLoad, setInnerLoad] = useState(true);
  const [showFollow, setShowFollow] = useState();
  useEffect(() => {
    fetchUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userID]);
  const errorNotify = (text) => {
    toast.error(text, { autoClose: 1500 });
  };

  const fetchUserDetails = async () => {
    if (localStorage.getItem("token")) {
      try {
        const { data } = await axios.get(`/api/user/${userID}`);
        setActuser(data.user);
        setMyposts(data.userPosts);
        setFollowers(data.user.followers);
        setFollowing(data.user.following);
        setInnerLoad(false);
      } catch (error) {
        errorNotify(error.message);
        setInnerLoad(false);
      }
    }
  };
  useEffect(() => {
    if (followers.includes(JSON.parse(localStorage.getItem("user"))?._id)) {
      setShowFollow(false);
    } else if (
      !followers.includes(JSON.parse(localStorage.getItem("user"))?._id)
    ) {
      setShowFollow(true);
    }
  }, [followers, userID]);
  const followUser = async () => {
    fetch("/api/user", {
      method: "post",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        followID: userID,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setFollowers((followers) => {
          return (followers = data.followers);
        });
        dispatch({
          type: "SET_FOLLOWINGS",
          following: data.following,
        });
      })
      .catch((err) => console.log(err));
  };

  const unfollowUser = () => {
    fetch("/api/user", {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        followID: userID,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setFollowers((followers) => {
          return (followers = data.followers);
        });
        dispatch({
          type: "SET_FOLLOWINGS",
          following: data.following,
        });
      })
      .catch((err) => console.log(err));
  };

  return innerLoad ? (
    <div className="user_load">
      <ClipLoader color="#fe5656" loading={innerLoad} size={50} />
    </div>
  ) : (
    <div className="profile">
      <div className="profile_1">
        <div className="profile_1_child1">
          <img src={actuser?.pic} alt="" />
        </div>
        <div className="profile_1_child2">
          <div className="profile_details1">
            <h2>{actuser?.name}</h2>
            {showFollow ? (
              <div className="follow_Btn">
                <p onClick={() => followUser()}>Follow</p>
              </div>
            ) : (
              <div className="follow_Btn">
                <p onClick={() => unfollowUser()}>Unfollow</p>
              </div>
            )}
          </div>
          <div className="profile_details2">
            <span>{`${mypost?.length} Posts`}</span>
            <span>{`${followers.length} Followers`}</span>
            <span>{`${following.length} Following`}</span>
          </div>
          <div className="profile_details3"></div>
        </div>
      </div>
      <div>
        <h3 className="user_posts_title">Posts</h3>
      </div>
      <div className="profile_2">
        {mypost &&
          mypost.map((item) => (
            <Link
              style={{
                textDecoration: "none",
                color: "#121212",
              }}
              to={`/postDetails/${item?._id}`}
            >
              <div key={item?._id} className="profile_posts">
                <img src={item?.photo} alt={item?.message} />
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}

export default Usersprofile;
