// src/features/chat/index.js — Public API
// External consumers import ONLY from here — NEVER from sub-paths directly

// ── Sub-feature exports ──
export { ChatDetail }          from './sub-features/direct-chat';
export { NewGroupScreen,
         SelectContactScreen } from './sub-features/group-chat';
export { NewBroadcastScreen,
         BroadcastInfo }       from './sub-features/broadcast';

// ── Top-level chat components ──
export { default as ChatListItem }        from './components/ChatListItem';
export { default as UserInfoPanel }       from './pages/UserInfoPanel';
export { default as WelcomeScreen }       from './pages/WelcomeScreen';
export { default as MediaGalleryScreen }  from './pages/MediaGalleryScreen';

// ── Panel components ──
export { default as StarredMessages }     from './components/panels/StarredMessages';
export { default as MediaLinksDocsPanel } from './components/MediaLinksDocsPanel';
export { default as SendToScreen }        from './components/SendToScreen';
export { default as NewListScreen }       from './components/panels/NewListScreen';
