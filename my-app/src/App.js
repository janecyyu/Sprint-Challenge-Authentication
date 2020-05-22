import React from "react";
import "./App.css";
import Login from "./components/Login";
import Jokes from "./components/Jokes";
import Signup from "./components/Signup";
import Logout from "./components/Logout";

import { Route } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Link } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <Router>
      <Link className="sign-btn" to="/signup">
        Sign Up
      </Link>
      <br />
      <Link className="login-btn" to="/login">
        Login
      </Link>
      <br />
      <Link className="users-btn" to="/users">
        User list
      </Link>
      <br />
      <Link to="/logout">Logout</Link>
      <div className="App">
        <Route exact path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/logout" component={Logout} />
        <PrivateRoute path="/users" component={Jokes} />
      </div>
    </Router>
  );
}

export default App;
