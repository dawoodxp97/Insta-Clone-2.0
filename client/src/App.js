//General Imports
import React, { lazy, Suspense } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

//Dynamic Imports
const Register = lazy(() => import("./components/Register"));
const Layout = lazy(() => import("./components/Layout"));
const Feed = lazy(() => import("./components/Feed"));
const Profile = lazy(() => import("./components/Profile"));
const Favorites = lazy(() => import("./components/Favorites"));
const PostDetails = lazy(() => import("./components/PostDetails"));
const UsersProfile = lazy(() => import("./components/Usersprofile"));
const SignIn = lazy(() => import("./components/SignIn"));

function App() {
  return (
    <div className="App">
      <Router>
        <Suspense
          fallback={
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                height: "55vh",
                width: "100%",
                color: "#161d25",
              }}
            >
              <ClipLoader color="#161d25" loading={true} size={30} />
              <p>Loading</p>
            </div>
          }
        >
          <Switch>
            <Route exact path="/" component={SignIn} />
            <Route path="/register" component={Register} />
            <Layout>
              <Route path="/home" component={Feed} />
              <Route path="/profile" component={Profile} />
              <Route path="/favorites" component={Favorites} />
              <Route path="/postDetails/:postID" component={PostDetails} />
              <Route path="/userProfile/:userID" component={UsersProfile} />
            </Layout>
          </Switch>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
