import React, { useState } from 'react';
import { useFakeLoading } from '@shared/hooks';
import { SettingsSubScreenSkeleton } from '@shared/ui/display/Skeletons';
import { Icons } from '@constants/icons';
import SettingsRow from '@shared/ui/settings/SettingsRow';
import ToggleSwitch from '@shared/ui/buttons/ToggleSwitch';
import { PickerModal } from '@shared/ui/settings';
import SectionHeader from '@shared/ui/settings/SectionHeader';

const QUALITY_OPTS = ["Standard quality", "HD quality", "Best quality"];
const DOWNLOAD_QUALITY_OPTS = ["Auto", "Standard", "HD"];
const DATA_OPTS = ["Photos", "Audio", "Videos", "Documents", "All media", "No media"];


// Manage Storage sub-screen
const ManageStorageScreen = ({ onBack }) => {
    const contacts = [
        { name: "Muhammad Nabeel Ijaz", size: "1.2 GB", msgs: 4821, img: "https://i.pravatar.cc/150?u=1" },
        { name: "Ali Hamza", size: "342 MB", msgs: 1203, img: "https://i.pravatar.cc/150?u=2" },
        { name: "Home nisht...", size: "287 MB", msgs: 890, img: null },
        { name: "Info Groups", size: "180 MB", msgs: 456, img: null },
        { name: "Farhan Bhai", size: "94 MB", msgs: 234, img: "https://i.pravatar.cc/150?u=3" },
    ];
    return (
        <div className="flex flex-col h-full w-full bg-bg-surface">
            <header className="px-4 py-3 flex items-center gap-4 sticky top-0 bg-bg-surface border-b border-border-main/5">
                <button onClick={onBack} className="p-2 hover:bg-bg-hover rounded-full text-text-primary"><Icons.ArrowLeft size={24} /></button>
                <h1 className="text-[20px] font-bold text-text-primary flex-1">Manage storage</h1>
            </header>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {/* Storage bar */}
                <div className="mx-5 my-6 p-4 rounded-2xl bg-bg-hover">
                    <div className="flex justify-between mb-2">
                        <span className="text-text-secondary text-[13px]">WhatsApp</span>
                        <span className="text-text-primary text-[13px] font-medium">2.6 GB of 15 GB used</span>
                    </div>
                    <div className="w-full h-2 bg-border-main/20 rounded-full overflow-hidden">
                        <div className="h-full bg-accent rounded-full" style={{ width: '17%' }} />
                    </div>
                </div>
                <SectionHeader label="Chats" />
                {contacts.map((c, i) => (
                    <div key={i} className="flex items-center gap-4 px-5 py-3 hover:bg-bg-hover cursor-pointer transition-colors">
                        <div className="w-11 h-11 rounded-full overflow-hidden bg-bg-hover shrink-0 flex items-center justify-center">
                            {c.img ? <img src={c.img} className="w-full h-full object-cover" alt="" /> : <Icons.UserRound size={22} className="text-text-secondary" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-text-primary font-medium truncate">{c.name}</p>
                            <p className="text-text-secondary text-[13px]">{c.msgs} messages</p>
                        </div>
                        <span className="text-text-secondary text-[13px]">{c.size}</span>
                        <Icons.ChevronRight size={16} className="text-text-secondary opacity-40" />
                    </div>
                ))}
            </div>
        </div>
    );
};

// Network Usage sub-screen
const NetworkUsageScreen = ({ onBack }) => {
    const rows = [
        { label: "Messages sent", value: "1.2 MB" },
        { label: "Messages received", value: "3.4 MB" },
        { label: "Photos sent", value: "312 MB" },
        { label: "Photos received", value: "891 MB" },
        { label: "Audio sent", value: "98 MB" },
        { label: "Audio received", value: "204 MB" },
        { label: "Videos sent", value: "1.1 GB" },
        { label: "Videos received", value: "2.8 GB" },
        { label: "Calls sent", value: "234 MB" },
        { label: "Calls received", value: "312 MB" },
        { label: "Total sent", value: "1.9 GB" },
        { label: "Total received", value: "4.9 GB" },
    ];
    return (
        <div className="flex flex-col h-full w-full bg-bg-surface">
            <header className="px-4 py-3 flex items-center gap-4 sticky top-0 bg-bg-surface border-b border-border-main/5">
                <button onClick={onBack} className="p-2 hover:bg-bg-hover rounded-full text-text-primary"><Icons.ArrowLeft size={24} /></button>
                <h1 className="text-[20px] font-bold text-text-primary flex-1">Network usage</h1>
            </header>
            <div className="flex-1 overflow-y-auto custom-scrollbar px-5 py-4 pb-10">
                <p className="text-[13px] text-text-secondary mb-6 opacity-70">Since last reset — since this phone was last reset.</p>
                {rows.map((r, i) => (
                    <div key={i} className={`flex justify-between py-3 ${i < rows.length - 1 ? 'border-b border-border-main/5' : ''}`}>
                        <span className={`text-text-${i >= rows.length - 2 ? 'primary font-medium' : 'secondary'} text-[15px]`}>{r.label}</span>
                        <span className="text-text-primary text-[15px]">{r.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const StorageSettingsScreen = ({ onBack }) => {
    const [subScreen, setSubScreen] = useState(null);
    const isLoading = useFakeLoading(440);
    const [modal, setModal] = useState(null);
    const [showProxyInfo, setShowProxyInfo] = useState(false);
    const [lessDataCalls, setLessDataCalls] = useState(false);
    const [selections, setSelections] = useState({
        uploadQuality: "Standard quality",
        downloadQuality: "Auto",
        mobileData: "Photos",
        wifi: "All media",
        roaming: "No media",
    });

    if (subScreen === 'storage') return <ManageStorageScreen onBack={() => setSubScreen(null)} />;
    if (subScreen === 'network') return <NetworkUsageScreen onBack={() => setSubScreen(null)} />;

    const openModal = (key, title, options) => setModal({ key, title, options });

    if (isLoading) return <SettingsSubScreenSkeleton rowCount={6} />;

    return (
        <div className="flex flex-col h-full w-full overflow-hidden bg-bg-surface">
            <header className="px-4 py-3 flex items-center shrink-0 border-b border-border-main/5 bg-bg-surface">
                <button onClick={onBack} className="p-2 hover:bg-bg-hover rounded-full transition-all active:scale-90 text-text-primary">
                    <Icons.ArrowLeft size={24} />
                </button>
                <h1 className="ml-4 text-[20px] font-bold text-text-primary flex-1">Storage and data</h1>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="mt-2">
                    <SettingsRow icon={<Icons.FolderOpen size={22} />} title="Manage storage" subtitle="2.6 GB" onClick={() => setSubScreen('storage')} />
                    <SettingsRow icon={<Icons.PieChart size={22} />} title="Network usage" subtitle="1.9 GB sent • 4.9 GB received" onClick={() => setSubScreen('network')} />
                    <div className="h-px w-[90%] mx-auto bg-border-main/5 my-1" />
                    <SettingsRow title="Use less data for calls"
                        rightElement={<ToggleSwitch checked={lessDataCalls} onChange={() => setLessDataCalls(!lessDataCalls)} />} />
                    <SettingsRow title="Proxy" subtitle="Off" onClick={() => setShowProxyInfo(true)} />
                </div>

                <div className="h-px w-full my-2 bg-border-main/5" />

                <section>
                    <SectionHeader label="Media Quality" />
                    <SettingsRow icon={<Icons.ArrowUpCircle size={22} />} title="Media upload quality" subtitle={selections.uploadQuality}
                        onClick={() => openModal('uploadQuality', 'Media upload quality', QUALITY_OPTS)} />
                    <SettingsRow title="Auto-download quality" subtitle={selections.downloadQuality}
                        onClick={() => openModal('downloadQuality', 'Auto-download quality', DOWNLOAD_QUALITY_OPTS)} />
                </section>

                <div className="h-px w-full my-2 bg-border-main/5" />

                <section className="pb-10">
                    <div className="px-5 py-4">
                        <SectionHeader label="Media auto-download" className="px-0 pt-0" />
                        <p className="text-[13px] mt-2 text-text-secondary leading-snug">Voice messages are always automatically downloaded.</p>
                    </div>
                    <SettingsRow title="When using mobile data" subtitle={selections.mobileData}
                        onClick={() => openModal('mobileData', 'When using mobile data', DATA_OPTS)} />
                    <SettingsRow title="When connected on Wi-Fi" subtitle={selections.wifi}
                        onClick={() => openModal('wifi', 'When on Wi-Fi', DATA_OPTS)} />
                    <SettingsRow title="When roaming" subtitle={selections.roaming}
                        onClick={() => openModal('roaming', 'When roaming', DATA_OPTS)} />
                </section>
            </div>

            {modal && (
                <PickerModal
                    title={modal.title}
                    options={modal.options}
                    selected={selections[modal.key]}
                    onSelect={(val) => setSelections(p => ({ ...p, [modal.key]: val }))}
                    onClose={() => setModal(null)}
                />
            )}
            {showProxyInfo && (
                <div className="fixed inset-0 z-210 flex items-center justify-center bg-black/60" onClick={() => setShowProxyInfo(false)}>
                    <div className="w-[320px] rounded-3xl bg-bg-surface p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <h2 className="text-[18px] font-semibold text-text-primary mb-2">Proxy</h2>
                        <p className="text-text-secondary text-[14px] leading-snug mb-4">
                            Proxy support is not available in this demo app, but you can manage call connection settings in WhatsApp real app settings.
                        </p>
                        <button onClick={() => { setShowProxyInfo(false); }} className="w-full py-3 rounded-full bg-accent text-white text-[14px] font-medium hover:opacity-90 transition-all">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StorageSettingsScreen;
