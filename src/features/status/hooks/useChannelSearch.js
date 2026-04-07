// src/features/status/hooks/useChannelSearch.js
// Filters followed + explore channels by search query.
// Backend ready: replace local filter with statusService.searchChannels(query) when ready.

import { useState, useMemo } from 'react';

/**
 * @param {Array} channels - Raw channel array from store
 * @returns {{ searchQuery, setSearchQuery, filteredChannels, isSearching }}
 */
export function useChannelSearch(channels = []) {
    const [searchQuery, setSearchQuery] = useState('');

    const isSearching = searchQuery.trim().length > 0;

    const filteredChannels = useMemo(() => {
        if (!isSearching) return channels;
        const q = searchQuery.toLowerCase();
        return channels.filter(ch =>
            ch.name?.toLowerCase().includes(q) ||
            ch.description?.toLowerCase().includes(q)
        );
    }, [channels, searchQuery, isSearching]);

    return { searchQuery, setSearchQuery, filteredChannels, isSearching };
}

export default useChannelSearch;
