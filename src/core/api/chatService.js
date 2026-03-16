// src/core/api/chatService.js
// Mock layer — returns promise-wrapped local data.
// Backend ready: replace Promise.resolve() with axios/fetch calls.
// No component changes needed when backend is connected.

import { INITIAL_MESSAGES } from '@core/data/messages';
import { chats }            from '@core/data/chats';
import { contacts }         from '@core/data/contacts';

export const getMessages  = (_chatId)          => Promise.resolve(INITIAL_MESSAGES);
export const getChats     = ()                => Promise.resolve(chats);
export const sendMessage  = (chatId, message) => Promise.resolve({ success: true, message });
export const getContacts  = ()                => Promise.resolve(contacts);
