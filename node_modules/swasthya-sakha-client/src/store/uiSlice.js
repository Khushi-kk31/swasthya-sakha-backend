import {createSlice} from '@reduxjs/toolkit';
const slice=createSlice({name:'ui',initialState:{sidebarOpen:true,toast:null},reducers:{toggleSidebar:s=>{s.sidebarOpen=!s.sidebarOpen},setToast:(s,a)=>{s.toast=a.payload}}});
export const {toggleSidebar,setToast}=slice.actions;export default slice.reducer;
