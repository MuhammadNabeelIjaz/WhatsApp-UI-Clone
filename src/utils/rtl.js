/**
 * utils/rtl.js
 *
 * Lightweight RTL helpers.
 * These keep direction logic out of components and make it easy to add
 * more RTL-aware utilities in future without touching component files.
 *
 * Usage:
 *   import { rtlClass, dirAttr } from '@utils/rtl';
 *
 *   // Pick between two classes based on direction
 *   <div className={rtlClass(isRTL, 'text-right', 'text-left')} />
 *
 *   // Get the dir string for a DOM attribute
 *   <div dir={dirAttr(isRTL)} />
 */

/**
 * Returns `rtlValue` when isRTL is true, otherwise `ltrValue`.
 * @param {boolean} isRTL
 * @param {string}  rtlValue   — class or value for RTL
 * @param {string}  ltrValue   — class or value for LTR
 * @returns {string}
 */
export const rtlClass = (isRTL, rtlValue, ltrValue = '') =>
    isRTL ? rtlValue : ltrValue;

/**
 * Returns 'rtl' or 'ltr' string for the HTML `dir` attribute.
 * @param {boolean} isRTL
 * @returns {'rtl' | 'ltr'}
 */
export const dirAttr = (isRTL) => (isRTL ? 'rtl' : 'ltr');

/**
 * Flips ArrowLeft/ArrowRight icon semantics for RTL.
 * In RTL, "back" is visually a right arrow and "forward" is a left arrow.
 *
 * @param {boolean} isRTL
 * @param {'left' | 'right'} logicalDir
 * @returns {'left' | 'right'} — physical direction for the icon
 */
export const iconDir = (isRTL, logicalDir) => {
    if (!isRTL) return logicalDir;
    return logicalDir === 'left' ? 'right' : 'left';
};
