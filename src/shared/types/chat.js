/**
 * @typedef {Object} Chat
 * @property {string}  id
 * @property {string}  name
 * @property {string}  [avatar]
 * @property {string}  [initials]
 * @property {string}  [avatarColor]
 * @property {'dm'|'group'|'broadcast'|'channel'|'community'|'announcement'} [type]
 * @property {boolean} [isGroup]
 * @property {boolean} [isBroadcast]
 * @property {boolean} [isChannel]
 * @property {boolean} [isCommunity]
 * @property {boolean} [isCommunityAnnouncement]
 * @property {boolean} [isPinned]
 * @property {boolean} [isArchived]
 * @property {boolean} [isMuted]
 * @property {boolean} [isLocked]
 * @property {boolean} [isBlocked]
 * @property {boolean} [isFavorite]
 * @property {number}  [unreadCount]
 * @property {Object}  [lastMessage]
 * @property {string}  [time]
 */

/**
 * @typedef {Object} Message
 * @property {string}  id
 * @property {string}  type
 * @property {'left'|'right'} align
 * @property {'sent'|'delivered'|'read'} [status]
 * @property {Object}  props
 */

/**
 * @typedef {Object} Contact
 * @property {string}  id
 * @property {string}  name
 * @property {string}  [phone]
 * @property {string}  [avatar]
 * @property {string}  [initials]
 * @property {string}  [avatarColor]
 * @property {string}  [about]
 * @property {boolean} [isOnline]
 * @property {boolean} [isFavorite]
 * @property {boolean} [isBlocked]
 * @property {boolean} [isMuted]
 */
