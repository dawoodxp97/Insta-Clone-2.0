import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useStateValue } from "../context/StateProvider";
import ClipLoader from "react-spinners/ClipLoader";

function Profile() {
  const { userID } = useParams();
  const [{ reload }, dispatch] = useStateValue();
  const [actuser, setActuser] = useState({});
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [mypost, setMyposts] = useState([]);
  const [innerLoad, setInnerLoad] = useState(true);
  const [showFollow, setShowFollow] = useState();
  useEffect(() => {
    let isMount = true;
    fetch(`/user/${userID}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("auth-token"),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (isMount) {
          setMyposts(result.posts);
          setActuser(result.user);
          setFollowers(result.user.followers);
          setFollowing(result.user.following);
          setInnerLoad(false);
        }
      });
    return () => {
      isMount = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userID, reload]);

  useEffect(() => {
    if (followers.includes(JSON.parse(localStorage.getItem("user"))?._id)) {
      setShowFollow(false);
    } else if (
      !followers.includes(JSON.parse(localStorage.getItem("user"))?._id)
    ) {
      setShowFollow(true);
    }
  }, [followers, userID]);
  const followUser = () => {
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
        setShowFollow(false);
        dispatch({
          type: "SET_RELOAD",
          reload: Math.floor(Math.random() * 100 + 1),
        });
      })
      .catch((err) => console.log(err));
  };

  const unfollowUser = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("auth-token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        unfollowID: userID,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setShowFollow(true);
        dispatch({
          type: "SET_RELOAD",
          reload: Math.floor(Math.random() * 100 + 1),
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
              to={`/home/post/${item?._id}`}
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

export default Profile;
