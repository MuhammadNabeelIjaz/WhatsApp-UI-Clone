// src/features/profile/hooks/useProfileEdit.js
// Manages profile editing state: name, about, avatar, links.
// Backend ready: connect save actions to profileService.updateProfile() when ready.

import { useState, useCallback } from 'react';

/**
 * @param {object} initialProfile - Initial profile data { name, about, phone, avatarUrl }
 * @param {Function} onSaved      - Called after a successful save
 * @returns {{ profile, avatarUrl, isSaving, updateField, updateAvatar, saveProfile }}
 */
export function useProfileEdit(initialProfile = {}, onSaved) {
    const [profile,  setProfile]  = useState({
        name:     initialProfile.name     ?? '',
        about:    initialProfile.about    ?? '',
        phone:    initialProfile.phone    ?? '',
    });
    const [avatarUrl, setAvatarUrl] = useState(initialProfile.avatarUrl ?? '');
    const [isSaving,  setIsSaving]  = useState(false);

    const updateField = useCallback((field, value) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    }, []);

    const updateAvatar = useCallback((url) => {
        setAvatarUrl(url);
    }, []);

    const saveProfile = useCallback(async () => {
        setIsSaving(true);
        try {
            // Backend ready: await profileService.updateProfile({ ...profile, avatarUrl });
            await Promise.resolve();
            onSaved?.({ ...profile, avatarUrl });
        } finally {
            setIsSaving(false);
        }
    }, [profile, avatarUrl, onSaved]);

    return { profile, avatarUrl, isSaving, updateField, updateAvatar, saveProfile };
}

export default useProfileEdit;
