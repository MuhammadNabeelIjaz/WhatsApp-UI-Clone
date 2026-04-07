// src/features/settings/hooks/useSettingsForm.js
// Generic form state management for settings screens.
// Handles dirty-tracking, validation, and optimistic save.
// Backend ready: connect saveSettings() to settingsService.updateSettings() when ready.

import { useState, useCallback, useRef } from 'react';

/**
 * @param {object}   initialValues  - Initial form field values
 * @param {Function} onSave         - Called with final values when saved successfully
 * @returns {{ values, isDirty, isSaving, setValue, resetForm, saveForm }}
 */
export function useSettingsForm(initialValues = {}, onSave) {
    const original              = useRef(initialValues);
    const [values,    setValues]    = useState(initialValues);
    const [isSaving,  setIsSaving]  = useState(false);

    const isDirty = JSON.stringify(values) !== JSON.stringify(original.current);

    const setValue = useCallback((key, value) => {
        setValues(prev => ({ ...prev, [key]: value }));
    }, []);

    const resetForm = useCallback(() => {
        setValues(original.current);
    }, []);

    const saveForm = useCallback(async () => {
        if (!isDirty) return;
        setIsSaving(true);
        try {
            await onSave?.(values);
            original.current = values;   // commit as new baseline
        } finally {
            setIsSaving(false);
        }
    }, [isDirty, values, onSave]);

    return { values, isDirty, isSaving, setValue, resetForm, saveForm };
}

export default useSettingsForm;
