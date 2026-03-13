import React from 'react';

/**
 * PickerModal — radio-option picker modal used in settings screens.
 * Identical pattern extracted from NotificationsSettingsScreen,
 * StorageSettingsScreen, and ChatsSettingsScreen.
 *
 * Props:
 *   title    — modal title string
 *   options  — string[]
 *   selected — currently selected option string
 *   onSelect — (value: string) => void
 *   onClose  — close handler
 */
const PickerModal = ({ title, options, selected, onSelect, onClose }) => (
    <div
        className="fixed inset-0 flex items-center justify-center z-[200] bg-black/60 animate-fade-in"
        onClick={onClose}
    >
        <div
            className="w-[320px] rounded-2xl bg-bg-surface shadow-2xl overflow-hidden animate-zoom-in"
            onClick={e => e.stopPropagation()}
        >
            <h2 className="text-[18px] font-semibold text-text-primary px-6 pt-6 pb-4">{title}</h2>
            <div className="flex flex-col">
                {options.map(opt => (
                    <label
                        key={opt}
                        className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-bg-hover transition-colors"
                        onClick={() => { onSelect(opt); setTimeout(onClose, 150); }}
                    >
                        <span className="text-[16px] text-text-primary">{opt}</span>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selected === opt ? 'border-accent' : 'border-text-secondary/40'}`}>
                            {selected === opt && <div className="w-2.5 h-2.5 rounded-full bg-accent animate-zoom-in" />}
                        </div>
                    </label>
                ))}
            </div>
            <div className="flex justify-end px-6 pb-5 pt-2">
                <button
                    onClick={onClose}
                    className="text-accent font-bold text-[14px] px-4 py-2 hover:bg-accent/10 rounded-full transition-colors"
                >
                    CANCEL
                </button>
            </div>
        </div>
    </div>
);

export default PickerModal;
