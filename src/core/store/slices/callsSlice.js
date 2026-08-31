// src/core/store/slices/callsSlice.js — Session 14, Upgrade 2
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeCall: null,   // { id, name, type, color, status, startedAt }
  incomingCall: null, // { id, name, type, avatar, status }
  callHistory: [],
  callLink: null,
};

const callsSlice = createSlice({
  name: 'calls',
  initialState,
  reducers: {
    startCall: (state, { payload }) => {
      state.activeCall = { ...payload, status: 'connecting', startedAt: Date.now() };
      state.incomingCall = null;
    },
    receiveCall: (state, { payload }) => {
      state.incomingCall = { ...payload, status: 'incoming' };
    },
    acceptCall: (state) => {
      if (state.incomingCall) {
        state.activeCall = { ...state.incomingCall, status: 'connecting', startedAt: Date.now() };
        state.incomingCall = null;
      }
    },
    declineCall: (state) => {
      state.incomingCall = null;
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

export const { startCall, receiveCall, acceptCall, declineCall, endCall, setCallLink, clearCallHistory, removeCallHistoryEntry } = callsSlice.actions;

export const selectActiveCall   = (state) => state.calls.activeCall;
export const selectIncomingCall = (state) => state.calls.incomingCall;
export const selectCallHistory  = (state) => state.calls.callHistory;
export const selectCallLink     = (state) => state.calls.callLink;

export default callsSlice.reducer;
