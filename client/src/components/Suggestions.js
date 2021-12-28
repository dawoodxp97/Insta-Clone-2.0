import React, { useEffect, useState } from "react";
import { useStateValue } from "../context/StateProvider";
import "./styles/Suggestions.css";

function Suggestions() {
  const [{ searchData, userDetails }, dispatch] = useStateValue();
  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (userDetails?._id) {
      setUsers(
        searchData?.filter(function (item) {
          return (
            item?._id !== userDetails?._id &&
            !item?.followers.includes(userDetails?._id)
          );
        })
      );
    }
  }, [searchData, userDetails]);

  const followTrendingUsers = (id) => {
    fetch("/api/user", {
      method: "post",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        followID: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "SET_RELOAD",
          reload: Math.floor(Math.random() * 100 + 1),
        });
      })
      .catch((err) => console.log(err));
  };
  return (
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
  );
}

export default Suggestions;
