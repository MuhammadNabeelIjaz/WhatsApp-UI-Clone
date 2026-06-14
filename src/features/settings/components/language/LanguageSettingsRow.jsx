/**
 * features/settings/components/language/LanguageSettingsRow.jsx
 *
 * Drop this into your existing Settings list anywhere you show other rows
 * (Account, Notifications, Privacy, etc.).
 *
 * Usage:
 *   <LanguageSettingsRow onPress={() => setView('language')} />
 *
 * The row shows:
 *   • Globe icon (matches the visual language of other settings rows)
 *   • Label from translation (adapts when user switches language)
 *   • Current language native name as the subtitle/hint
 *   • Chevron right affordance
 */

import React from 'react';
import { Icons }   from '@constants/icons';
import useLanguage from '@hooks/useLanguage';
import { LOCALES } from '../../../../i18n/config';

const LanguageSettingsRow = ({ onPress }) => {
    const { t, locale, dir } = useLanguage();

    // Show the native name of the current language as the subtitle
    const currentLangLabel = LOCALES[locale]?._meta?.nativeName ?? locale;

    return (
        <div
            onClick={onPress}
            dir={dir}
            className="flex items-center gap-4 px-4 py-3.5 hover:bg-bg-hover cursor-pointer active:bg-bg-hover/80 transition-colors border-b border-border-main/10"
        >
            {/* Icon */}
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                <Icons.Globe size={20} className="text-accent" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
                <p className="text-[16px] text-text-primary font-medium truncate">
                    {t('settings.language')}
                </p>
                <p className="text-[13px] text-text-secondary truncate">
                    {currentLangLabel}
                </p>
            </div>

            {/* Chevron */}
            <Icons.ChevronRight size={18} className="text-text-secondary shrink-0" />
        </div>
    );
};

export default LanguageSettingsRow;
