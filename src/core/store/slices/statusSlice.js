/**
 * statusSlice.js — RTK slice for the Status/Updates feature.
 *
 * State owned here:
 *   - `items`             — contacts' status updates (with per-user seenCount)
 *   - `myStatuses`        — the current user's posted statuses (text or media)
 *   - `myStatusSeenCount` — how many of `myStatuses` have been viewed in the player
 *
 * Previously this state lived as local `useState` inside `StatusScreen`, which
 * meant "My Status" entries were lost on remount/navigation. Moving it into
 * Redux makes status posting/viewing persist for the lifetime of the app,
 * consistent with the rest of the application's state management.
 *
 * Actions owned here:
 *   - postTextStatus, postMediaStatus, deleteAllMyStatuses
 *   - updateSeenCount (for both "me" and contacts' statuses)
 */
import { createSlice } from '@reduxjs/toolkit';
import { contactStatuses } from '@core/data/statuses';

// ── Initial state ──────────────────────────────────────────────────────────
export const initialState = {
  items:             [...contactStatuses],
  myStatuses:        [],
  myStatusSeenCount: 0,
};

const statusSlice = createSlice({
  name: 'statuses',
  initialState,
  reducers: {
    // ── Post a new text status ──────────────────────────────────────────────
    postTextStatus: {
      reducer: (state, action) => {
        state.myStatuses.push(action.payload);
        // A freshly-posted status should appear "unseen" so the ring shows again.
        state.myStatusSeenCount = 0;
      },
      prepare: (content, bgColor) => ({
        payload: {
          id: `my-${Date.now()}`,
          type: 'text',
          content,
          bgColor,
          timestamp: Date.now(),
        },
      }),
    },

    // ── Post a new media (image/video) status ───────────────────────────────
    postMediaStatus: {
      reducer: (state, action) => {
        state.myStatuses.push(action.payload);
        state.myStatusSeenCount = 0;
      },
      prepare: (mediaType, url) => ({
        payload: {
          id: `my-${Date.now()}`,
          type: 'media',
          mediaType,
          url,
          timestamp: Date.now(),
        },
      }),
    },

    // ── Delete all of my statuses ───────────────────────────────────────────
    deleteAllMyStatuses: (state) => {
      state.myStatuses = [];
      state.myStatusSeenCount = 0;
    },

    // ── Update seen count (for "me" or a contact's status) ──────────────────
    updateSeenCount: (state, action) => {
      const { userId, seenCount } = action.payload;
      if (userId === 'me') {
        state.myStatusSeenCount = Math.max(state.myStatusSeenCount, seenCount);
        return;
      }
      const user = state.items.find((u) => u.id === userId);
      if (user) user.seenCount = Math.max(user.seenCount, seenCount);
    },
  },
});

export const {
  postTextStatus,
  postMediaStatus,
  deleteAllMyStatuses,
  updateSeenCount,
} = statusSlice.actions;

// ── Selectors ──────────────────────────────────────────────────────────────
export const selectContactStatuses  = (state) => state.statuses.items;
export const selectMyStatuses       = (state) => state.statuses.myStatuses;
export const selectMyStatusSeenCount = (state) => state.statuses.myStatusSeenCount;

export default statusSlice.reducer;
