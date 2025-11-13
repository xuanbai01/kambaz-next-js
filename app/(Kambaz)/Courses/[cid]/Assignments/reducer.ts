import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  assignments: [] as any[], // empty, we will fetch from server
};

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    setAssignments: (state, { payload }) => {
      state.assignments = payload;
    },
    addAssignment: (state, { payload: a }) => {
      state.assignments = [...state.assignments, a] as any;
    },
    updateAssignment: (state, { payload: a }) => {
      state.assignments = state.assignments.map((x: any) =>
        x._id === a._id ? a : x
      ) as any;
    },
    deleteAssignment: (state, { payload: id }) => {
      state.assignments = state.assignments.filter((x: any) => x._id !== id) as any;
    },
  },
});

export const { setAssignments, addAssignment, updateAssignment, deleteAssignment } =
  assignmentsSlice.actions;
export default assignmentsSlice.reducer;
