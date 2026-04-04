// src/features/settings/services/settingsService.js
// Feature-level service: settings persistence and retrieval.
// Backend ready: replace Promise.resolve() stubs with real API calls via @core/api/settingsService.

/**
 * Fetch all user settings from backend.
 * @returns {Promise<object>}
 */
export const fetchSettings = () => Promise.resolve({});

/**
 * Save (patch) specific settings fields.
 * @param {object} patch - Partial settings object to update
 * @returns {Promise<{ success: boolean, settings: object }>}
 */
export const updateSettings = (patch) => Promise.resolve({ success: true, settings: patch });

/**
 * Reset all settings to defaults.
 * @returns {Promise<{ success: boolean }>}
 */
export const resetSettings = () => Promise.resolve({ success: true });

/**
 * Export account data (GDPR compliance).
 * @returns {Promise<{ success: boolean, downloadUrl: string }>}
 */
export const exportAccountData = () => Promise.resolve({ success: true, downloadUrl: '' });

/**
 * Delete the user account.
 * @param {{ password: string, reason?: string }} data
 * @returns {Promise<{ success: boolean }>}
 */
export const deleteAccount = (_data) => Promise.resolve({ success: true });
