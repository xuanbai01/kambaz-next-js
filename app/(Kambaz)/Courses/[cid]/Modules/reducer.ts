import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  modules: [] as any[],
};

const modulesSlice = createSlice({
  name: "modules",
  initialState,
  reducers: {
    setModules: (state, action) => {
      state.modules = action.payload;
    },
    addModule: (state, { payload: module }) => {
      state.modules = [...state.modules, module];
    },
    deleteModule: (state, { payload: moduleId }) => {
      state.modules = state.modules.filter((m: any) => m._id !== moduleId);
    },
    updateModule: (state, { payload: module }) => {
      state.modules = state.modules.map((m: any) =>
        m._id === module._id ? module : m
      );
    },
    editModule: (state, { payload: moduleId }) => {
      state.modules = state.modules.map((m: any) =>
        m._id === moduleId ? { ...m, editing: true } : m
      );
    },
  },
});

export const {
  addModule,
  deleteModule,
  updateModule,
  editModule,
  setModules,
} = modulesSlice.actions;

export default modulesSlice.reducer;