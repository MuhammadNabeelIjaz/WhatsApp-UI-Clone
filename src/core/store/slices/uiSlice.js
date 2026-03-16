/**
 * uiSlice.js — RTK slice for UI-only state: toast notifications, the (currently
 * unused-by-actions) search query, and chat filter "lists" (the preset
 * All/Unread/Favorites/Groups chips plus any user-created custom lists).
 *
 * Migrated from the custom store kernel — see PLAN.md, Session 1.
 * Previously:
 *   - `toast` + `showToast` / `clearToast` lived in `settingsUiSlice.js` (createUiActions)
 *   - `searchQuery` lived directly in the store kernel's initial state (unused)
 *   - `lists` + `setLists` / `addList` / `removeList` / `reorderLists` / `addChatToLists`
 *     lived in `chatSlice.js` (createChatActions)
 *
 * Action names are preserved exactly for backward compatibility — see the
 * `actions` composition in `src/core/store/index.js`.
 */
import { createSlice } from '@reduxjs/toolkit';
import logger from '@core/utils/logger';

export const initialState = {
  toast: null,
  searchQuery: '', // [C-04] — declared in types/store.js; not currently set by any action
  lists: [
    { id: 'all',        label: 'All',        name: 'All',        subtitle: 'Preset', preset: true  },
    { id: 'unread',     label: 'Unread',     name: 'Unread',     subtitle: 'Preset', preset: true  },
    { id: 'favorites',  label: 'Favorites',  name: 'Favorites',  subtitle: 'Preset', preset: true  },
    { id: 'groups',     label: 'Groups',     name: 'Groups',     subtitle: 'Preset', preset: true  },
  ],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // ── Toast ──────────────────────────────────────────────────────────────
    setToast: (state, action) => {
      state.toast = action.payload;
    },
    clearToast: (state) => {
      state.toast = null;
    },

    // ── Search query (carried over for shape parity; no current writers) ───
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },

    // ── Lists ────────────────────────────────────────────────────────────
    setLists: (state, action) => {
      state.lists = action.payload;
    },
    addList: {
      reducer: (state, action) => {
        state.lists.push(action.payload);
      },
      prepare: (name, chatIds = []) => {
        const subtitle = chatIds.length > 0
          ? `${chatIds.length} chat${chatIds.length > 1 ? 's' : ''}`
          : 'No chats yet';
        return {
          payload: {
            id: `list-${Date.now()}`,
            label: name,
            name,
            subtitle,
            preset: false,
            chatIds,
          },
        };
      },
    },
    removeList: (state, action) => {
      state.lists = state.lists.filter(l => l.id !== action.payload);
    },
    reorderLists: (state, action) => {
      state.lists = action.payload;
    },
    addChatToLists: (state, action) => {
      const { chatId, listIds } = action.payload;
      state.lists = state.lists.map(l => {
        if (l.preset) return l;
        const inList = l.chatIds?.includes(chatId) || false;
        const shouldBeIn = listIds.includes(l.id);
        if (inList === shouldBeIn) return l;
        const newChatIds = shouldBeIn
          ? [...(l.chatIds || []), chatId]
          : (l.chatIds || []).filter(id => id !== chatId);
        return {
          ...l,
          chatIds: newChatIds,
          subtitle: newChatIds.length > 0 ? `${newChatIds.length} chat${newChatIds.length > 1 ? 's' : ''}` : 'No chats yet',
        };
      });
    },
  },
});

export const {
  setToast,
  clearToast,
  setSearchQuery,
  setLists,
  addList,
  removeList,
  reorderLists,
  addChatToLists,
} = uiSlice.actions;

/**
 * showToast — thunk action creator (preserves original setTimeout auto-dismiss).
 *
 * The reducer (`setToast`) stays pure; the side effect (the dismiss timer) lives
 * here, exactly as documented in PLAN.md Risk M-2.
 *
 * Usage: dispatch(showToast('Archived'))
 *        dispatch(showToast('Switch account feature coming soon', 'info'))
 */
export const showToast = (message, type = 'info', duration = 3000) => (dispatch) => {
  logger.info('Store', `toast: ${message}`, { type });
  dispatch(setToast({ message, type, id: Date.now() }));
  setTimeout(() => dispatch(clearToast()), duration);
};

// ── Selectors ────────────────────────────────────────────────────────────
export const selectToast       = (state) => state.ui.toast;
export const selectSearchQuery = (state) => state.ui.searchQuery;
export const selectLists       = (state) => state.ui.lists;

export default uiSlice.reducer;
