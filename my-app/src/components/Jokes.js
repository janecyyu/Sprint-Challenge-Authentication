import React, { useEffect, useState } from "react";
import axios from "axios";

function Users() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  useEffect(() => {
    axios
      .get("http://localhost:3300/api/jokes", {
        headers: {
          authorization: token,
        },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <div>
      <h1>Joke List</h1>
      <div>
        {users.map((u) => (
          <h3>{u.joke}</h3>
        ))}
      </div>
    </div>
  );
}
export default Users;
