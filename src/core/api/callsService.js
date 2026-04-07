// src/core/api/callsService.js
// Mock API layer — returns promise-wrapped empty data.
// Backend ready: replace Promise.resolve() with axios/fetch calls.
// No component changes needed when backend is connected.

export const getCalls       = ()       => Promise.resolve([]);
export const scheduleCall   = (data)   => Promise.resolve({ success: true, data });
export const deleteCall     = (callId) => Promise.resolve({ success: true, callId });
export const createCallLink = ()       => Promise.resolve({ success: true, link: '' });
