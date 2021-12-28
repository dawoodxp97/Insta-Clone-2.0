import React, { useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "./styles/Layout.css";
import Suggestions from "./Suggestions";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useStateValue } from "../context/StateProvider";

toast.configure();

function Layout({ children }) {
  const history = useHistory();
  const [{ reload }, dispatch] = useStateValue();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      history.replace("/");
      errorNotify("User not authorized");
    }
  });
  useEffect(() => {
    fetchUserDetails();
    fetchPosts();
    fetchAllUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);
  const fetchAllUsers = async () => {
    if (localStorage.getItem("token")) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
        const { data } = await axios.get(`/api/user`, config);
        dispatch({
          type: "SET_SEARCHDATA",
          searchData: data.users,
        });
      } catch (error) {
        errorNotify(error.message);
      }
    }
  };
  const fetchPosts = async () => {
    if (localStorage.getItem("token")) {
      try {
        const { data } = await axios.get("/api/post");
        dispatch({
          type: "SET_ALLPOST",
          allPosts: data.posts,
        });
      } catch (error) {
        errorNotify("Failed to Load the Posts");
      }
    }
  };
  const fetchUserDetails = async () => {
    if (localStorage.getItem("token")) {
      try {
        const { data } = await axios.get(
          `/api/user/${JSON.parse(localStorage.getItem("user"))?._id}`
        );
        dispatch({
          type: "SET_USER",
          userDetails: data.user,
        });
        dispatch({
          type: "SET_POSTS",
          userPosts: data.userPosts,
        });
      } catch (error) {
        errorNotify(error.message);
      }
    }
  };
  const errorNotify = (text) => {
    toast.error(text, { autoClose: 1500 });
  };
  return (
    <div className="layout">
      <header className="header_grp">
        <Header />
      </header>
      <main className="main_grp">
        <div className="left_sidebar_grp">
          <Sidebar />
        </div>
        <div className="main_content_grp">{children}</div>
        <div className="right_sidebar_grp">
          <Suggestions />
        </div>
      </main>
    </div>
  );
}

export default Layout;
