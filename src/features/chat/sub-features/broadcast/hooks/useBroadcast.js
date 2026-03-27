// src/features/chat/sub-features/broadcast/hooks/useBroadcast.js
import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectChats } from '@core/store/slices/chatSlice';

export const useBroadcast = () => {
    const chats = useSelector(selectChats);
    const broadcasts = chats.filter(c => c.type === 'broadcast');

    const [selectedRecipients, setSelectedRecipients] = useState([]);

    const toggleRecipient = useCallback((contact) => {
        setSelectedRecipients(prev =>
            prev.find(c => c.id === contact.id)
                ? prev.filter(c => c.id !== contact.id)
                : [...prev, contact]
        );
    }, []);

    return { broadcasts, selectedRecipients, toggleRecipient };
};

export default useBroadcast;
