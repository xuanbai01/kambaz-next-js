import { createSlice } from "@reduxjs/toolkit";
import { assignments as seed } from "../../../Database";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  assignments: seed,
};

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    addAssignment: (state, { payload: a }) => {
      const doc: any = { _id: uuidv4(), ...a };
      state.assignments = [...state.assignments, doc] as any;
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

export const { addAssignment, updateAssignment, deleteAssignment } =
  assignmentsSlice.actions;
export default assignmentsSlice.reducer;
