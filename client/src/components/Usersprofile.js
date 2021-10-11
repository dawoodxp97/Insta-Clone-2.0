import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useStateValue } from "../context/StateProvider";

function Profile() {
  const { userID } = useParams();
  const [{ token, user }] = useStateValue();
  const [actuser, setActuser] = useState({});
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [mypost, setMyposts] = useState([]);
  const [shouldLoad, setShouldLoad] = useState();
  const [showFollow, setShowFollow] = useState();
  useEffect(() => {
    let isMount = true;
    fetch(`/user/${userID}`, {
      headers: {
        Authorization: "Bearer " + token,
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
        }
      });
    return () => {
      isMount = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userID, shouldLoad]);

  useEffect(() => {
    if (followers.includes(user?._id)) {
      setShowFollow(false);
    } else if (!followers.includes(user?._id)) {
      setShowFollow(true);
    }
  }, [followers, user?._id, userID]);
  const followUser = () => {
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
        setShowFollow(false);
        setShouldLoad(Math.floor(Math.random() * 100 + 1));
      })
      .catch((err) => console.log(err));
  };

  const unfollowUser = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        unfollowID: userID,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setShowFollow(true);
        setShouldLoad(Math.floor(Math.random() * 100 + 1));
      })
      .catch((err) => console.log(err));
  };

  return (
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
          <div className="profile_details3">Bio</div>
        </div>
      </div>
      <div className="profile_2">
        {mypost &&
          mypost.map((item) => (
            <div key={item?._id} className="profile_posts">
              <img src={item?.photo} alt={item?.message} />
            </div>
          ))}
      </div>
    </div>
  );
}

export default Profile;
