import React, { useLayoutEffect, useState} from 'react'
import { useDispatch, useSelector } from "react-redux";
// import { refreshAccessToken } from "../Auth/index";
import { addUserData, logoutUser } from "../Store/ReducSlice";
import Login from './LogIn';
import MainPage from "../Pages/MainPage"
import axios from 'axios';


export default function LoginRedirect (){
    const user = useSelector((state) => state.login.user);
    const dispatch = useDispatch();
    const [authChecked, setAuthChecked] = useState(false)

    const refreshAccessToken = async () => {
      try {
        const res = await axios.post("/api/v1/user/refreshToken", {
          withCredentials: true, // cookies for refresh token
        });
        dispatch(addUserData(res.data?.data?.user));
        return res.data
      } catch (err) {
        console.error("🔁 Token refresh failed:", err.message);
        dispatch(logoutUser());
      }
      finally {
        setAuthChecked(true); // ✅ Proceed after attempt
      }
    
    };
    
    useLayoutEffect(() => {
      refreshAccessToken();
      // Setup refresh every 15 mins
      const interval = setInterval(() => {
        refreshAccessToken(dispatch, addUserData, logoutUser);
      }, 15 * 60 * 1000);
  
      return () => {
        clearInterval(interval);
      };
    }, [dispatch]);

    if (!authChecked) return <></>
    return user ? <MainPage /> : <Login />;
  };

