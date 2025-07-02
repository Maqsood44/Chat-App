import axios from "axios";

export const refreshAccessToken = async (dispatch,  addUserData, logoutUser) => {
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

};