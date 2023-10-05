import { createSlice } from "@reduxjs/toolkit";
import { Mutex } from "async-mutex";

export interface ENSState {
  ensState: { [address: string]: { avatar: string; alias: string; timestamp: number } };
  ensMutex: { [address: string]: Mutex };
}

const ensSlice = createSlice({
  name: "auth",
  initialState: {
    ensState: {},
    ensMutex: {}
  } as ENSState,
  reducers: {
    setENSState(state, action) {
      state.ensState = Object.assign(state.ensState ?? {}, action.payload);
    },
    setENSMutex(state, action) {
      if (!state.ensMutex[Object.keys(action.payload)[0]]) {
        state.ensMutex = Object.assign(state.ensMutex ?? {}, action.payload);
      }
    }
  }
});

export const { setENSState, setENSMutex } = ensSlice.actions;

export const ensReducer = ensSlice.reducer;
