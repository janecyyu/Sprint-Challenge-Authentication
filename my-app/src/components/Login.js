import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

function Login() {
  const [logInData, setLogInData] = useState({ username: "", password: "" });
  const { push } = useHistory();

  const handleChanges = (event) => {
    event.preventDefault();
    setLogInData({ ...logInData, [event.target.name]: event.target.value });
    //console.log(logInData);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3300/api/auth/login", logInData)
      .then((res) => {
        console.log(res.data);
        window.localStorage.setItem("token", res.data.yourToken);
        setLogInData({ username: "", password: "" });
        push("/users");
      })
      .catch((err) => console.log(err, logInData));
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        id="username"
        name="username"
        type="text"
        placeholder="Username"
        value={logInData.username}
        onChange={handleChanges}
      />
      <input
        id="password"
        name="password"
        type="password"
        placeholder="Password"
        value={logInData.password}
        onChange={handleChanges}
      />
      <button onClick={onSubmit}>submit</button>
    </div>
  );
}
export default Login;
