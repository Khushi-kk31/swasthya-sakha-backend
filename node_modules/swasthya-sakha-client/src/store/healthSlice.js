import { createSlice } from "@reduxjs/toolkit";
const initial = {
  facilities: [],
  medicines: [],
  diagnostics: [],
  appointments: [],
  loaded: false,
};
const slice = createSlice({
  name: "health",
  initialState: initial,
  reducers: {
    setHealthData: (s, a) => Object.assign(s, a.payload, { loaded: true }),
    addAppointment: (s, a) => s.appointments.push(a.payload),
  },
});
export const { setHealthData, addAppointment } = slice.actions;
export default slice.reducer;
