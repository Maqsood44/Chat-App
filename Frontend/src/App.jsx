import React, { useLayoutEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { refreshAccessToken } from "../src/Auth/index";
import { addUserData, logoutUser } from "../src/Store/ReducSlice";

function App() {
  
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    console.log("useLayoutEffect working")
    const res = refreshAccessToken(dispatch, addUserData, logoutUser);
    console.log("Refresh token ", res)

    // Setup refresh every 15 mins
    const interval = setInterval(() => {
      refreshAccessToken(dispatch, addUserData, logoutUser);
    }, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <>
      <Outlet />
    </>
  );
}

export default App;
