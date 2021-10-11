import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./styles/SignIn.css";
import { useStateValue } from "../context/StateProvider";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

function SignIn() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [, dispatch] = useStateValue();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const successNotify = () => {
    toast.success("Signedin Successfully", { autoClose: 1500 });
  };
  const warnNotify = () => {
    toast.warn("Something went wrong", { autoClose: 1500 });
  };
  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    fetch("/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setEmail("");
        setPassword("");
        dispatch({
          type: "SET_USER",
          user: data?.user,
        });
        dispatch({
          type: "SET_TOKEN",
          token: data?.token,
        });
        setLoading(false);
        successNotify();
        history.push("/home");
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        warnNotify();
      });
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
