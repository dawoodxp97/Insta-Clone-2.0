import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SignIn from "./components/SignIn";
import Register from "./components/Register";
import Layout from "./components/Layout";
import Feed from "./components/Feed";
import Profile from "./components/Profile";
import Favorites from "./components/Favorites";
import PostDetails from "./components/PostDetails";
import UsersProfile from "./components/Usersprofile";

function App() {
  return (
    <div className="App">
      <Router>
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
      </Router>
    </div>
  );
}

export default App;

