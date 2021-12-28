import React, { useRef, useState } from "react";
import "./styles/Header.css";
import { BiSearchAlt } from "react-icons/bi";
import { HiPlus } from "react-icons/hi";
import { RiMoonLine } from "react-icons/ri";
import { FiSun } from "react-icons/fi";
import Modal from "./Modal";
import ClipLoader from "react-spinners/ClipLoader";
import { useStateValue } from "../context/StateProvider";
import { useHistory } from "react-router";

function Header() {
  const [{ searchData }, dispatch] = useStateValue();
  const history = useHistory();
  const [image, setImage] = useState();
  const [isDark, setIsDark] = useState(false);
  const [msg, setMsg] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputElem = useRef();
  const [searchedItems, setSearchedItems] = useState([]);
  const rootElem = document.querySelector(":root");

  const switchTheme = (type) => {
    if (type === "light") {
      rootElem.style.setProperty("--bg-primary", "#ffffff");
      rootElem.style.setProperty("--bg-secondary", "#fafafa");
      rootElem.style.setProperty("--text-primary", "black");
      rootElem.style.setProperty("--text-secondary", "#c6c6c6");
      rootElem.style.setProperty("--box-shadow", "rgba(0, 0, 0, 0.24)");
      rootElem.style.setProperty("--trend-bg", "#dbe9e2");
      rootElem.style.setProperty("--trend-icon", "#3997ef");
    } else if (type === "dark") {
      rootElem.style.setProperty("--bg-primary", "#18191a");
      rootElem.style.setProperty("--bg-secondary", "#282a36");
      rootElem.style.setProperty("--text-primary", "white");
      rootElem.style.setProperty("--text-secondary", "grey");
      rootElem.style.setProperty("--box-shadow", "#4bf3cf");
      rootElem.style.setProperty("--trend-bg", "#282a36");
      rootElem.style.setProperty("--trend-icon", "#BA5535");
    }
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
          fetch("/api/post", {
            method: "post",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
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
              setImage();
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
      {searchOpen && (
        <Modal closeModal={() => setSearchOpen(false)}>
          <div>
            <input
              id="search-inp"
              ref={inputElem}
              className="header2_search"
              type="text"
              placeholder="Search"
              onChange={getSearch}
            />
            <div id="search-content" className="search_content">
              {searchedItems &&
                searchedItems?.map((item) => (
                  <div
                    onClick={() => {
                      history.replace(
                        JSON.parse(localStorage.getItem("user"))?._id ===
                          item?._id
                          ? `/profile`
                          : `/userprofile/${item?._id}`
                      );
                      setSearchOpen(false);
                      setSearchedItems([]);
                    }}
                    key={item?._id}
                    className="search_item"
                  >
                    <p>{item?.name}</p>
                    <span>{`@${item?.userName}`}</span>
                  </div>
                ))}
            </div>
          </div>
        </Modal>
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
                  {!image
                    ? "Upload Image"
                    : `Selected: ${image.name.substring(0, 7)}...`}
                  <input
                    onChange={(e) => setImage(e.target.files[0])}
                    className="modal_file"
                    type="file"
                  />
                </label>
                <input
                  disabled={!(msg && image)}
                  className="modal_submit"
                  type="submit"
                />
              </form>
            </div>
          </div>
        </Modal>
      )}
      <div className="header1">
        <div className="header1_logo">
          <img src="https://i.ibb.co/bW6Rv8r/ins111.png" alt="" />
        </div>
      </div>
      <div className="header2">
        <div onClick={() => setSearchOpen(true)} className="header2_child1">
          <BiSearchAlt style={{ color: "grey", marginLeft: "1rem" }} />
          <span>Search...</span>
        </div>
        <div onClick={() => setIsOpen(true)} className="header2_child2">
          <HiPlus />
          <p>Create new post</p>
        </div>
      </div>
      <div className="header3">
        {/* <div className="header3_child1">
          <RiSendPlaneFill style={{ color: "grey" }} />
        </div> */}
        <div className="header3_child3">
          {isDark ? (
            <FiSun
              onClick={() => {
                setIsDark(false);
                switchTheme("light");
              }}
            />
          ) : (
            <RiMoonLine
              onClick={() => {
                setIsDark(true);
                switchTheme("dark");
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
