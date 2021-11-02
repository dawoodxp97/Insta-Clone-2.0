import React, { useRef, useState } from "react";
import "./styles/Header.css";
import { BiSearchAlt } from "react-icons/bi";
import { BiMicrophone } from "react-icons/bi";
import { HiPlus } from "react-icons/hi";
import { RiSendPlaneFill } from "react-icons/ri";
import { RiNotification2Line } from "react-icons/ri";
import { RiMoonLine } from "react-icons/ri";
import Modal from "./Modal";
import ClipLoader from "react-spinners/ClipLoader";
import { useStateValue } from "../context/StateProvider";
import { Link } from "react-router-dom";

function Header() {
  const [{ searchData }, dispatch] = useStateValue();
  const [image, setImage] = useState();
  const [msg, setMsg] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputElem = useRef();
  const [searchedItems, setSearchedItems] = useState([]);

  const displaySearch = () => {
    document.getElementById("search-content").style.display = "block";
  };
  const hideSearch = () => {
    document.getElementById("search-content").style.display = "none";
  };

  const getSearch = () => {
    getSearchData(searchData, inputElem.current.value);
  };

  const getSearchData = function (data, title) {
    if (title !== "") {
      const searchObject = data.filter((item) =>
        item?.name.toLowerCase().includes(title.toLowerCase())
      );
      setSearchedItems(searchObject);
    } else {
      setSearchedItems([]);
    }
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
          fetch("/createpost", {
            method: "post",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("auth-token"),
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: msg,
              photo: data?.secure_url,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              dispatch({
                type: "SET_RELOAD",
                reload: Math.floor(Math.random() * 100 + 1),
              });
              setMsg("");
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
    <div id="head" className="header">
      {loading && (
        <div className="load">
          <ClipLoader color="#fe5656" loading={loading} size={120} />
        </div>
      )}
      {isOpen && (
        <Modal closeModal={() => setIsOpen(false)}>
          {" "}
          <div className="create_post_grp">
            <h1> Create your Post</h1>
            <div className="create_post">
              <form onSubmit={handleSubmit}>
                <input
                  className="post_inp"
                  type="text"
                  onChange={(e) => setMsg(e.target.value.trimStart())}
                  required
                  value={msg}
                  name="msg"
                />
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
      <div className="header1">
        <div className="header1_logo">
          <img src="https://i.ibb.co/bW6Rv8r/ins111.png" alt="" />
        </div>

        <img
          className="header1_img"
          src="https://www.vectorlogo.zone/logos/instagram/instagram-wordmark.svg"
          alt=""
        />
      </div>
      <div className="header2">
        <div className="header2_child1">
          <div id="search-content" className="search_content">
            {searchedItems &&
              searchedItems?.map((item) => (
                <Link
                  style={{ textDecoration: "none", color: "black" }}
                  to={
                    JSON.parse(localStorage.getItem("user"))?._id === item?._id
                      ? `/home/profile`
                      : `/home/userprofile/${item?._id}`
                  }
                >
                  <div key={item?._id} className="search_item">
                    <p>{item?.name}</p>
                    <span>{`@${item?.userName}`}</span>
                  </div>
                </Link>
              ))}
          </div>
          <BiSearchAlt style={{ color: "grey", marginLeft: "1rem" }} />
          <input
            ref={inputElem}
            onFocus={displaySearch}
            onBlur={hideSearch}
            className="header2_search"
            type="text"
            placeholder="Search"
            onChange={getSearch}
          />
          <BiMicrophone style={{ color: "grey", marginRight: "1rem" }} />
        </div>
        <div onClick={() => setIsOpen(true)} className="header2_child2">
          <HiPlus />
          <p>Create new post</p>
        </div>
      </div>
      <div className="header3">
        <div className="header3_child1">
          <RiSendPlaneFill style={{ color: "grey" }} />
        </div>
        <div className="header3_child2">
          <RiNotification2Line style={{ color: "grey" }} />
        </div>
        <div className="header3_child3">
          {" "}
          <RiMoonLine />{" "}
        </div>
      </div>
    </div>
  );
}

export default Header;
