// src/core/store/slices/callsSlice.js — Session 14, Upgrade 2
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeCall: null,   // { id, name, type, color, status, startedAt }
  callHistory: [],
  callLink: null,
};

const callsSlice = createSlice({
  name: 'calls',
  initialState,
  reducers: {
    startCall: (state, { payload }) => {
      state.activeCall = { ...payload, status: 'connecting', startedAt: Date.now() };
    },
    endCall: (state) => {
      if (state.activeCall) {
        state.callHistory.unshift({
          ...state.activeCall,
          endedAt: Date.now(),
          duration: Date.now() - state.activeCall.startedAt,
        });
      }
      state.activeCall = null;
    },
    setCallLink: (state, { payload }) => { state.callLink = payload; },
    clearCallHistory: (state) => { state.callHistory = []; },
    removeCallHistoryEntry: (state, { payload }) => {
      state.callHistory = state.callHistory.filter((c) => c.startedAt !== payload);
    },
  },
});

export const { startCall, endCall, setCallLink, clearCallHistory, removeCallHistoryEntry } = callsSlice.actions;

export const selectActiveCall  = (state) => state.calls.activeCall;
export const selectCallHistory = (state) => state.calls.callHistory;
export const selectCallLink    = (state) => state.calls.callLink;

export default callsSlice.reducer;
