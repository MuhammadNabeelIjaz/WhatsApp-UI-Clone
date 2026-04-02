// src/features/profile/services/profileService.js
// Feature-level service: user profile management.
// Backend ready: replace Promise.resolve() stubs with real API calls via @core/api.

/**
 * Fetch the current user's profile.
 * @returns {Promise<{ name: string, about: string, phone: string, avatarUrl: string }>}
 */
export const fetchProfile = () => Promise.resolve({
    name:      '',
    about:     '',
    phone:     '',
    avatarUrl: '',
});

/**
 * Update profile fields.
 * @param {{ name?: string, about?: string, avatarUrl?: string }} data
 * @returns {Promise<{ success: boolean, profile: object }>}
 */
export const updateProfile = (data) => Promise.resolve({ success: true, profile: data });

/**
 * Upload a new profile picture.
 * @param {File} file
 * @returns {Promise<{ success: boolean, avatarUrl: string }>}
 */
export const uploadAvatar = (_file) => Promise.resolve({ success: true, avatarUrl: '' });

/**
 * Remove the profile picture.
 * @returns {Promise<{ success: boolean }>}
 */
export const removeAvatar = () => Promise.resolve({ success: true });

/**
 * Request a phone number change (initiates OTP flow).
 * @param {string} newPhone
 * @returns {Promise<{ success: boolean, verificationId: string }>}
 */
export const requestPhoneChange = (_newPhone) => Promise.resolve({ success: true, verificationId: 'stub-id' });
