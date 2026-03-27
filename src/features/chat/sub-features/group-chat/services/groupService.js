// src/features/chat/sub-features/group-chat/services/groupService.js
import { getMessages, sendMessage } from '@core/api/chatService';
import { getContacts } from '@core/api/contactService';

export const loadGroupMessages = (chatId) => getMessages(chatId);
export const sendGroupMessage = (chatId, message) => sendMessage(chatId, message);
export const loadGroupContacts = () => getContacts();
