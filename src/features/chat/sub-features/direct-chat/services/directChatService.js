// src/features/chat/sub-features/direct-chat/services/directChatService.js
// Delegates to core API — direct chat specific logic goes here
import { getMessages, sendMessage } from '@core/api/chatService';

export const loadDirectMessages = (chatId) => getMessages(chatId);
export const sendDirectMessage = (chatId, message) => sendMessage(chatId, message);
