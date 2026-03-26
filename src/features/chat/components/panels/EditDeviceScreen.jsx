import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '@constants/icons';
import ScreenHeader from '@shared/ui/layout/ScreenHeader';
import logger from '@core/utils/logger';

const EditDeviceScreen = ({ device, onBack, onLogout, onRename }) => {
    const [confirm, setConfirm]           = useState(false);
    const [deviceName, setDeviceName]     = useState(device?.name || 'Windows');
    const [showEditSheet, setShowEditSheet] = useState(false);
    const [editNameDraft, setEditNameDraft] = useState('');
    const editInputRef = useRef(null);

    useEffect(() => {
        if (showEditSheet) {
            setEditNameDraft(deviceName);
            setTimeout(() => editInputRef.current?.focus(), 100);
            logger.event('EditDeviceScreen', 'edit_sheet_open');
        }
    }, [showEditSheet, deviceName]);

    const handleSaveName = () => {
        if (editNameDraft.trim()) {
            logger.event('EditDeviceScreen', 'device_name_save', { name: editNameDraft.trim() });
            setDeviceName(editNameDraft.trim());
            onRename?.(device?.id, editNameDraft.trim());
        } else {
            logger.skip('EditDeviceScreen', 'empty name, skipping save');
        }
        setShowEditSheet(false);
    };

    const handleLogout = () => {
        if (confirm) {
            logger.event('EditDeviceScreen', 'device_logout', { id: device?.id });
            onLogout?.(device?.id);
        } else {
            setConfirm(true);
        }
    };

    return (
        <div className="absolute inset-0 bg-bg-surface z-[1100] flex flex-col animate-fade-in">
            <ScreenHeader
                title="Edit device"
                onBack={onBack}
                rightActions={
                    <button
                        onClick={() => { setShowEditSheet(true); logger.event('EditDeviceScreen', 'pencil_click'); }}
                        className="p-2 hover:bg-bg-hover rounded-full text-text-secondary transition-all active:scale-90"
                    >
                        <Icons.Pencil size={20} />
                    </button>
                }
            />

            <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                <div className="flex flex-col items-center pt-8 pb-6">
                    <div className="w-24 h-24 rounded-full bg-accent/80 flex items-center justify-center mb-4 shadow-lg">
                        <Icons.Monitor size={42} className="text-white" />
                    </div>
                    <h3 className="text-[20px] font-semibold text-text-primary">{deviceName}</h3>
                    <p className="text-[13px] text-text-secondary mt-1">Device name</p>
                </div>

                {/* Device details */}
                <div className="mx-4 bg-bg-surface rounded-xl border border-border-main/30 overflow-hidden mb-4">
                    {[
                        { icon: <Icons.History size={19} />, label: `Last active ${device?.lastActive || 'today at 2:34 am'}` },
                        { icon: <Icons.Globe size={19} />,   label: deviceName },
                        { icon: <Icons.MapPin size={19} />,  label: 'Linked at Lahore' },
                    ].map((row, i, arr) => (
                        <div key={i} className={`flex items-center gap-4 px-4 py-4 ${i < arr.length - 1 ? 'border-b border-border-main/20' : ''}`}>
                            <span className="text-text-secondary">{row.icon}</span>
                            <span className="text-[14.5px] text-text-primary">{row.label}</span>
                        </div>
                    ))}
                </div>

                {/* Log out */}
                <div className="mx-4 mb-4">
                    <button
                        onClick={handleLogout}
                        className="w-full border border-red-500/50 text-red-500 py-[11px] rounded-full font-semibold text-[15px] hover:bg-red-500/5 active:scale-[0.98] transition-all"
                    >
                        {confirm ? 'Tap again to confirm log out' : 'Log out'}
                    </button>
                </div>

                <p className="px-5 pb-8 text-[12.5px] text-text-secondary text-center leading-relaxed">
                    If you don't recognise this device or can't access it any longer you should log out of it.
                </p>

                {/* ── Bottom Sheet — Edit device name  ─────────── */}
                {showEditSheet && (
                    <div
                        className="absolute inset-0 bg-black/50 flex items-end z-[2000]"
                        onClick={() => setShowEditSheet(false)}
                    >
                        <div
                            className="w-full bg-bg-surface rounded-t-2xl px-6 pt-6 pb-10 animate-slide-in-up"
                            onClick={e => e.stopPropagation()}
                        >
                            <h3 className="text-[17px] font-semibold text-text-primary mb-6">Edit device name</h3>

                            {/* Underlined input */}
                            <div className="border-b-2 border-accent pb-1 mb-6">
                                <input
                                    ref={editInputRef}
                                    type="text"
                                    value={editNameDraft}
                                    onChange={e => setEditNameDraft(e.target.value)}
                                    maxLength={50}
                                    className="w-full bg-transparent text-[16px] text-text-primary outline-none placeholder:text-text-secondary"
                                    placeholder="Device name"
                                    onKeyDown={e => { if (e.key === 'Enter') handleSaveName(); }}
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowEditSheet(false)}
                                    className="flex-1 py-3 rounded-full border border-border-main/40 text-text-secondary font-semibold text-[14px] hover:bg-bg-hover transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveName}
                                    className="flex-1 py-3 rounded-full bg-accent text-white font-semibold text-[14px] hover:opacity-90 active:scale-[0.98] transition-all"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditDeviceScreen;
