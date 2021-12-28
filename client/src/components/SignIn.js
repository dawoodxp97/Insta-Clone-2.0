import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./styles/SignIn.css";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

toast.configure();

function SignIn() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const successNotify = () => {
    toast.success("Signedin Successfully", { autoClose: 1500 });
  };
  const warnNotify = (text) => {
    toast.warn(text, { autoClose: 1500 });
  };

  const handleLogin = async () => {
    setLoading(true);
    if (!email || !password) {
      setLoading(false);
      warnNotify("Please Fill all the Feilds");
      return;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      setLoading(false);
      successNotify();
      history.push("/home");
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
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
            src="https://cdni.iconscout.com/illustration/premium/thumb/account-log-in-4268411-3551758.png"
            alt=""
          />
        </div>
        <div className="card_2">
          <div className="card_2_logo">
            <img src="https://i.ibb.co/bW6Rv8r/ins111.png" alt="" />
            <img src="https://i.ibb.co/Cz1sBp5/Instagram-name-PNG.png" alt="" />
          </div>
          <div className="card_2_form">
            <form onSubmit={handleSubmit}>
              <h1>Login</h1>

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
                Don't have account ?{" "}
                <Link
                  to="/register"
                  style={{
                    textDecoration: "none",
                    color: "#830B4F",
                  }}
                >
                  {" "}
                  Sign Up
                </Link>
              </p>
              <button
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setEmail("tester1234@test.com");
                  setPassword("testing_user@12345");
                }}
              >
                Guest Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
