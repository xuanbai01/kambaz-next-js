import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Enrollment = { _id: string; user: string; course: string };

const initialState: { enrollments: Enrollment[] } = {
  enrollments: [],
};

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    setEnrollments: (state, { payload }: PayloadAction<Enrollment[]>) => {
      state.enrollments = payload;
    },
    addEnrollment: (state, { payload }: PayloadAction<Enrollment>) => {
      if (!state.enrollments.some(e => e.user === payload.user && e.course === payload.course)) {
        state.enrollments = [...state.enrollments, payload];
      }
    },
    removeEnrollment: (state, { payload }: PayloadAction<{ user: string; course: string }>) => {
      state.enrollments = state.enrollments.filter(
        (e) => !(e.user === payload.user && e.course === payload.course)
      );
    },
  },
});

export const { setEnrollments, addEnrollment, removeEnrollment } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;
