/**
 * Privacy visibility options — used in LastSeen, About, ProfilePhoto, Groups, Status privacy screens.
 */
export const PRIVACY_OPTIONS = {
  EVERYONE:       'everyone',
  CONTACTS:       'contacts',
  CONTACTS_EXCEPT: 'contacts_except',
  NOBODY:         'nobody',
};

export const PRIVACY_LABELS = {
  [PRIVACY_OPTIONS.EVERYONE]:        'Everyone',
  [PRIVACY_OPTIONS.CONTACTS]:        'My contacts',
  [PRIVACY_OPTIONS.CONTACTS_EXCEPT]: 'My contacts except...',
  [PRIVACY_OPTIONS.NOBODY]:          'Nobody',
};

export default PRIVACY_OPTIONS;
