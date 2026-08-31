/**
 * settingsSlice.js — RTK slice for settings state.
 *
 * Migrated from the custom store kernel — see PLAN.md, Session 5.
 * Previously, settings mutations lived in `createSettingsActions` inside
 * `settingsUiSlice.js` (which dispatched to the custom `setState` kernel).
 * That factory is removed in this session.
 *
 * State owned here:
 *   - `settings` object (chats / notifications / notificationChoices / privacy)
 *
 * Actions owned here:
 *   - setSetting           — generic: setSetting(category, key, value)
 *   - toggleSetting        — generic: toggleSetting(category, key)
 *   - setChatColor         — shorthand for settings.chats.chatColor
 *   - setChatWallpaper     — shorthand for settings.chats.chatWallpaper
 *
 * RTK uses Immer under the hood, so direct property mutation inside
 * reducers is safe and correct — no spreading needed.
 *
 * Selectors:
 *   - selectSettings              → full settings object
 *   - selectChatSettings          → settings.chats
 *   - selectNotificationSettings  → settings.notifications
 *   - selectPrivacySettings       → settings.privacy
 */
import { createSlice } from '@reduxjs/toolkit';

// ── Initial state ──────────────────────────────────────────────────────────
export const initialState = {
  profile: {
    name:   'Muhammad Nabeel Ijaz',
    about:  'إِيَّاك نَعْبُدُ وَ إِيَّاكَ نَسْتَعِينُ',
    phone:  '+92 304 7662828',
    avatar: 'https://media.licdn.com/dms/image/v2/D4D35AQEo7B-5pOKGjw/profile-framedphoto-shrink_400_400/B4DaBTLml_KkAU-/0/1788101946087?e=1788760800&v=beta&t=dLPyspBgwi_JtqnyQqrUR0CoUI_lcQRK8HEry44tR8Q',
  },
  chats: {
    enterSend:         false,
    mediaVisibility:   true,
    fontSize:          'Medium',
    chatBackupEnabled: false,
    chatColor:         '#00a884',
    chatWallpaper:     null,
  },
  notifications: {
    tones:          true,
    reminders:      true,
    msgPriority:    true,
    msgReaction:    true,
    grpPriority:    true,
    grpReaction:    true,
    statusPriority: true,
    statusReaction: true,
    clearCount:     false,
  },
  notificationChoices: {
    msgTone:       'Default (Bubble)',
    msgVibrate:    'Default',
    msgPopup:      'Not available',
    msgLight:      'White',
    grpTone:       'Default (Bubble)',
    grpVibrate:    'Default',
    grpLight:      'White',
    callRingtone:  'Default (Jovi Lifestyle)',
    callVibrate:   'Default',
    statusTone:    'Default (Bubble)',
    statusVibrate: 'Default',
  },
  privacy: {
    readReceipts:  true,
    cameraEffects: false,
  },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // ── Generic set ───────────────────────────────────────────────────────
    // Usage: dispatch(setSetting('notifications', 'tones', false))
    setSetting: {
      reducer: (state, action) => {
        const { category, key, value } = action.payload;
        if (state[category] !== undefined) {
          state[category][key] = value;
        }
      },
      prepare: (category, key, value) => ({ payload: { category, key, value } }),
    },

    // ── Generic toggle ────────────────────────────────────────────────────
    // Usage: dispatch(toggleSetting('notifications', 'tones'))
    toggleSetting: {
      reducer: (state, action) => {
        const { category, key } = action.payload;
        if (state[category] !== undefined && state[category][key] !== undefined) {
          state[category][key] = !state[category][key];
        }
      },
      prepare: (category, key) => ({ payload: { category, key } }),
    },

    // ── Chat color shorthand ──────────────────────────────────────────────
    setChatColor: (state, action) => {
      state.chats.chatColor = action.payload;
    },

    // ── Chat wallpaper shorthand ──────────────────────────────────────────
    setChatWallpaper: (state, action) => {
      state.chats.chatWallpaper = action.payload;
    },

    // ── Profile update ────────────────────────────────────────────────────
    // Usage: dispatch(setProfile({ name: 'New Name', about: '...', avatar: '...' }))
    setProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },
  },
});

export const {
  setSetting,
  toggleSetting,
  setChatColor,
  setChatWallpaper,
  setProfile,
} = settingsSlice.actions;

// ── Selectors ──────────────────────────────────────────────────────────────
export const selectSettings             = (state) => state.settings;
export const selectChatSettings         = (state) => state.settings.chats;
export const selectNotificationSettings = (state) => state.settings.notifications;
export const selectPrivacySettings      = (state) => state.settings.privacy;
export const selectProfile              = (state) => state.settings.profile;

export default settingsSlice.reducer;
