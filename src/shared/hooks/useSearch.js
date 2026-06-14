// src/hooks/useSearch.js — Part 16
import { useState, useMemo, useCallback } from 'react';
import { getState } from '@store';

/**
 * useSearch — local search hook for filtering a list by query.
 * Also exposes global search results from store.
 *
 * Usage:
 *   const { query, setQuery, filtered } = useSearch(items, ['name','lastMessage.text']);
 */
const useSearch = (items = [], keys = ['name']) => {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(item => {
      return keys.some(key => {
        // support dot notation: 'lastMessage.text'
        const val = key.split('.').reduce((obj, k) => obj?.[k], item);
        return typeof val === 'string' && val.toLowerCase().includes(q);
      });
    });
  }, [items, query, JSON.stringify(keys)]);

  const clearSearch = useCallback(() => setQuery(''), []);

  return { query, setQuery, filtered, clearSearch };
};

/**
 * useGlobalSearch — cross-entity search (chats + contacts + messages)
 */
export const useGlobalSearch = () => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return { chats: [], contacts: [], messages: [] };
    const q = query.toLowerCase();
    const { chats, contacts } = getState();

    const matchedChats = chats.filter(c =>
      c.name?.toLowerCase().includes(q)
    );
    const matchedContacts = contacts.filter(c =>
      c.name?.toLowerCase().includes(q) || c.phone?.includes(q)
    );
    // Message search within chat messages
    const matchedMessages = [];
    chats.forEach(chat => {
      (chat.messages || []).forEach(msg => {
        if (typeof msg.text === 'string' && msg.text.toLowerCase().includes(q)) {
          matchedMessages.push({ ...msg, chatId: chat.id, chatName: chat.name });
        }
      });
    });

    return { chats: matchedChats, contacts: matchedContacts, messages: matchedMessages };
  }, [query]);

  return { query, setQuery, results };
};

export default useSearch;
