// src/features/chat/sub-features/group-chat/hooks/useGroupChat.js
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectChats } from '@core/store/slices/chatSlice';
import { getMessages } from '@core/api/chatService';

export const useGroupChat = (chatId) => {
    const chats = useSelector(selectChats);
    const group = chats.find(c => c.id === chatId && c.type === 'group') || null;

    const loadMessages = useCallback(() => {
        return getMessages(chatId);
    }, [chatId]);

    return { group, loadMessages };
};

export default useGroupChat;
