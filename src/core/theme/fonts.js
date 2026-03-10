/**
 * WhatsApp Web Clone - Typography System
 * Defines font families, weights, and standard sizes used across the application.
 * Centralizing this ensures consistency and makes future font swaps easier.
 */

export const fonts = {
    family: {
        sans: "'Inter', sans-serif",
    },
    weight: {
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },
    size: {
        xs: '10px',      // Timestamps, small badges, unread counts
        sm: '12px',      // Secondary text, online status, subtitle info
        base: '13px',    // Filter chips text
        md: '14.5px',    // Chat message text, standard list items
        lg: '16px',      // Chat contact names, sub-headers
        xl: '19px',      // Selection mode text
        xxl: '22px',     // Main App title (e.g., "WhatsApp" in sidebar)
        hero: '32px',    // Welcome screen main title
    }
};

export default fonts;