/**
 * communitySlice.js — RTK slice for community state.
 *
 * Migrated from the custom store kernel — see PLAN.md, Session 4.
 * Previously the community actions lived in `createCommunityActions` inside
 * `channelCommunitySlice.js` (which dispatched to the custom `setState` kernel).
 * That factory is removed in this session.
 *
 * State owned here:
 *   - `communities` array (items)
 *
 * Actions owned here:
 *   - addCommunityItem     — pure reducer; full object built in index.js thunk
 *   - updateCommunity
 *   - addCommunityMembers
 *   - addCommunityGroup
 *
 * Cross-slice note (TEMPORARY — see PLAN.md Session 4):
 *   `addCommunity` must also prepend two entries to the `chats` array
 *   (a community chat + an announcement chat). While `chats` still lives in
 *   the custom store kernel, the thunk wrapper in `src/core/store/index.js`
 *   handles this by calling the legacy `setState` for the chats mutation.
 *   The reducer here handles only the `communities` mutation (pure).
 *   This bridge is removed in Session 6A when chatSlice migrates.
 *
 *   `addCommunity` returns the new community object so callers (navigation
 *   handlers) can immediately use it — the thunk wrapper in index.js
 *   re-implements this return via a shared payload variable.
 */
import { createSlice } from '@reduxjs/toolkit';
import { COMMUNITIES_DATA } from '@core/data/communities';
import logger from '@core/utils/logger';
import { prependChats } from './chatSlice';

// ── Initial state ──────────────────────────────────────────────────────────
export const initialState = {
  items: [...COMMUNITIES_DATA],
};

const communitySlice = createSlice({
  name: 'communities',
  initialState,
  reducers: {
    // ── Add community ──────────────────────────────────────────────────────
    // The reducer receives a fully-built newCommunity object (constructed in
    // the index.js thunk so the same object can be used for the chats bridge).
    addCommunityItem: (state, action) => {
      state.items.unshift(action.payload);
    },

    // ── Update community ───────────────────────────────────────────────────
    updateCommunity: {
      reducer: (state, action) => {
        const { communityId, changes } = action.payload;
        logger.event('Store', 'update_community', { communityId, changes });
        const community = state.items.find(c => c.id === communityId);
        if (community) Object.assign(community, changes);
      },
      prepare: (communityId, changes) => ({ payload: { communityId, changes } }),
    },

    // ── Add members ────────────────────────────────────────────────────────
    addCommunityMembers: {
      reducer: (state, action) => {
        const { communityId, contactIds } = action.payload;
        if (!contactIds?.length) return;
        const community = state.items.find(c => c.id === communityId);
        if (!community) return;
        const existingIds  = new Set((community.members || []).map(m => m.contactId));
        const addedMembers = contactIds
          .filter(id => !existingIds.has(id))
          .map(id => ({ contactId: id, role: 'Member' }));
        community.members = [...(community.members || []), ...addedMembers];
        community.memberCount = community.members.length;
      },
      prepare: (communityId, contactIds) => ({ payload: { communityId, contactIds } }),
    },

    // ── Add sub-group ──────────────────────────────────────────────────────
    addCommunityGroup: {
      reducer: (state, action) => {
        const { communityId, newGroup } = action.payload;
        if (!newGroup) return;
        const community = state.items.find(c => c.id === communityId);
        if (community) {
          community.subGroups = [...(community.subGroups || []), newGroup];
        }
      },
      prepare: (communityId, group) => {
        if (!group?.name?.trim()) return { payload: { communityId, newGroup: null } };
        return {
          payload: {
            communityId,
            newGroup: {
              id:      `cg-${Date.now()}`,
              name:    group.name.trim(),
              type:    group.type  || 'group',
              lastMsg: group.lastMsg || 'Group created',
              time:    group.time    || 'Now',
              image:   group.image   || null,
            },
          },
        };
      },
    },
  },
});

export const {
  addCommunityItem,
  updateCommunity,
  addCommunityMembers,
  addCommunityGroup,
} = communitySlice.actions;

// ── Selectors ──────────────────────────────────────────────────────────────
export const selectCommunities    = (state) => state.communities.items;
export const selectCommunityById  = (state, id) => state.communities.items.find(c => c.id === id);
export const selectMyCommunities  = (state) => state.communities.items.filter(c => c.createdByMe);

// ── Cross-slice thunk (Session 9) ─────────────────────────────────────────
// Replaces the addCommunity wrapper in index.js.
// Dispatches to communitySlice (addCommunityItem) + chatSlice (prependChats).
// Returns the new community object so callers can use it immediately.
export const addCommunityThunk = (community) => (dispatch) => {
  const id             = `comm-${Date.now()}`;
  const announcementId = `${id}-ann`;
  const announcementSubGroup = {
    id: announcementId, name: 'Announcements', type: 'announcement',
    lastMsg: 'Welcome to the community!', time: 'Now',
  };
  const extraGroups  = (community.subGroups || []).filter(sg => sg.name !== 'Announcements');
  const allSubGroups = [announcementSubGroup, ...extraGroups];

  const newCommunity = {
    ...community, id,
    description: community.description || '',
    image: community.image ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(community.name)}&background=00a884&color=fff&size=128`,
    subGroups:   allSubGroups,
    createdAt:   Date.now(),
    createdByMe: true,
    members: [
      { contactId: 'me', role: 'Community Owner', isMe: true },
      ...(community.members || []).filter(m => m.contactId !== 'me'),
    ],
    inviteLink: `https://chat.whatsapp.com/${Math.random().toString(36).substring(2, 18)}`,
  };

  dispatch(addCommunityItem(newCommunity));

  const communityChat = {
    id, type: 'community', name: community.name,
    avatar: newCommunity.image,
    initials: (community.name || 'CM').slice(0, 2).toUpperCase(),
    avatarColor: '#00a884',
    lastMessage: { text: '📢 Announcements group created', time: 'Now', from: 'you' },
    unreadCount: 0, isPinned: false, isArchived: false,
    isMuted: false, isLocked: false, isBlocked: false,
    isGroup: true, isCommunity: true, isFavorite: false,
    time: 'Now', status: 'sent', communityId: id,
  };
  const announcementChat = {
    id: announcementId, type: 'announcement',
    name: `${community.name} – Announcements`,
    avatar: newCommunity.image, initials: 'AN', avatarColor: '#00a884',
    lastMessage: { text: 'Welcome to the community!', time: 'Now', from: 'Admin' },
    unreadCount: 1, isPinned: false, isArchived: false,
    isMuted: false, isLocked: false, isBlocked: false,
    isGroup: true, isCommunityAnnouncement: true, isFavorite: false,
    time: 'Now', status: 'delivered', communityId: id,
  };
  logger.event('Store', 'add_community', { id, name: community.name, subGroups: allSubGroups.length });
  dispatch(prependChats([communityChat, announcementChat]));

  return newCommunity;
};

export default communitySlice.reducer;
