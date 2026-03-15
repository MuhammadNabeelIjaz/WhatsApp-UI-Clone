// src/core/store/store.js — Redux Toolkit store configuration
//
// Migration status (see PLAN.md):
//   Session 0: store created with a temporary placeholder reducer (not consumed yet)
//   Session 1: `ui` slice (toast, searchQuery, lists) registered — first slice live
//   Session 2: `contacts` slice registered — contacts array now owned by RTK
//   Session 3: `channels` slice registered — channels array now owned by RTK
//   Session 4: `communities` slice registered — communities array now owned by RTK
//   Session 5: `settings` slice registered — settings object now owned by RTK
//   Session 6A+6B: `chats` slice registered — chats, activeChat, starredMessages now RTK
//
// The custom reactive store kernel in `index.js` now owns only:
//   calls, linkedDevices — placeholders never populated in this phase

import { configureStore } from '@reduxjs/toolkit';
import uiReducer        from './slices/uiSlice';
import contactReducer   from './slices/contactSlice';
import channelReducer   from './slices/channelSlice';
import communityReducer from './slices/communitySlice';
import settingsReducer  from './slices/settingsSlice';
import chatReducer      from './slices/chatSlice';
import statusReducer        from './slices/statusSlice';
import linkedDevicesReducer from './slices/linkedDevicesSlice';
import callsReducer         from './slices/callsSlice';

export const reduxStore = configureStore({
  reducer: {
    ui:            uiReducer,
    contacts:      contactReducer,
    channels:      channelReducer,
    communities:   communityReducer,
    settings:      settingsReducer,
    chats:         chatReducer,
    statuses:      statusReducer,
    linkedDevices: linkedDevicesReducer,
    calls:         callsReducer,
  },
});

export default reduxStore;
