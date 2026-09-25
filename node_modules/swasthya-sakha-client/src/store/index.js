import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import uiReducer from "./uiSlice";
import healthReducer from "./healthSlice";
export const store = configureStore({
  reducer: { auth: authReducer, ui: uiReducer, health: healthReducer },
});
