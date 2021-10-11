import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import SignIn from "./components/SignIn";
import Register from "./components/Register";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/home">
            <Header />
            <Home />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/">
            <SignIn />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
