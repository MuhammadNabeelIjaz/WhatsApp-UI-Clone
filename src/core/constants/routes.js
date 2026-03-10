/**
 * WhatsApp Premium Clone - Navigation & Mock Data
 * Optimized for Theme-Aware UI and Realistic Interactions.
 */

export const ROUTES = {
    // Main Sidebar Tabs
    CHATS: 'chats',
    STATUS: 'status',
    COMMUNITIES: 'communities',
    CALLS: 'calls',
    SETTINGS: 'settings',
    AI: 'ai',         // Meta AI — renders a "coming soon" placeholder

    // Views & Overlays
    ARCHIVE_VIEW: 'archive_view',
    LOCKED_VIEW: 'locked_view',
    GALLERY: 'gallery',
    PROFILE: 'profile',
    CONTACT_INFO: 'contact_info',
};

// Filters for Chat List Header
export const CHAT_FILTERS = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread' },
    { id: 'favorites', label: 'Favorites' },
    { id: 'groups', label: 'Groups' }
];

export default ROUTES;