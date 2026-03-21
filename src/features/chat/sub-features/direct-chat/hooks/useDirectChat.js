// src/features/chat/sub-features/direct-chat/hooks/useDirectChat.js
// Hook for direct (1-on-1) chat logic
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectChats } from '@core/store/slices/chatSlice';
import { getMessages } from '@core/api/chatService';

export const useDirectChat = (chatId) => {
    const chats = useSelector(selectChats);
    const chat = chats.find(c => c.id === chatId) || null;

    const loadMessages = useCallback(() => {
        return getMessages(chatId);
    }, [chatId]);

    return { chat, loadMessages };
};

export default useDirectChat;
