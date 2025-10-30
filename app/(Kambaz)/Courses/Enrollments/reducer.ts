import { createSlice } from "@reduxjs/toolkit";
import { enrollments as seed } from "../../Database";
import { v4 as uuidv4 } from "uuid";

const initialState = { enrollments: seed };

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    enrollCourse: (state, { payload }) => {
      const { user, course } = payload;
      if (!state.enrollments.some((e: any) => e.user === user && e.course === course)) {
        state.enrollments = [...state.enrollments, { _id: uuidv4(), user, course }] as any;
      }
    },
    unenrollCourse: (state, { payload }) => {
      const { user, course } = payload;
      state.enrollments = state.enrollments.filter((e: any) => !(e.user === user && e.course === course)) as any;
    },
  },
});

export const { enrollCourse, unenrollCourse } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;
