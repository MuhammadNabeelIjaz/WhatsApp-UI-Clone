import React, { useState } from 'react';
import { Icons } from '@constants/icons';

const PRESETS = [
    { emoji: '🟢', label: 'Free to chat' },
    { emoji: '⏰', label: 'Slow to respond' },
    { emoji: '🤩', label: 'Hanging with friends' },
    { emoji: '✈️', label: 'Travelling' },
    { emoji: '🔥', label: 'Excited!' },
];

const AboutScreen = ({ onBack, about: initialAbout, onSave }) => {
    const [about, setAbout] = useState(initialAbout || 'إِيَّاك نَعْبُدُ وَ إِيَّاكَ نَسْتَعِينُ');
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        if (onSave) onSave(about);
        setSaved(true);
        setTimeout(() => onBack(), 300);
    };

    return (
        <div className="flex flex-col h-full w-full select-none bg-bg-surface animate-fade-in">
            {/* Header */}
            <header className="px-4 py-3 flex items-center sticky top-0 z-[100] bg-bg-surface">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-bg-hover rounded-full transition-all active:scale-90 text-text-primary cursor-pointer"
                >
                    <Icons.ArrowLeft size={24} />
                </button>
                <h1 className="ml-4 text-[20px] font-bold text-text-primary flex-1">About</h1>
                {about && (
                    <button
                        onClick={() => setAbout('')}
                        className="text-accent text-[15px] font-medium hover:opacity-80"
                    >
                        Clear
                    </button>
                )}
            </header>

            {/* Input */}
            <div className="px-6 pt-6">
                <div className="flex items-center gap-3 border-b-2 border-accent pb-2">
                    <button className="text-text-secondary hover:text-accent">
                        <Icons.Smile size={22} />
                    </button>
                    <input
                        type="text"
                        value={about}
                        onChange={e => setAbout(e.target.value)}
                        className="flex-1 bg-transparent text-text-primary text-[16px] outline-none text-right"
                        dir="auto"
                        autoFocus
                    />
                    <span className="text-[12px] text-text-secondary min-w-[20px] text-right">
                        {about.length}
                    </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                    <Icons.EyeOff size={14} className="text-text-secondary" />
                    <p className="text-[12px] text-text-secondary">
                        Visible in chats to: <span className="text-accent font-medium">Nobody</span>
                    </p>
                </div>
                <div className="flex items-center gap-2 mt-3">
                    <Icons.History size={16} className="text-text-secondary" />
                    <div>
                        <p className="text-[14px] text-text-primary">Duration</p>
                        <p className="text-[12px] text-text-secondary">1 day</p>
                    </div>
                </div>
            </div>

            {/* Presets */}
            <div className="mt-6">
                <p className="px-6 text-[13px] text-text-secondary mb-2">Select</p>
                <div className="flex flex-col">
                    {PRESETS.map((p) => (
                        <button
                            key={p.label}
                            onClick={() => setAbout(p.label)}
                            className="flex items-center gap-4 px-6 py-4 hover:bg-bg-hover active:scale-[0.99] transition-all text-left"
                        >
                            <span className="text-[22px]">{p.emoji}</span>
                            <span className="text-[16px] text-text-primary">{p.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Save FAB */}
            <div className="absolute bottom-8 right-6">
                <button
                    onClick={handleSave}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl active:scale-95 transition-all ${saved ? 'bg-green-500' : 'bg-accent hover:brightness-110'}`}
                >
                    <Icons.Check size={26} className="text-white" />
                </button>
            </div>
        </div>
    );
};

export default AboutScreen;
