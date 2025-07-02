import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./ReducSlice";

export const store = configureStore({
  reducer: {
    login: loginReducer,
  }
});