import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import "./styles/Sidebar.css";
import { MdHome } from "react-icons/md";
import { BsBookmark } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { useStateValue } from "../context/StateProvider";

function Sidebar() {
  const history = useHistory();
  const [{ userDetails }] = useStateValue();
  const navBtns = document.getElementsByClassName("nav");
  useEffect(() => {
    focusNav();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const focusNav = () => {
    for (let i = 0; i < navBtns.length; i++) {
      navBtns[i].addEventListener("click", function () {
        const current = document.getElementsByClassName("nav_active");
        current[0].className = current[0].className.replace("nav_active", "");
        this.className += " nav_active";
      });
    }
  };
  return (
    <div className="sidebar">
      <div className="sidebar1">
        <div className="sidebar1_child1">
          <img src={userDetails?.pic} alt="" />
          <div>
            <p>
              <Link
                to="/profile"
                style={{
                  textDecoration: "none",
                  color: "var(--text-primary)",
                }}
              >
                {userDetails?.name}
              </Link>
            </p>
            <span> @{userDetails?.userName}</span>
          </div>
        </div>
        <div className="sidebar1_child2">
          <div>
            <p>{userDetails?.followers?.length}</p>
            <span>Followers</span>
          </div>
          <div>
            <p>{userDetails?.following?.length}</p>
            <span>Following</span>
          </div>
        </div>
      </div>
      <div className="sidebar2">
        <Link style={{ textDecoration: "none", color: "#c6c6c6" }} to="/home">
          <div className="nav nav_active">
            <MdHome className="icon" /> <span>Home</span>{" "}
          </div>
        </Link>
        <Link
          style={{ textDecoration: "none", color: "#c6c6c6" }}
          to="/favorites"
        >
          <div className="nav">
            {" "}
            <BsBookmark className="icon" /> <span>Favorites</span>{" "}
          </div>
        </Link>
        {/* <Link
              style={{ textDecoration: "none", color: "#c6c6c6" }}
              to="/home/direct"
            >
              <div className="nav">
                {" "}
                <FiSend className="icon" /> <span>Direct</span>{" "}
              </div>
            </Link> */}
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
  );
}

export default Sidebar;
