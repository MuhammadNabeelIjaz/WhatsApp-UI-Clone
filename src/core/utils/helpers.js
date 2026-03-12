/**
 * WhatsApp Web Clone - Global Helpers
 * Utility functions used across the application to keep components clean and DRY.
 */

/**
 * Combines multiple class names conditionally.
 * Useful for Tailwind CSS dynamic classes without needing an external library like clsx.
 * * @param  {...any} classes - Class names or conditional expressions.
 * @returns {string} - A single string of combined, valid class names.
 */
export const classNames = (...classes) => {
    return classes.filter(Boolean).join(' ');
};

/**
 * Truncates a string to a specified length and adds an ellipsis.
 * * @param {string} text - The text to truncate.
 * @param {number} maxLength - The maximum allowed length before truncating.
 * @returns {string} - The truncated string.
 */
export const truncateText = (text, maxLength = 30) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
};

export default { classNames, truncateText };