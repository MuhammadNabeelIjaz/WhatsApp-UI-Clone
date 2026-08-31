import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFakeLoading } from '@shared/hooks';
import { SettingsSubScreenSkeleton } from '@shared/ui/display/Skeletons';
import { useTheme } from '@app/providers/ThemeContext';
import { Icons } from '@constants/icons';
import { selectChatSettings } from '@core/store/slices/settingsSlice';
import { toggleSetting, setSetting } from '@core/store/slices/settingsSlice';
import { showToast } from '@core/store/slices/uiSlice';
import SettingsRow from '@shared/ui/settings/SettingsRow';
import ToggleSwitch from '@shared/ui/buttons/ToggleSwitch';
import SectionHeader from '@shared/ui/settings/SectionHeader';
import { PickerModal } from '@shared/ui/settings';
import ChatThemeScreen from './chats/ChatThemeScreen';
import VoiceMessageTranscripts from './chats/VoiceMessageTranscripts';

const ChatsSettingsScreen = ({ onBack }) => {
    const { themeMode, setThemeMode } = useTheme();
    const dispatch       = useDispatch();
    const chatSettings   = useSelector(selectChatSettings);
    const [modal, setModal] = useState(null);
    const isLoading = useFakeLoading(450);
    const [activeSubScreen, setActiveSubScreen] = useState('main');
    const enterSend       = chatSettings?.enterSend       ?? false;
    const mediaVisibility = chatSettings?.mediaVisibility ?? true;
    const fontSize        = chatSettings?.fontSize        ?? 'Medium';

    // Chat Backup state
    const [backupState, setBackupState] = useState('idle'); // 'idle' | 'running' | 'done' | 'cancelled'
    const [backupProgress, setBackupProgress] = useState(0);
    const backupTimer = useRef(null);

    const startBackup = () => {
        setBackupState('running');
        setBackupProgress(0);
        let p = 0;
        backupTimer.current = setInterval(() => {
            p += Math.random() * 4 + 1;
            if (p >= 100) {
                p = 100;
                clearInterval(backupTimer.current);
                setBackupProgress(100);
                setBackupState('done');
                setTimeout(() => setBackupState('idle'), 3000);
            } else {
                setBackupProgress(Math.round(p));
            }
        }, 180);
    };

    const cancelBackup = () => {
        clearInterval(backupTimer.current);
        setBackupState('cancelled');
        setTimeout(() => { setBackupState('idle'); setBackupProgress(0); }, 1800);
    };

    const displayThemeMode = themeMode
        ? themeMode.charAt(0).toUpperCase() + themeMode.slice(1)
        : 'System';

    if (isLoading) return <SettingsSubScreenSkeleton rowCount={7} />;

    if (activeSubScreen === 'theme-wallpaper') return <ChatThemeScreen onBack={() => setActiveSubScreen('main')} />;
    if (activeSubScreen === 'voice-transcripts') return <VoiceMessageTranscripts onBack={() => setActiveSubScreen('main')} />;

    const themeOptions = ['System default', 'Light', 'Dark'];
    const fontOptions = ['Small', 'Medium', 'Large'];

    const handleThemeSelect = (option, e) => {
        const val = option === 'System default' ? 'system' : option.toLowerCase();
        setThemeMode(val, e);
        dispatch(showToast(`Theme set to ${option}`, 'info'));
    };

    const handleFontSelect = (option) => {
        dispatch(setSetting('chats', 'fontSize', option));
        dispatch(showToast(`Font size set to ${option}`, 'info'));
    };

    // Map display option to themeMode value for PickerModal selected check
    const selectedThemeOption = themeMode === 'system' ? 'System default'
        : themeMode === 'light' ? 'Light'
        : 'Dark';

    return (
        <div className="flex flex-col h-full w-full overflow-hidden bg-bg-surface">
            <header className="px-4 py-3 flex items-center border-b border-border-main/5 bg-bg-surface">
                <button onClick={onBack} className="p-2 hover:bg-bg-hover rounded-full transition-all active:scale-90 text-text-primary">
                    <Icons.ArrowLeft size={24} />
                </button>
                <h1 className="ml-4 text-[20px] font-bold text-text-primary flex-1">Chats</h1>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
                <SectionHeader label="Display" className="pt-6" />

                <SettingsRow
                    icon={<Icons.SunMoon size={22} />}
                    title="Theme"
                    subtitle={displayThemeMode}
                    onClick={() => setModal('theme')}
                />
                <SettingsRow
                    icon={<Icons.Wallpaper size={22} />}
                    title="Wallpaper"
                    subtitle="Choose chat background"
                    onClick={() => setActiveSubScreen('theme-wallpaper')}
                />

                <div className="h-[1px] w-[90%] mx-auto bg-border-main/10 my-4" />

                <SectionHeader label="Chat settings" />

                <SettingsRow
                    title="Enter is send"
                    subtitle="Enter key will send your message"
                    rightElement={<ToggleSwitch checked={enterSend} onChange={() => { dispatch(toggleSetting('chats', 'enterSend')); dispatch(showToast(`Enter to send ${!enterSend ? 'enabled' : 'disabled'}`, 'info')); }} />}
                />
                <SettingsRow
                    title="Media visibility"
                    subtitle="Show newly downloaded media in your gallery"
                    rightElement={<ToggleSwitch checked={mediaVisibility} onChange={() => { dispatch(toggleSetting('chats', 'mediaVisibility')); dispatch(showToast(`Media visibility ${!mediaVisibility ? 'enabled' : 'disabled'}`, 'info')); }} />}
                />
                <SettingsRow
                    title="Font size"
                    subtitle={fontSize}
                    onClick={() => setModal('fontSize')}
                />
                <SettingsRow
                    icon={<Icons.MessageSquareText size={22} />}
                    title="Voice message transcripts"
                    subtitle="Read your voice messages"
                    onClick={() => setActiveSubScreen('voice-transcripts')}
                />

                <div className="h-[1px] w-[90%] mx-auto bg-border-main/10 my-4" />

                <SectionHeader label="Archived & Backup" />

                <SettingsRow
                    icon={<Icons.History size={22} />}
                    title="Chat backup"
                    subtitle={
                        backupState === 'running' ? `Backing up… ${backupProgress}%` :
                            backupState === 'done' ? '✓ Backup complete' :
                                backupState === 'cancelled' ? 'Backup cancelled' :
                                    'Google Drive backup off'
                    }
                    onClick={backupState === 'idle' || backupState === 'done' ? startBackup : undefined}
                />
                {/* Progress bar */}
                {(backupState === 'running' || backupState === 'done' || backupState === 'cancelled') && (
                    <div className="mx-5 mb-2 mt-1">
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-1.5 bg-border-main/20 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-200 ${backupState === 'cancelled' ? 'bg-red-400' : 'bg-accent'}`}
                                    style={{ width: `${backupProgress}%` }}
                                />
                            </div>
                            {backupState === 'running' && (
                                <button
                                    onClick={cancelBackup}
                                    className="p-1 hover:bg-red-500/10 rounded-full text-text-secondary hover:text-red-400 transition-colors"
                                    title="Cancel backup"
                                >
                                    <Icons.X size={16} />
                                </button>
                            )}
                            {backupState === 'done' && <Icons.Check size={16} className="text-accent shrink-0" />}
                            {backupState === 'cancelled' && <Icons.X size={16} className="text-red-400 shrink-0" />}
                        </div>
                        {backupState === 'cancelled' && (
                            <p className="text-[12px] text-red-400 mt-1">Backup was cancelled at {backupProgress}%</p>
                        )}
                    </div>
                )}
                <SettingsRow icon={<Icons.Archive size={22} />} title="Chat history" subtitle="Transfer or clear chats" />
            </div>

            {/* Theme Picker */}
            {modal === 'theme' && (
                <PickerModal
                    title="Choose theme"
                    options={themeOptions}
                    selected={selectedThemeOption}
                    onSelect={handleThemeSelect}
                    onClose={() => setModal(null)}
                />
            )}

            {/* Font Size Picker */}
            {modal === 'fontSize' && (
                <PickerModal
                    title="Font size"
                    options={fontOptions}
                    selected={fontSize}
                    onSelect={handleFontSelect}
                    onClose={() => setModal(null)}
                />
            )}
        </div>
    );
};

export default ChatsSettingsScreen;
