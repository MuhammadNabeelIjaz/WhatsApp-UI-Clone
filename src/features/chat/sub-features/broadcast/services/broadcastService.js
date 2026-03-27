// src/features/chat/sub-features/broadcast/services/broadcastService.js
import { getContacts } from '@core/api/contactService';
import { sendMessage } from '@core/api/chatService';

export const loadBroadcastContacts = () => getContacts();
export const sendBroadcastMessage = (recipientIds, message) =>
    Promise.all(recipientIds.map(id => sendMessage(id, message)));
