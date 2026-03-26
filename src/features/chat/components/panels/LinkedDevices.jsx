import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFakeLoading } from '@shared/hooks';
import { Icons } from '@constants/icons';
import ScreenHeader from '@shared/ui/layout/ScreenHeader';
import ScanQRLinkScreen from './ScanQRLinkScreen';
import EditDeviceScreen from './EditDeviceScreen';
import { SettingsRowSkeleton } from '@shared/ui/display/Skeletons';
import { removeDevice, renameDevice, selectLinkedDevices } from '@core/store/slices/linkedDevicesSlice';

const LinkedDevices = ({ onBack }) => {
    const dispatch = useDispatch();
    const devices = useSelector(selectLinkedDevices);
    const [view, setView] = useState('main');
    const [selectedDevice, setSelectedDevice] = useState(null);
    const isLoading = useFakeLoading(450);

    const handleRemove = (id) => { dispatch(removeDevice(id)); setView('main'); };
    const handleRename = (id, name) => dispatch(renameDevice({ id, name }));

    if (isLoading) return (
        <div className="absolute inset-0 bg-bg-surface z-[1000] flex flex-col animate-fade-in">
            <div className="px-4 py-3 flex items-center gap-4 border-b border-border-main/10 h-[56px] shrink-0">
                <div className="skeleton-bone w-8 h-8 rounded-full" />
                <div className="skeleton-bone h-5 w-32 rounded" />
            </div>
            <div className="flex-1 overflow-hidden py-4">
                <div className="flex justify-center mb-6 px-6">
                    <div className="skeleton-bone w-[200px] h-[130px] rounded-3xl" />
                </div>
                <div className="skeleton-bone h-3 w-[70%] mx-auto rounded mb-6" />
                {Array.from({ length: 3 }, (_, i) => <SettingsRowSkeleton key={i} hasSubtitle />)}
            </div>
        </div>
    );
    if (view === 'scan-qr') return <ScanQRLinkScreen onBack={() => setView('main')} />;
    if (view === 'edit-device') return (
        <EditDeviceScreen
            device={selectedDevice}
            onBack={() => setView('main')}
            onLogout={(id) => handleRemove(id)}
            onRename={(id, name) => handleRename(id, name)}
        />
    );

    return (
        <div className="absolute inset-0 bg-bg-surface z-[1000] flex flex-col animate-fade-in">
            <ScreenHeader title="Linked devices" onBack={onBack} />
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="flex flex-col items-center pt-6 px-6 max-w-[550px] mx-auto">
                    <div className="w-full flex justify-center mb-8">
                        <div className="relative w-[240px] h-[160px] bg-accent-soft rounded-3xl flex items-center justify-center p-6 shadow-inner overflow-hidden">
                            <div className="flex items-end gap-2 scale-110">
                                <div className="w-10 h-18 bg-bg-surface border-2 border-accent rounded-lg relative shadow-sm">
                                    <div className="absolute top-2 left-2 right-2 h-1 bg-accent opacity-20" />
                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 border border-accent rounded-full" />
                                </div>
                                <div className="w-24 h-16 bg-accent rounded-t-lg border-2 border-accent relative shadow-md">
                                    <div className="absolute inset-2 bg-white/20 rounded-sm" />
                                    <div className="absolute -bottom-1.5 -left-2 -right-2 h-1.5 bg-accent/80 rounded-b-lg" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-center mb-6">
                        <p className="text-[14px] text-text-secondary leading-relaxed">
                            You can link other devices to this account. <br />
                            <span className="text-status-success hover:underline cursor-pointer font-medium">Learn more</span>
                        </p>
                    </div>
                    <button
                        onClick={() => setView('scan-qr')}
                        className="w-full bg-accent hover:opacity-90 text-text-inverse py-[10px] rounded-full font-semibold text-[14px] shadow-md active:scale-[0.98] transition-all mb-10"
                    >
                        Link a device
                    </button>
                    <div className="w-full border-t border-border-main pt-6">
                        <h3 className="text-[13px] text-text-secondary font-semibold uppercase tracking-wider mb-1 opacity-80">Device Status</h3>
                        <p className="text-[13px] text-text-secondary mb-4 italic">Tap a device to manage.</p>
                        <div className="space-y-4">
                            {devices.map((device) => (
                                <div
                                    key={device.id}
                                    onClick={() => { setSelectedDevice(device); setView('edit-device'); }}
                                    className="flex items-center gap-3 group cursor-pointer hover:bg-bg-hover p-3 -mx-3 rounded-xl transition-all"
                                >
                                    <div className="w-12 h-12 bg-[#00897b] rounded-full flex items-center justify-center text-white group-hover:brightness-110 transition-all">
                                        <Icons.Monitor size={24} />
                                    </div>
                                    <div className="flex-1 border-b border-border-main/50 pb-3 group-last:border-none">
                                        <h4 className="text-[16px] text-text-primary font-medium">{device.name}</h4>
                                        <p className="text-[13px] text-text-secondary mt-0.5">Last active {device.lastActive}</p>
                                    </div>
                                </div>
                            ))}
                            {devices.length === 0 && (
                                <p className="text-[14px] text-text-secondary text-center py-4">No linked devices</p>
                            )}
                        </div>
                    </div>
                    <div className="py-12 flex flex-col items-center gap-2 opacity-60">
                        <div className="flex items-center gap-1.5 text-[12px] text-text-secondary">
                            <Icons.Lock size={12} className="text-status-success" />
                            <span>Your personal messages are <span className="text-status-success font-medium">end-to-end encrypted</span></span>
                        </div>
                        <p className="text-[12px] text-text-secondary">on all your devices.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LinkedDevices;
