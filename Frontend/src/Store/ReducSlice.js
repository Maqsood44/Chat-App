import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,       // stores user data when logged in
  allUsers: [],     // stores all chat users
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
      state.allUsers = [];
    },

    // ✅ Store all fetched users
    setAllUsers: (state, action) => {
      state.allUsers = action.payload;
    },

    // ✅ Update unseenCount in real-time
    updateUnseenCount: (state, action) => {
      const user = state.allUsers.find((u) => u._id === action.payload.userId);
      if (user) {
        user.unseenCount = (user.unseenCount || 0) + 1;
      }
    },

    // ✅ Reset unseen count when user opens chat
    resetUnseenCount: (state, action) => {
      const user = state.allUsers.find((u) => u._id === action.payload.userId);
      if (user) {
        user.unseenCount = 0;
      }
    }
  }
});

// ✅ Export actions
export const {
  addUserData,
  logoutUser,
  setAllUsers,
  updateUnseenCount,
  resetUnseenCount,
} = loginSlice.actions;

// ✅ Export reducer
export default loginSlice.reducer;
