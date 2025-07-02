import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // stores user data when logged in
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    // ✅ Add user data to store
    addUserData: (state, action) => {
      state.user = action.payload;
    },

    // ✅ Clear user data (on logout)
    logoutUser: (state) => {
      state.user = null;
    }
  }
});

// ✅ Export actions
export const { addUserData, logoutUser } = loginSlice.actions;

// ✅ Export reducer
export default loginSlice.reducer;
