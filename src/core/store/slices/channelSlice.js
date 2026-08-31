/**
 * channelSlice.js — RTK slice for channel state.
 *
 * Migrated from the custom store kernel — see PLAN.md, Session 3.
 * Previously the channel actions lived in the `createChannelActions` factory
 * inside `channelCommunitySlice.js` (which dispatched to the custom `setState` kernel).
 * The community actions remain in `channelCommunitySlice.js` until Session 4.
 *
 * State owned here:
 *   - `channels` array (items)
 *
 * Actions owned here:
 *   - followChannel, unfollowChannel, hideChannel
 *   - addChannel
 *   - addChannelPost
 */
import { createSlice } from '@reduxjs/toolkit';
import { channels as initialChannels } from '@core/data/channels';

// ── Initial state ──────────────────────────────────────────────────────────
export const initialState = {
  items: [...initialChannels],
};

const channelSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    // ── Follow / unfollow ──────────────────────────────────────────────────
    followChannel: (state, action) => {
      const channel = state.items.find(c => c.id === action.payload);
      if (channel) channel.isFollowed = true;
    },

    unfollowChannel: (state, action) => {
      const channel = state.items.find(c => c.id === action.payload);
      if (channel) channel.isFollowed = false;
    },

    // ── Hide ───────────────────────────────────────────────────────────────
    hideChannel: (state, action) => {
      const channel = state.items.find(c => c.id === action.payload);
      if (channel) channel.isHidden = true;
    },

    // ── Read ───────────────────────────────────────────────────────────────
    markChannelAsRead: (state, action) => {
      const channel = state.items.find(c => c.id === action.payload);
      if (channel) channel.unreadCount = 0;
    },

    // ── Add ────────────────────────────────────────────────────────────────
    addChannel: (state, action) => {
      const channel = action.payload;
      state.items.unshift({
        ...channel,
        id:            `ch-${Date.now()}`,
        isFollowed:    true,
        isOwner:       true,
        isMuted:       false,
        followerCount: 0,
        unreadCount:   0,
        posts:         [],
        createdAt:     new Date().toLocaleDateString(),
        avatarColor:   channel.avatarColor || '#00a884',
        initials:      channel.initials || (channel.name || '').slice(0, 2).toUpperCase(),
      });
    },

    // ── Add post ───────────────────────────────────────────────────────────
    addChannelPost: {
      reducer: (state, action) => {
        const { channelId, post } = action.payload;
        const channel = state.items.find(c => c.id === channelId);
        if (channel) {
          channel.posts = [...(channel.posts || []), post];
          channel.lastPost = post;
        }
      },
      prepare: (channelId, text) => ({
        payload: {
          channelId,
          post: {
            id:        `post-${Date.now()}`,
            text,
            time:      new Date().toISOString(),
            reactions: {},
          },
        },
      }),
    },
  },
});

export const {
  followChannel,
  unfollowChannel,
  hideChannel,
  markChannelAsRead,
  addChannel,
  addChannelPost,
} = channelSlice.actions;

// ── Selectors ──────────────────────────────────────────────────────────────
export const selectChannels        = (state) => state.channels.items;
export const selectFollowedChannels = (state) => state.channels.items.filter(c => c.isFollowed);
export const selectChannelById     = (state, id) => state.channels.items.find(c => c.id === id);

export default channelSlice.reducer;
