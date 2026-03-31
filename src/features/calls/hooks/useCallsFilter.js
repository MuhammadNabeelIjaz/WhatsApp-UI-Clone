// src/features/calls/hooks/useCallsFilter.js
// Filters and searches the calls list.
// Backend ready: replace local state with callsService.getCalls() when backend connects.

import { useState, useMemo } from 'react';

/**
 * @param {Array} callLogs  - Raw call log array
 * @returns {{ searchQuery, setSearchQuery, filteredCalls }}
 */
export function useCallsFilter(callLogs = []) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCalls = useMemo(() => {
        if (!searchQuery.trim()) return callLogs;
        const q = searchQuery.toLowerCase();
        return callLogs.filter(call => call.name?.toLowerCase().includes(q));
    }, [callLogs, searchQuery]);

    return { searchQuery, setSearchQuery, filteredCalls };
}

export default useCallsFilter;
