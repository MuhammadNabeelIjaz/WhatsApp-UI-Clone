// src/core/api/statusService.js
// Mock API layer — returns promise-wrapped empty data.
// Backend ready: replace Promise.resolve() with axios/fetch calls.
// No component changes needed when backend is connected.

export const getStatuses      = ()                    => Promise.resolve([]);
export const postStatus       = (data)                => Promise.resolve({ success: true, data });
export const deleteStatus     = (statusId)            => Promise.resolve({ success: true, statusId });
export const markSeen         = (_userId, _slideIndex)  => Promise.resolve({ success: true });
export const getChannels      = ()                    => Promise.resolve([]);
export const searchChannels   = (_query)               => Promise.resolve([]);
export const followChannel    = (_channelId)           => Promise.resolve({ success: true });
export const unfollowChannel  = (_channelId)           => Promise.resolve({ success: true });
