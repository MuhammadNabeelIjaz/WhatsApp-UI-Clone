import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFakeLoading } from '@shared/hooks';
import { SettingsSubScreenSkeleton } from '@shared/ui/display/Skeletons';
import { Icons } from '@constants/icons';
import { selectPrivacySettings } from '@core/store/slices/settingsSlice';
import { toggleSetting } from '@core/store/slices/settingsSlice';
import SettingsRow from '@shared/ui/settings/SettingsRow';
import ToggleSwitch from '@shared/ui/buttons/ToggleSwitch';
import SectionHeader from '@shared/ui/settings/SectionHeader';
import { useScrollRestore } from '@shared/hooks/useScrollRestore';

// --- Sub-Screens Imports ---
import LastSeenPrivacy from './privacy/LastSeenPrivacy';
import ProfilePhotoPrivacy from './privacy/ProfilePhotoPrivacy';
import AboutPrivacy from './privacy/AboutPrivacy';
import LinksPrivacy from './privacy/LinksPrivacy';
import StatusPrivacy from './privacy/StatusPrivacy';
import MessageTimer from './privacy/MessageTimer';
import LiveLocation from './privacy/LiveLocation';
import CallsSettings from './privacy/CallsSettings';
import BlockedContacts from './privacy/BlockedContacts';
import AppLock from './privacy/AppLock';
import AdPreferences from './privacy/AdPreferences';
import GroupsPrivacy from "./privacy/GroupsPrivacy";
import ChatLock from './privacy/ChatLock';

const PrivacySettingsScreen = ({ onBack }) => {
    const dispatch  = useDispatch();
    const privacy   = useSelector(selectPrivacySettings);
    const [showBanner, setShowBanner] = useState(true);
    const readReceipts  = privacy?.readReceipts  ?? true;
    const cameraEffects = privacy?.cameraEffects ?? false;
    const scrollRef = useScrollRestore('privacy-main');

    // State to manage which sub-screen is active
    const [activeSubScreen, setActiveSubScreen] = useState('main');
    const isLoading = useFakeLoading(460);

    // --- Navigation Logic ---
    if (isLoading) return <SettingsSubScreenSkeleton rowCount={9} />;

    if (activeSubScreen === 'last-seen') return <LastSeenPrivacy onBack={() => setActiveSubScreen('main')} />;
    if (activeSubScreen === 'profile-pic') return <ProfilePhotoPrivacy onBack={() => setActiveSubScreen('main')} />;
    if (activeSubScreen === 'about') return <AboutPrivacy onBack={() => setActiveSubScreen('main')} />;
    if (activeSubScreen === 'links') return <LinksPrivacy onBack={() => setActiveSubScreen('main')} />;
    if (activeSubScreen === 'status') return <StatusPrivacy onBack={() => setActiveSubScreen('main')} />;
    if (activeSubScreen === 'message-timer') return <MessageTimer onBack={() => setActiveSubScreen('main')} />;
    if (activeSubScreen === 'live-location') return <LiveLocation onBack={() => setActiveSubScreen('main')} />;
    if (activeSubScreen === 'calls') return <CallsSettings onBack={() => setActiveSubScreen('main')} />;
    if (activeSubScreen === 'blocked') return <BlockedContacts onBack={() => setActiveSubScreen('main')} />;
    if (activeSubScreen === 'app-lock') return <AppLock onBack={() => setActiveSubScreen('main')} />;
    if (activeSubScreen === 'advanced') return <AdPreferences onBack={() => setActiveSubScreen('main')} />;
    if (activeSubScreen === 'groups') return <GroupsPrivacy onBack={() => setActiveSubScreen('main')} />;
    if (activeSubScreen === 'chat-lock') return <ChatLock onBack={() => setActiveSubScreen('main')} />;


    return (
        <div className="flex flex-col h-full w-full overflow-hidden bg-bg-surface animate-fade-in">

            {/* --- Header --- */}
            <header className="px-4 py-3 flex items-center shrink-0 border-b border-border-main/5 bg-bg-surface sticky top-0 z-10">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-bg-hover rounded-full transition-all active:scale-90 text-text-primary"
                >
                    <Icons.ArrowLeft size={24} />
                </button>
                <h1 className="ml-4 text-[20px] font-bold text-text-primary flex-1">
                    Privacy
                </h1>
            </header>

            {/* --- Scrollable Content --- */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar">

                {/* 1. Privacy Checkup Banner */}
                {showBanner && (
                    <div className="m-4 p-4 rounded-2xl flex gap-4 relative border border-accent/20 bg-accent/5 overflow-hidden group">
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-accent/10 blur-3xl rounded-full" />
                        <div className="w-10 h-10 shrink-0 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                            <Icons.ShieldCheck size={24} />
                        </div>
                        <div className="pr-6">
                            <h4 className="text-[15px] font-bold text-text-primary">Privacy checkup</h4>
                            <p className="text-[13.5px] mt-1 leading-snug text-text-secondary">
                                Control your privacy and choose the right settings for you.
                                <span className="text-accent font-bold ml-1 cursor-pointer hover:underline">Start checkup</span>
                            </p>
                        </div>
                        <button
                            onClick={() => setShowBanner(false)}
                            className="absolute top-3 right-3 p-1 hover:bg-bg-hover rounded-full text-text-secondary opacity-60"
                        >
                            <Icons.X size={16} />
                        </button>
                    </div>
                )}

                {/* 2. Personal Info Section */}
                <div className="mt-2">
                    <SectionHeader label="Who can see my personal info" />
                    <SettingsRow title="Last seen and online" subtitle="Nobody" onClick={() => setActiveSubScreen('last-seen')} />
                    <SettingsRow title="Profile picture" subtitle="My contacts" onClick={() => setActiveSubScreen('profile-pic')} />
                    <SettingsRow title="About" subtitle="Nobody" onClick={() => setActiveSubScreen('about')} />
                    <SettingsRow title="Links" subtitle="My contacts" onClick={() => setActiveSubScreen('links')} />
                    <SettingsRow title="Status" subtitle="My contacts" onClick={() => setActiveSubScreen('status')} />

                    <SettingsRow
                        title="Read receipts"
                        subtitle="If turned off, you won't send or receive Read receipts. Read receipts are always sent for group chats."
                        rightElement={<ToggleSwitch checked={readReceipts} onChange={() => dispatch(toggleSetting('privacy', 'readReceipts'))} />}
                    />
                </div>

                <div className="h-[1px] w-[90%] mx-auto bg-border-main/5 my-2" />

                {/* 3. Disappearing Messages */}
                <div>
                    <SectionHeader label="Disappearing messages" />
                    <SettingsRow title="Default message timer" subtitle="Off" onClick={() => setActiveSubScreen('message-timer')} />
                </div>

                <div className="h-[1px] w-[90%] mx-auto bg-border-main/5 my-2" />

                {/* 4. Advanced Controls */}
                <div className="pb-10">
                    <SettingsRow icon={<Icons.Users size={22} />} title="Groups" subtitle="1210 contacts excluded" onClick={() => setActiveSubScreen('groups')} />
                    <SettingsRow icon={<Icons.Smile size={22} />} title="Avatar stickers" subtitle="My contacts" />
                    <SettingsRow icon={<Icons.MapPin size={22} />} title="Live location" subtitle="None" onClick={() => setActiveSubScreen('live-location')} />
                    <SettingsRow icon={<Icons.PhoneOff size={22} />} title="Calls" subtitle="Silence unknown callers" onClick={() => setActiveSubScreen('calls')} />
                    <SettingsRow icon={<Icons.UserX size={22} />} title="Blocked contacts" subtitle="14" onClick={() => setActiveSubScreen('blocked')} />
                    <SettingsRow icon={<Icons.Fingerprint size={22} />} title="App lock" subtitle="Enabled immediately" onClick={() => setActiveSubScreen('app-lock')} />
                    <SettingsRow icon={<Icons.Lock size={22} />} title="Chat lock" subtitle="Enabled" onClick={() => setActiveSubScreen('chat-lock')} />

                    <SettingsRow
                        title="Allow camera effects"
                        subtitle="Use effects in the camera and video calls. Learn more"
                        rightElement={<ToggleSwitch checked={cameraEffects} onChange={() => dispatch(toggleSetting('privacy', 'cameraEffects'))} />}
                    />

                    <SettingsRow title="Advanced" subtitle="Protect IP address in calls, Disable link previews" onClick={() => setActiveSubScreen('advanced')} />
                </div>
            </div>
        </div>
    );
};

export default PrivacySettingsScreen;