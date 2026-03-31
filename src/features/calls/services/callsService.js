// src/features/calls/services/callsService.js
// Feature-level service: orchestrates callsService (API) + local store.
// Backend ready: replace Promise.resolve() stubs with real API calls via @core/api/callsService.

/**
 * Fetch the user's call history.
 * @returns {Promise<Array>}
 */
export const fetchCallHistory = () => Promise.resolve([]);

/**
 * Schedule a call.
 * @param {{ title: string, date: string, time: string, participants: Array }} data
 * @returns {Promise<{ success: boolean, data: object }>}
 */
export const scheduleCall = (data) => Promise.resolve({ success: true, data });

/**
 * Delete a call from history.
 * @param {number|string} callId
 * @returns {Promise<{ success: boolean, callId: number|string }>}
 */
export const deleteCall = (callId) => Promise.resolve({ success: true, callId });

/**
 * Create a shareable call link.
 * @returns {Promise<{ success: boolean, link: string }>}
 */
export const createCallLink = () => Promise.resolve({ success: true, link: 'https://call.wa.link/stub' });
