// src/features/community/services/communityService.js
// Feature-level service: community management operations.
// Backend ready: replace Promise.resolve() stubs with real API calls via @core/api/communityService.

/**
 * Fetch all communities the user belongs to.
 * @returns {Promise<Array>}
 */
export const fetchCommunities = () => Promise.resolve([]);

/**
 * Create a new community.
 * @param {{ name: string, description?: string, icon?: string }} data
 * @returns {Promise<{ success: boolean, community: object }>}
 */
export const createCommunity = (data) => Promise.resolve({ success: true, community: data });

/**
 * Leave a community.
 * @param {string} communityId
 * @returns {Promise<{ success: boolean }>}
 */
export const leaveCommunity = (_communityId) => Promise.resolve({ success: true });

/**
 * Mute / unmute a community.
 * @param {string}  communityId
 * @param {boolean} muted
 * @returns {Promise<{ success: boolean }>}
 */
export const setCommunityMute = (_communityId, _muted) => Promise.resolve({ success: true });

/**
 * Add a group to an existing community.
 * @param {string} communityId
 * @param {string} groupId
 * @returns {Promise<{ success: boolean }>}
 */
export const addGroupToCommunity = (_communityId, _groupId) => Promise.resolve({ success: true });

/**
 * Remove a group from a community.
 * @param {string} communityId
 * @param {string} groupId
 * @returns {Promise<{ success: boolean }>}
 */
export const removeGroupFromCommunity = (_communityId, _groupId) => Promise.resolve({ success: true });
