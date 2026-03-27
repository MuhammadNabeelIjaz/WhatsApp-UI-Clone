// src/features/chat/sub-features/direct-chat/index.js — Public API
export { default as ChatDetail }     from './ChatDetail';
export { default as ForwardPicker }  from './components/ForwardPicker';
export { useDirectChat }             from './hooks/useDirectChat';
// Note: DirectChatHeader removed — duplicate of ChatDetailHeader (dead code)
