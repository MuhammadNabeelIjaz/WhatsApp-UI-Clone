/**
 * shared/hooks/useLanguage.js
 *
 * The ONLY way consumers should interact with the i18n system.
 *
 * Usage:
 *   const { t, locale, setLocale, isRTL } = useLanguage();
 *   <h1>{t('settings.title')}</h1>
 *
 * Throws a meaningful error if used outside <LanguageProvider>.
 */

import { useContext } from 'react';
import { LanguageContext } from '@app/providers/LanguageContext';

const useLanguage = () => {
    const ctx = useContext(LanguageContext);
    if (!ctx) {
        throw new Error(
            '[useLanguage] Must be used inside <LanguageProvider>.\n' +
            'Wrap your app root: <LanguageProvider><App /></LanguageProvider>'
        );
    }
    return ctx;
};

export default useLanguage;
