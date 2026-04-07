// src/core/api/communityService.js
// Mock API layer — returns promise-wrapped empty data.
// Backend ready: replace Promise.resolve() with axios/fetch calls.
// No component changes needed when backend is connected.

export const getCommunities          = ()                        => Promise.resolve([]);
export const createCommunity         = (data)                    => Promise.resolve({ success: true, data });
export const leaveCommunity          = (_communityId)             => Promise.resolve({ success: true });
export const setCommunityMute        = (_communityId, _muted)      => Promise.resolve({ success: true });
export const addGroupToCommunity     = (_communityId, _groupId)    => Promise.resolve({ success: true });
export const removeGroupFromCommunity = (_communityId, _groupId)   => Promise.resolve({ success: true });
