// src/features/status/services/statusService.js
// Feature-level service: status updates + channel management.
// Backend ready: replace Promise.resolve() stubs with real API calls via @core/api/statusService.

/**
 * Fetch contacts' status updates.
 * @returns {Promise<Array>}
 */
export const fetchStatuses = () => Promise.resolve([]);

/**
 * Mark a status slide as seen.
 * @param {string} userId
 * @param {number} slideIndex
 * @returns {Promise<{ success: boolean }>}
 */
export const markStatusSeen = (_userId, _slideIndex) => Promise.resolve({ success: true });

/**
 * Post a new text status.
 * @param {{ content: string, backgroundColor: string }} data
 * @returns {Promise<{ success: boolean, status: object }>}
 */
export const postTextStatus = (data) => Promise.resolve({ success: true, status: data });

/**
 * Post a new media status.
 * @param {{ url: string, mediaType: 'image' | 'video', caption?: string }} data
 * @returns {Promise<{ success: boolean, status: object }>}
 */
export const postMediaStatus = (data) => Promise.resolve({ success: true, status: data });

/**
 * Delete a status update.
 * @param {string} statusId
 * @returns {Promise<{ success: boolean }>}
 */
export const deleteStatus = (_statusId) => Promise.resolve({ success: true });

/**
 * Follow a channel.
 * @param {string} channelId
 * @returns {Promise<{ success: boolean }>}
 */
export const followChannel = (_channelId) => Promise.resolve({ success: true });

/**
 * Unfollow a channel.
 * @param {string} channelId
 * @returns {Promise<{ success: boolean }>}
 */
export const unfollowChannel = (_channelId) => Promise.resolve({ success: true });

/**
 * Search channels to explore.
 * @param {string} query
 * @returns {Promise<Array>}
 */
export const searchChannels = (_query) => Promise.resolve([]);
