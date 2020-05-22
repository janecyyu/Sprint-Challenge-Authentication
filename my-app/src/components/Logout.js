import React, { useEffect } from "react";

function Logout() {
  localStorage.removeItem("token");
  return <h1>Good bye!</h1>;
}

export default Logout;
