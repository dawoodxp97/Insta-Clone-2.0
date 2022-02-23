import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./styles/Register.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";

toast.configure();

function Register() {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState("");

  const uploadUserWithPic = () => {
    const data = new FormData();
    data.append("file", img);
    data.append("upload_preset", "instagramm-clone");
    data.append("cloud_name", "skdtech");
    fetch("https://api.cloudinary.com/v1_1/skdtech/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          uploadUser(data?.secure_url);
        } else {
          setLoading(false);
          warnNotify();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const uploadUser = async (url) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user/register",
        { email, password, name, userName, pic: url },
        config
      );
      if (data) {
        setName("");
        setUserName("");
        setEmail("");
        setPassword("");
        setLoading(false);
        successNotify();
        history.push("/");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const successNotify = () => {
    toast.success("Account Created Successfully");
  };
  const warnNotify = () => {
    toast.warn("Something went wrong");
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (img) {
      uploadUserWithPic();
    } else {
      uploadUser();
    }
  };

  return (
    <div className="signin">
      {loading && (
        <div className="load">
          <ClipLoader color="#fe5656" loading={loading} size={120} />
        </div>
      )}
      <div className="signin_card">
        <div className="card_1">
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/sign-up-3391266-2937870.png"
            alt=""
          />
        </div>
        <div className="card_2">
          <div className="card_2_logo">
            <img
              className="main_logo"
              src="https://res.cloudinary.com/skdtech/image/upload/v1645601951/ins_logo_zbll70.png"
              alt=""
            />
          </div>
          <div className="card_2_form">
            <form onSubmit={handleSubmit}>
              <h1>Sign Up</h1>
              <label>
                Name :
                <input
                  className="form_input"
                  name="username"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value.trimStart())}
                  required
                />
              </label>
              <label>
                Username(@) :
                <input
                  className="form_input"
                  name="username"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value.trimStart())}
                  required
                />
              </label>
              <label className="upload_btn">
                {!img ? "Upload Profile Image" : `Selected: ${img.name}`}
                <input
                  name="profilepic"
                  type="file"
                  onChange={(e) => setImg(e.target.files[0])}
                />
              </label>
              <label>
                Email:
                <input
                  className="form_input"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trimStart())}
                  required
                />
              </label>

              <label>
                Password:
                <input
                  className="form_input"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value.trimStart())}
                  required
                />
              </label>
              <button>Submit</button>
              <p>
                Already have account ?{" "}
                <Link
                  to="/"
                  style={{
                    textDecoration: "none",
                    color: "#830B4F",
                  }}
                >
                  {" "}
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
