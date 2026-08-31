/**
 * chatSlice.js — RTK slice for chat & starred-messages state.
 *
 * Migrated from the custom store kernel — see PLAN.md, Session 6A + 6B.
 * Previously the chat actions lived in the `createChatActions` factory
 * function in this same file, dispatching to the custom `setState` kernel.
 * That factory is removed in this session; the backward-compat wrapper in
 * `src/core/store/index.js` now dispatches to these RTK actions instead.
 *
 * State owned here:
 *   - `items`           — Chat[]           — the full chat list
 *   - `activeChat`      — Chat | null      — currently open chat
 *   - `starredMessages` — StarredMessage[] — starred message records
 *
 * Actions (Session 6A — core chat CRUD):
 *   - markAsRead, markAsUnread
 *   - muteChat, unmuteChat
 *   - archiveChat, unarchiveChat
 *   - pinChat, lockChat, deleteChat
 *   - setActiveChat
 *   - toggleChatFavorite
 *   - mirrorContactBlock      — cross-slice bridge for blockContact
 *   - mirrorContactUpdate     — cross-slice bridge for updateContact
 *   - prependChats            — used by addCommunity thunk (Session 6A cleanup)
 *
 * Actions (Session 6B — extended):
 *   - addGroupChat
 *   - addBroadcastChat
 *   - starMessage, unstarMessage
 *
 * Cross-slice cleanup (Session 6A):
 *   The TEMPORARY `setState` calls in index.js for blockContact, unblockContact,
 *   updateContact (Sessions 2 bridge), and addCommunity (Session 4 bridge) are
 *   removed here and replaced with proper RTK reducer calls.
 *
 *   blockContact / unblockContact → dispatch mirrorContactBlock({ cId, isBlocked })
 *   updateContact                 → dispatch mirrorContactUpdate({ id, updates })
 *   addCommunity thunk            → dispatch prependChats([communityChat, announcementChat])
 *
 * Selectors (co-located per PLAN.md §4.4):
 *   - selectChats              → all chats
 *   - selectActiveChats        → !isArchived && !isLocked
 *   - selectArchivedChats      → isArchived
 *   - selectLockedChats        → isLocked
 *   - selectPinnedChats        → isPinned
 *   - selectGroupChats         → isGroup && !isArchived
 *   - selectChatById           → (state, id) → find
 *   - selectActiveChat         → currently open chat
 *   - selectStarredMessages    → all starred
 *   - selectStarredByChat      → (state, chatId) → filtered
 */
import { createSlice, createSelector } from '@reduxjs/toolkit';
import { chats as initialChats } from '@core/data/chats';
import logger from '@core/utils/logger';

// ── Initial state ──────────────────────────────────────────────────────────
export const initialState = {
  items:          [...initialChats],
  activeChat:     null,
  starredMessages: [],
};

const chatSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    // ── Receive incoming message (Upgrade 4E: notification hook point) ─────
    receiveMessage: (state, action) => {
      const { chatId, message } = action.payload;
      const chat = state.items.find(c => c.id === chatId);
      if (chat) {
        chat.lastMessage = { text: message.text || '', time: message.time || 'Now', from: chatId };
        if (state.activeChat?.id !== chatId) {
          chat.unreadCount = (chat.unreadCount || 0) + 1;
        }
      }
    },


    markAsRead: (state, action) => {
      const chatId = action.payload;
      const chat = state.items.find(c => c.id === chatId);
      if (chat) {
        chat.unreadCount = 0;
        chat.isManuallyUnread = false;
      }
    },

    markAsUnread: (state, action) => {
      const chatId = action.payload;
      const chat = state.items.find(c => c.id === chatId);
      if (chat) chat.isManuallyUnread = true;
    },

    // ── Mute / unmute ─────────────────────────────────────────────────────
    muteChat: {
      reducer: (state, action) => {
        const { chatId, until } = action.payload;
        const chat = state.items.find(c => c.id === chatId);
        if (chat) {
          chat.isMuted   = true;
          chat.mutedUntil = until;
        }
      },
      prepare: (chatId, until = null) => ({ payload: { chatId, until } }),
    },

    unmuteChat: (state, action) => {
      const chatId = action.payload;
      const chat = state.items.find(c => c.id === chatId);
      if (chat) {
        chat.isMuted    = false;
        chat.mutedUntil = null;
      }
    },

    // ── Archive / unarchive ───────────────────────────────────────────────
    archiveChat: (state, action) => {
      const chatId = action.payload;
      const chat = state.items.find(c => c.id === chatId);
      if (chat) {
        chat.isArchived = true;
        chat.isPinned   = false; // archiving unpins
      }
    },

    unarchiveChat: (state, action) => {
      const chatId = action.payload;
      const chat = state.items.find(c => c.id === chatId);
      if (chat) chat.isArchived = false;
    },

    // ── Pin ───────────────────────────────────────────────────────────────
    pinChat: (state, action) => {
      const chatId = action.payload;
      const chat = state.items.find(c => c.id === chatId);
      if (chat) chat.isPinned = !chat.isPinned;
    },

    // ── Lock ──────────────────────────────────────────────────────────────
    lockChat: (state, action) => {
      const chatId = action.payload;
      const chat = state.items.find(c => c.id === chatId);
      if (chat) chat.isLocked = !chat.isLocked;
    },

    // ── Delete ────────────────────────────────────────────────────────────
    deleteChat: (state, action) => {
      const chatId = action.payload;
      logger.event('Store', 'delete_chat', { chatId });
      state.items = state.items.filter(c => c.id !== chatId);
    },

    // ── Active chat ───────────────────────────────────────────────────────
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
      if (action.payload) {
        const chat = state.items.find(c => c.id === action.payload);
        if (chat) {
          chat.unreadCount = 0;
          chat.hasMention = false;
        }
      }
    },

    // ── Favorite ──────────────────────────────────────────────────────────
    toggleChatFavorite: (state, action) => {
      const chatId = action.payload;
      const chat = state.items.find(c => c.id === chatId);
      if (chat) chat.isFavorite = !chat.isFavorite;
    },

    // ── Cross-slice: contact block mirror ─────────────────────────────────
    // Dispatched from index.js blockContact / unblockContact thunk wrappers.
    // Removes the TEMPORARY setState bridge from Session 2.
    mirrorContactBlock: {
      reducer: (state, action) => {
        const { cId, isBlocked } = action.payload;
        state.items.forEach(chat => {
          if (chat.contactId === cId) chat.isBlocked = isBlocked;
        });
      },
      prepare: (cId, isBlocked) => ({ payload: { cId, isBlocked } }),
    },

    // ── Cross-slice: contact update mirror ────────────────────────────────
    // Dispatched from index.js updateContact thunk wrapper.
    // Removes the TEMPORARY setState bridge from Session 2.
    mirrorContactUpdate: {
      reducer: (state, action) => {
        const { id, updates } = action.payload;
        state.items.forEach(chat => {
          if (chat.contactId === id || chat.id === id) {
            if (updates.name)   chat.name   = updates.name;
            if (updates.avatar) chat.avatar = updates.avatar;
          }
        });
      },
      prepare: (id, updates) => ({ payload: { id, updates } }),
    },

    // ── Cross-slice: prepend chats (addCommunity bridge cleanup) ──────────
    // Dispatched from index.js addCommunity thunk.
    // Removes the TEMPORARY setState bridge from Session 4.
    prependChats: (state, action) => {
      // action.payload is an array of chat objects to prepend
      state.items = [...action.payload, ...state.items];
    },

    // ── Session 6B: Add group / broadcast chat ─────────────────────────────
    addGroupChat: {
      reducer: (state, action) => {
        state.items.unshift(action.payload);
      },
      prepare: (contacts, groupName) => {
        const name = groupName?.trim() || contacts.map(c => c.name.split(' ')[0]).join(', ');
        const id   = `group-${Date.now()}`;
        return {
          payload: {
            id, type: 'group', name,
            initials:    name.slice(0, 2).toUpperCase(),
            avatarColor: '#00a884', avatar: null,
            lastMessage: { text: 'Group created', time: 'Now', from: 'you' },
            unreadCount: 0, isPinned: false, isArchived: false,
            isMuted: false, isLocked: false, isBlocked: false,
            isGroup: true, isFavorite: false,
            members: contacts, memberCount: contacts.length + 1,
            time: 'Now', status: 'sent',
          },
        };
      },
    },

    addBroadcastChat: {
      reducer: (state, action) => {
        state.items.unshift(action.payload);
      },
      // prepare receives (contacts, name) where contacts is an array of
      // contact objects (already resolved by the index.js thunk wrapper).
      prepare: (members, chatName, id) => ({
        payload: {
          id, type: 'broadcast', name: chatName,
          initials: 'BC', avatarColor: '#f57c00', avatar: null,
          lastMessage: { text: `Broadcast to ${members.length} contacts`, time: 'Now', from: 'you' },
          unreadCount: 0, isPinned: false, isArchived: false,
          isMuted: false, isLocked: false, isBlocked: false,
          isGroup: false, isBroadcast: true, isFavorite: false,
          members, memberCount: members.length,
          time: 'Now', status: 'sent',
        },
      }),
    },

    // ── Session 6B: Star / unstar messages ────────────────────────────────
    starMessage: {
      reducer: (state, action) => {
        const item = action.payload;
        // Deduplicate by id
        state.starredMessages = [
          ...state.starredMessages.filter(s => s.id !== item.id),
          item,
        ];
      },
      prepare: (chat, message) => {
        const messageId  = message?.id;
        const id         = `${chat.id}:${messageId}`;
        const previewText =
          message.props?.text    ||
          message.props?.caption ||
          message.props?.message ||
          message.props?.name    ||
          'Starred message';
        const senderName = message.props?.sender ||
          (message.align === 'right' ? 'You' : chat.name);
        return {
          payload: {
            id, chatId: chat.id, messageId,
            chatName:    chat.name,
            chatAvatar:  chat.avatar,
            time:        message.props?.time || 'Now',
            text:        previewText,
            senderName,
            messageType: message.type,
            isMine:      message.align === 'right',
            chatType:    chat.type || 'chat',
          },
        };
      },
    },

    unstarMessage: {
      reducer: (state, action) => {
        const { chatId, messageId } = action.payload;
        const id = `${chatId}:${messageId}`;
        state.starredMessages = state.starredMessages.filter(item => item.id !== id);
      },
      prepare: (chatId, messageId) => ({ payload: { chatId, messageId } }),
    },
  },
});

export const {
  markAsRead,
  markAsUnread,
  receiveMessage,
  muteChat,
  unmuteChat,
  archiveChat,
  unarchiveChat,
  pinChat,
  lockChat,
  deleteChat,
  setActiveChat,
  toggleChatFavorite,
  mirrorContactBlock,
  mirrorContactUpdate,
  prependChats,
  addGroupChat,
  addBroadcastChat,
  starMessage,
  unstarMessage,
} = chatSlice.actions;

// ── Selectors ──────────────────────────────────────────────────────────────
export const selectChats           = (state) => state.chats.items;
export const selectActiveChats     = (state) => state.chats.items.filter(c => !c.isArchived && !c.isLocked);
export const selectArchivedChats   = (state) => state.chats.items.filter(c => c.isArchived);
export const selectLockedChats     = (state) => state.chats.items.filter(c => c.isLocked);
export const selectPinnedChats     = (state) => state.chats.items.filter(c => c.isPinned);
export const selectGroupChats      = (state) => state.chats.items.filter(c => c.isGroup && !c.isArchived);
export const selectChatById        = (state, id) => state.chats.items.find(c => c.id === id);
export const selectActiveChat      = (state) => state.chats.activeChat;
export const selectStarredMessages = (state) => state.chats.starredMessages;
export const selectStarredByChat   = (state, chatId) =>
  state.chats.starredMessages.filter(item => item.chatId === chatId);

// ── Memoized search selector — runs on FULL dataset, never component-local ──
const _selectAllChats     = (state) => state.chats.items;
const _selectSearchQuery  = (state) => state.ui?.searchQuery || '';

export const selectFilteredChats = createSelector(
  [_selectAllChats, _selectSearchQuery],
  (chats, query) => {
    const q = query.toLowerCase().trim();
    const visible = chats.filter(chat => {
      if (chat.isArchived || chat.isLocked) return false;
      if (!q) return true;
      const name = (chat.name || '').toLowerCase();
      const msg  = typeof chat.lastMessage === 'string'
        ? chat.lastMessage.toLowerCase()
        : (chat.lastMessage?.text || '').toLowerCase();
      return name.includes(q) || msg.includes(q);
    });
    return [
      ...visible.filter(c => c.isPinned),
      ...visible.filter(c => !c.isPinned),
    ];
  }
);

// ── Cross-slice thunk (Session 9) ─────────────────────────────────────────
// Replaces the addBroadcastChat wrapper in index.js.
// Resolves contactIds → contact objects, then dispatches addBroadcastChat.
// Returns the new chat object (via action.payload) so callers can use it.
export const addBroadcastChatThunk = (contactIds, name) => (dispatch, getState) => {
  const allContacts = getState().contacts.items;
  const members     = contactIds.map(id => allContacts.find(c => c.id === id)).filter(Boolean);
  const chatName    = name || `Broadcast (${members.length})`;
  const id          = `broadcast-${Date.now()}`;
  const action      = dispatch(addBroadcastChat(members, chatName, id));
  return action.payload;
};

export default chatSlice.reducer;

// ── receiveMessageThunk (Session 14, Upgrade 4E) ────────────────────────────
// Single entry point for incoming messages (future WebSocket/REST hook).
// Updates chat state via receiveMessage, then fires a browser notification
// if settings.notifications.msgPriority is enabled and permission granted.
export const receiveMessageThunk = (chatId, message) => (dispatch, getState) => {
  dispatch(receiveMessage({ chatId, message }));
  const state = getState();
  const chat = state.chats.items.find(c => c.id === chatId);
  const { notifications } = state.settings;
  if (chat && !chat.isMuted && notifications?.msgPriority) {
    import('@core/utils/notificationService').then(({ notifyNewMessage }) => {
      notifyNewMessage(chat, message.text || '');
    });
  }
};
