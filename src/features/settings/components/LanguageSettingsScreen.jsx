/**
 * features/settings/components/language/LanguageSettings.jsx
 *
 * Full-screen language picker.
 * Architecture mirrors ChangeNumber.jsx:
 *   — functional component + hooks only
 *   — Tailwind with CSS variable tokens
 *   — receives `onBack` from parent (no router deps)
 *   — zero external state libs
 */

import React, { useState, useMemo } from 'react';
import { Icons }        from '@constants/icons';
import LanguageRow      from '@shared/ui/language/LanguageRow';
import useLanguage      from '@shared/hooks/useLanguage';
import { getLanguageList } from '../../../i18n/config';
import EmptyState       from '@shared/ui/display/EmptyState';

// Language list is static — computed once outside the component
const ALL_LANGUAGES = getLanguageList();

const LanguageSettingsScreen = ({ onBack }) => {
    const { locale, setLocale, t, dir } = useLanguage();
    const [search, setSearch]      = useState('');

    // ── Filtering ─────────────────────────────────────────────────────────────
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return ALL_LANGUAGES;
        return ALL_LANGUAGES.filter(
            lang =>
                lang.name.toLowerCase().includes(q)       ||
                lang.nativeName.toLowerCase().includes(q) ||
                lang.code.toLowerCase().includes(q)
        );
    }, [search]);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleSelect = (code) => {
        if (code !== locale) setLocale(code);
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="flex flex-col h-full w-full bg-bg-surface" dir={dir}>

            {/* ── Header ─────────────────────────────────────────────────── */}
            <header className="px-4 py-3 flex items-center gap-4 sticky top-0 z-50 bg-bg-surface border-b border-border-main/5">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-bg-hover rounded-full text-text-primary active:scale-90 transition-all"
                    aria-label={t('common.back')}
                >
                    <Icons.ArrowLeft size={24} />
                </button>
                <h1 className="text-[20px] font-bold text-text-primary">{t('language.title')}</h1>
            </header>

            {/* ── Search bar ─────────────────────────────────────────────── */}
            <div className="px-4 py-3 border-b border-border-main/10">
                <div className="flex items-center gap-2 bg-bg-input rounded-xl px-3 py-2">
                    <Icons.Search size={16} className="text-text-secondary shrink-0" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder={t('language.searchPlaceholder')}
                        className="flex-1 bg-transparent text-[14px] text-text-primary outline-none placeholder:text-text-secondary"
                    />
                    {search.length > 0 && (
                        <button
                            onClick={() => setSearch('')}
                            className="text-text-secondary hover:text-text-primary transition-colors active:scale-90"
                        >
                            <Icons.X size={14} />
                        </button>
                    )}
                </div>
            </div>

            {/* ── Section label ───────────────────────────────────────────── */}
            <div className="px-4 pt-4 pb-2">
                <p className="text-[13px] text-text-secondary font-semibold uppercase tracking-wider">
                    {t('language.sectionTitle')}
                </p>
            </div>

            {/* ── Language list ───────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {filtered.length > 0
                    ? filtered.map(lang => (
                        <LanguageRow
                            key={lang.code}
                            language={lang}
                            isSelected={lang.code === locale}
                            onSelect={handleSelect}
                        />
                    ))
                    : (
                        <EmptyState
                            icon={<Icons.Search size={40} />}
                            title={`${t('language.noMatch')} "${search}"`}
                            className="py-16"
                        />
                    )
                }

                {/* Bottom padding so last item isn't hidden behind nav */}
                <div className="h-8" />
            </div>

            {/* ── Footer note ─────────────────────────────────────────────── */}
            <div className="px-6 py-4 border-t border-border-main/10">
                <p className="text-[12.5px] text-text-secondary text-center leading-relaxed">
                    {t('language.restartNote')}
                </p>
            </div>
        </div>
    );
};

export default LanguageSettingsScreen;
