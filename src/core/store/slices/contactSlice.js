/**
 * contactSlice.js — RTK slice for contact state.
 *
 * Migrated from the custom store kernel — see PLAN.md, Session 2.
 * Previously lived in the factory function `createContactActions` in this
 * same file, dispatching to the custom `setState` kernel.
 *
 * State owned here:
 *   - `contacts` array (items)
 *
 * Actions owned here:
 *   - blockContact, unblockContact  — also mirror isBlocked on chats (cross-slice)
 *   - toggleFavoriteContact
 *   - updateContact                 — also mirrors name/avatar on chats (cross-slice)
 *   - addContact
 *
 * Cross-slice note (TEMPORARY — see PLAN.md Session 2):
 *   `blockContact`, `unblockContact`, and `updateContact` also need to mutate
 *   the `chats` array. While `chats` still lives in the custom store kernel,
 *   the thunk wrappers in `src/core/store/index.js` handle the cross-slice
 *   mutation by calling the legacy `setState` for the `chats` part.
 *   This will be cleaned up in Session 5 when `chatSlice` migrates to RTK.
 */
import { createSlice } from '@reduxjs/toolkit';
import { contacts as initialContacts } from '@core/data/contacts';
import logger from '@core/utils/logger';
import { mirrorContactBlock, mirrorContactUpdate } from './chatSlice';

// ── Initial state ──────────────────────────────────────────────────────────
export const initialState = {
  items: [...initialContacts],
};

const contactSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    // ── Block / unblock ────────────────────────────────────────────────────
    blockContact: (state, action) => {
      const cId = action.payload;
      logger.event('Store', 'block_contact', { cId });
      const contact = state.items.find(c => c.id === cId);
      if (contact) contact.isBlocked = true;
    },

    unblockContact: (state, action) => {
      const cId = action.payload;
      logger.event('Store', 'unblock_contact', { cId });
      const contact = state.items.find(c => c.id === cId);
      if (contact) contact.isBlocked = false;
    },

    // ── Favorite ──────────────────────────────────────────────────────────
    toggleFavoriteContact: (state, action) => {
      const cId = action.payload;
      const contact = state.items.find(c => c.id === cId);
      if (contact) contact.isFavorite = !contact.isFavorite;
    },

    // ── Update ────────────────────────────────────────────────────────────
    updateContact: {
      reducer: (state, action) => {
        const { id, updates } = action.payload;
        logger.event('Store', 'update_contact', { id });
        const contact = state.items.find(c => c.id === id);
        if (contact) Object.assign(contact, updates);
      },
      prepare: (id, updates) => ({ payload: { id, updates } }),
    },

    // ── Add ───────────────────────────────────────────────────────────────
    addContact: (state, action) => {
      const contact = action.payload;
      const name     = String(contact.name || '').trim() || 'Unknown';
      const initials = contact.initials ||
        name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
      const id       = contact.id || `c-${Date.now()}`;
      state.items.unshift({
        id,
        name,
        phone:       String(contact.phone || '').trim(),
        avatar:      contact.avatar || null,
        avatarColor: contact.avatarColor || '#6b7280',
        initials,
        about:       contact.about || '',
        isOnline:    false,
        lastSeen:    contact.lastSeen || null,
        isFavorite:  contact.isFavorite || false,
        isBlocked:   contact.isBlocked || false,
        isMuted:     contact.isMuted || false,
        label:       contact.label || null,
      });
    },
  },
});

export const {
  blockContact,
  unblockContact,
  toggleFavoriteContact,
  updateContact,
  addContact,
} = contactSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────────────
export const selectContacts         = (state) => state.contacts.items;
export const selectBlockedContacts  = (state) => state.contacts.items.filter(c => c.isBlocked);
export const selectFavoriteContacts = (state) => state.contacts.items.filter(c => c.isFavorite);
export const selectContactById      = (state, id) => state.contacts.items.find(c => c.id === id);

// ── Cross-slice thunks (Session 9) ────────────────────────────────────────
// These replace the adapter wrappers in index.js that dispatched to both
// contactSlice and chatSlice (mirrorContactBlock / mirrorContactUpdate).
export const blockContactThunk = (cId) => (dispatch) => {
  dispatch(blockContact(cId));
  dispatch(mirrorContactBlock(cId, true));
};

export const unblockContactThunk = (cId) => (dispatch) => {
  dispatch(unblockContact(cId));
  dispatch(mirrorContactBlock(cId, false));
};

export const updateContactThunk = (id, updates) => (dispatch) => {
  dispatch(updateContact(id, updates));
  dispatch(mirrorContactUpdate(id, updates));
};

export default contactSlice.reducer;
