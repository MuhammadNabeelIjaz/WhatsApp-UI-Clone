import React, { useState, useRef, useEffect } from 'react';
import { useFakeLoading } from '@shared/hooks';
import SearchInput from '@shared/ui/inputs/SearchInput';
import SectionLabel from '@shared/ui/list/SectionLabel';
import { Icons } from '@constants/icons';
import logger from '@core/utils/logger';
import { useScrollRestore } from '@shared/hooks/useScrollRestore';
import useLanguage from '@shared/hooks/useLanguage';
import { LOCALES } from '../../../i18n/config';
import { SettingsScreenSkeleton } from '@shared/ui/display/Skeletons';
import EmptyState from '@shared/ui/display/EmptyState';

import SettingsRow from '@shared/ui/settings/SettingsRow';
import { ProfileScreen } from '@features/profile';
import ChatsSettingsScreen from '../components/ChatsSettingsScreen';
import AccountSettingsScreen from '../components/AccountSettingsScreen';
import ListsSettingsScreen from '../components/ListsSettingsScreen';
import PrivacySettingsScreen from '../components/PrivacySettingsScreen';
import NotificationsSettingsScreen from '../components/NotificationsSettingsScreen';
import LanguageSettingsScreen from '../components/LanguageSettingsScreen';
import AvatarSettingsScreen from '../components/AvatarSettingsScreen';
import StorageSettingsScreen from '../components/StorageSettingsScreen';
import HelpSettingsScreen from '../components/HelpSettingsScreen';
import InviteSettingsScreen from '../components/InviteSettingsScreen';
import QRCodeScreen from '../components/QRCodeScreen';

// ─── Settings search index ────────────────────────────────────────────────────
const SETTINGS_INDEX = [
    { label: 'Lists', section: 'Settings', keywords: ['list', 'filter', 'chat filter'], view: 'lists' },
    { label: 'Account', section: 'Settings', keywords: ['account', 'security', 'change number', 'passkeys', 'two-step'], view: 'account' },
    { label: 'Privacy', section: 'Settings', keywords: ['privacy', 'block', 'last seen', 'disappearing'], view: 'privacy' },
    { label: 'Avatar', section: 'Settings', keywords: ['avatar', 'profile photo', 'create avatar'], view: 'avatar' },
    { label: 'Chats', section: 'Settings', keywords: ['chat', 'theme', 'wallpaper', 'dark', 'light'], view: 'chats' },
    { label: 'Notifications', section: 'Settings', keywords: ['notification', 'bell', 'sound', 'tone', 'ringtone'], view: 'notifications' },
    { label: 'Storage and data', section: 'Settings', keywords: ['storage', 'data', 'backup', 'network', 'auto-download'], view: 'storage' },
    { label: 'App language', section: 'Settings', keywords: ['language', 'english', 'urdu', 'locale'], view: 'language' },
    { label: 'Help', section: 'Settings', keywords: ['help', 'faq', 'contact', 'privacy policy'], view: 'help' },
    { label: 'Invite a friend', section: 'Settings', keywords: ['invite', 'share', 'friend'], view: 'invite' },
    { label: 'QR Code', section: 'Profile', keywords: ['qr', 'scan', 'link', 'barcode'], view: 'qrcode' },
    { label: 'Profile', section: 'Profile', keywords: ['profile', 'name', 'about', 'photo'], view: 'profile' },
    { label: 'Theme', section: 'Chats', keywords: ['theme', 'dark mode', 'light mode', 'wallpaper'], view: 'chats' },
];

const SettingsScreen = ({ onBack }) => {
    const { locale } = useLanguage();
    const currentLangName = LOCALES[locale]?._meta?.nativeName ?? 'English';
    const [activeView, setActiveView] = useState('main');
    const [showSearch, setShowSearch] = useState(false);
    const [settingsQuery, setSettingsQuery] = useState('');

    const searchInputRef = useRef(null);
    const scrollRef = useScrollRestore('settings-main');

    const isLoading = useFakeLoading(480);

    const goMain = () => {
        setActiveView('main');
        logger.nav('SettingsScreen', 'back to main');
    };

    useEffect(() => {
        if (showSearch) {
            setTimeout(() => searchInputRef.current?.focus(), 50);
            logger.event('SettingsScreen', 'search_open');
        }
    }, [showSearch]);

    const closeSearch = () => {
        setShowSearch(false);
        setSettingsQuery('');
        logger.event('SettingsScreen', 'search_close');
    };

    const filteredSettings = settingsQuery.trim()
        ? SETTINGS_INDEX.filter(s =>
            s.label.toLowerCase().includes(settingsQuery.toLowerCase()) ||
            s.keywords.some(k => k.toLowerCase().includes(settingsQuery.toLowerCase()))
          )
        : [];

    if (isLoading) return <SettingsScreenSkeleton />;

    // Sub-screen routing
    if (activeView === 'profile')       return <ProfileScreen              onBack={goMain} />;
    if (activeView === 'chats')         return <ChatsSettingsScreen        onBack={goMain} />;
    if (activeView === 'account')       return <AccountSettingsScreen      onBack={goMain} />;
    if (activeView === 'lists')         return <ListsSettingsScreen        onBack={goMain} />;
    if (activeView === 'privacy')       return <PrivacySettingsScreen      onBack={goMain} />;
    if (activeView === 'notifications') return <NotificationsSettingsScreen onBack={goMain} />;
    if (activeView === 'language')      return <LanguageSettingsScreen     onBack={goMain} />;
    if (activeView === 'avatar')        return <AvatarSettingsScreen       onBack={goMain} />;
    if (activeView === 'storage')       return <StorageSettingsScreen      onBack={goMain} />;
    if (activeView === 'help')          return <HelpSettingsScreen         onBack={goMain} />;
    if (activeView === 'invite')        return <InviteSettingsScreen       onBack={goMain} />;
    if (activeView === 'qrcode')        return <QRCodeScreen               onBack={goMain} />;

    return (
        <div className="flex flex-col h-full w-full bg-bg-surface">

            {/* Header */}
            <header className="px-4 py-3 flex items-center shrink-0 border-b border-border-main/5 bg-bg-surface gap-2">
                {showSearch ? (
                    /* Search mode header */
                    <>
                        <button
                            onClick={closeSearch}
                            className="p-2 hover:bg-bg-hover rounded-full transition-all active:scale-90 text-text-primary shrink-0"
                        >
                            <Icons.ArrowLeft size={24} />
                        </button>
                        <SearchInput ref={searchInputRef} value={settingsQuery} onChange={e => setSettingsQuery(e.target.value)} onClear={() => setSettingsQuery("")} placeholder="Search settings..." className="flex-1" />
                    </>
                ) : (
                    /* Normal header */
                    <>
                        <button onClick={onBack} className="p-2 hover:bg-bg-hover rounded-full transition-all active:scale-90 text-text-primary">
                            <Icons.ArrowLeft size={24} />
                        </button>
                        <h1 className="ml-4 text-[20px] font-bold text-text-primary flex-1">Settings</h1>
                        <button
                            onClick={() => {
                                setShowSearch(true);
                                logger.event('SettingsScreen', 'search_icon_click');
                            }}
                            className="p-2 hover:bg-bg-hover rounded-full text-text-primary"
                        >
                            <Icons.Search size={22} />
                        </button>
                    </>
                )}
            </header>

            {/* Search Results */}
            {showSearch && settingsQuery.trim() ? (
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {filteredSettings.length > 0 ? (
                        <>
                            <SectionLabel label={`${filteredSettings.length} result${filteredSettings.length !== 1 ? 's' : ''}`} />
                            {filteredSettings.map((item) => (
                                <div
                                    key={`${item.view}-${item.label}`}
                                    onClick={() => {
                                        logger.nav('SettingsScreen', `search → ${item.view}`);
                                        closeSearch();
                                        setActiveView(item.view);
                                    }}
                                    className="flex items-center gap-4 px-4 py-3 hover:bg-bg-hover cursor-pointer transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-full bg-bg-hover flex items-center justify-center">
                                        <Icons.Settings size={20} className="text-text-secondary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[15px] text-text-primary font-medium">{item.label}</p>
                                        <p className="text-[12px] text-text-secondary">{item.section}</p>
                                    </div>
                                    <Icons.ChevronRight size={18} className="text-text-secondary opacity-50" />
                                </div>
                            ))}
                        </>
                    ) : (
                        <EmptyState
                            icon={<Icons.Search size={40} />}
                            title="No settings found"
                        />
                    )}
                </div>
            ) : (
                /* Normal settings list */
                <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar">
                    {/* Profile card */}
                    <div
                        onClick={() => setActiveView('profile')}
                        className="px-4 py-5 flex items-center gap-4 hover:bg-bg-hover cursor-pointer transition-colors group"
                    >
                        <div className="relative shrink-0">
                            <img
                                src="https://i.ibb.co/Sbdchp3/Screenshot-2026-01-26-014349-1-removebg-preview.png"
                                alt="Profile"
                                className="w-[64px] h-[64px] rounded-full object-cover shadow-md border-2 border-border-main/10"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-[19px] font-semibold text-text-primary truncate">Muhammad Nabeel Ijaz</h2>
                            <p className="text-[14px] text-text-secondary truncate mt-0.5">+92 304 7662828</p>
                            <div className="mt-2 px-3 py-1 rounded-lg inline-flex items-center text-[12px] bg-accent/10 text-accent font-arabic">
                                إِيَّاک نَعْبُدُ وَ إِيَّاكَ نَسْتَعِينُ
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={(e) => { e.stopPropagation(); setActiveView('qrcode'); }}
                                className="p-2 text-accent hover:bg-accent/10 rounded-full transition-all active:scale-90"
                            >
                                <Icons.QrCode size={22} />
                            </button>
                            <Icons.ChevronRight size={20} className="text-text-secondary opacity-50" />
                        </div>
                    </div>

                    <div className="h-[8px] bg-bg-hover/30" />

                    <div className="pb-10">
                        <SettingsRow icon={<Icons.Filter size={22} />}            title="Lists"            subtitle="Manage your chat filter lists"               onClick={() => setActiveView('lists')} />
                        <SettingsRow icon={<Icons.Lock size={22} />}              title="Account"          subtitle="Security notifications, change number"        onClick={() => setActiveView('account')} />
                        <SettingsRow icon={<Icons.CircleDot size={22} />}         title="Privacy"          subtitle="Block contacts, disappearing messages"        onClick={() => setActiveView('privacy')} />
                        <SettingsRow icon={<Icons.UserPlus size={22} />}          title="Avatar"           subtitle="Create, edit, profile photo"                  onClick={() => setActiveView('avatar')} />
                        <SettingsRow icon={<Icons.MessageSquareText size={22} />} title="Chats"            subtitle="Theme, wallpapers, chat history"              onClick={() => setActiveView('chats')} />
                        <SettingsRow icon={<Icons.Bell size={22} />}              title="Notifications"    subtitle="Message, group & call tones"                  onClick={() => setActiveView('notifications')} />
                        <SettingsRow icon={<Icons.Database size={22} />}          title="Storage and data" subtitle="Network usage, auto-download"                 onClick={() => setActiveView('storage')} />
                        <SettingsRow icon={<Icons.Globe size={22} />}             title="App language"     subtitle={currentLangName}                             onClick={() => setActiveView('language')} />
                        <SettingsRow icon={<Icons.HelpCircle size={22} />}        title="Help"             subtitle="Help center, contact us, privacy policy"     onClick={() => setActiveView('help')} />
                        <SettingsRow icon={<Icons.Users2 size={22} />}            title="Invite a friend"                                                          onClick={() => setActiveView('invite')} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsScreen;
