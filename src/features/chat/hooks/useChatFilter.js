import { useMemo } from 'react';

/**
 * Filters and sorts a flat chat list by search query and active filter chip.
 *
 * @param {Array}  chats        - Raw chats array from store
 * @param {string} searchQuery  - Current search text
 * @param {string} activeFilter - One of 'all' | 'unread' | 'favorites' | 'groups' | list.id
 * @param {Array}  lists        - Full lists array from store (for custom list filtering)
 * @returns {Array} filteredChats - Pinned first, then rest
 */
const useChatFilter = (chats, searchQuery, activeFilter, lists = []) => {
    return useMemo(() => {
        // For custom (non-preset) lists, resolve chatIds membership
        const customList = (!['all','unread','favorites','groups'].includes(activeFilter))
            ? lists.find(l => l.id === activeFilter && !l.preset)
            : null;

        const visible = chats.filter((chat) => {
            if (chat.isArchived || chat.isLocked) return false;

            const name = chat.name?.toLowerCase() || '';
            const msg = (
                typeof chat.lastMessage === 'string'
                    ? chat.lastMessage
                    : chat.lastMessage?.text || ''
            ).toLowerCase();
            const q = searchQuery.toLowerCase();

            const matchesSearch = !q || name.includes(q) || msg.includes(q);
            if (!matchesSearch) return false;

            if (activeFilter === 'unread')    return chat.unreadCount > 0 || chat.isManuallyUnread === true;
            if (activeFilter === 'favorites') return chat.isFavorite === true;
            if (activeFilter === 'groups')    return chat.isGroup === true;

            // Custom list: filter by chatIds membership
            if (customList) {
                return Array.isArray(customList.chatIds) && customList.chatIds.includes(chat.id);
            }

            return true;
        });

        return [
            ...visible.filter((c) => c.isPinned),
            ...visible.filter((c) => !c.isPinned),
        ];
    }, [chats, searchQuery, activeFilter, lists]);
};

export default useChatFilter;
