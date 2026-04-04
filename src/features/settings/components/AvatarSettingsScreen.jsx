import React, { useState } from 'react';
import { Icons } from '@constants/icons';

const AVATAR_STYLES = [
    { bg: '#1a3a2a', emoji: '👨‍💻' },
    { bg: '#2a1a3a', emoji: '🧑‍🎨' },
    { bg: '#3a2a1a', emoji: '🧑‍🚀' },
    { bg: '#1a2a3a', emoji: '🧑‍🔬' },
];

const AvatarSettingsScreen = ({ onBack }) => {
    const [created, setCreated] = useState(false);
    const [selected, setSelected] = useState(0);

    return (
        <div className="flex flex-col h-full w-full overflow-hidden bg-bg-surface">
            <header className="px-4 py-3 flex items-center shrink-0 border-b border-border-main/5 bg-bg-surface">
                <button onClick={onBack} className="p-2 hover:bg-bg-hover rounded-full transition-all active:scale-90 text-text-primary">
                    <Icons.ArrowLeft size={24} />
                </button>
                <h1 className="ml-4 text-[20px] font-bold text-text-primary flex-1">Avatar</h1>
            </header>

            <div className="flex-1 flex flex-col items-center px-8 overflow-y-auto custom-scrollbar">
                {!created ? (
                    <>
                        {/* Illustration */}
                        <div className="mt-12 mb-8 flex gap-4">
                            {AVATAR_STYLES.map((s, i) => (
                                <div key={i} className="w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg" style={{ backgroundColor: s.bg }}>
                                    {s.emoji}
                                </div>
                            ))}
                        </div>

                        <div className="text-center w-full max-w-[320px]">
                            <h2 className="text-[18px] font-semibold text-text-primary leading-tight mb-3">
                                Say more with Avatars now on WhatsApp
                            </h2>
                            <p className="text-[14px] text-text-secondary mb-8 leading-relaxed">
                                Create a digital you. Use your avatar as a profile photo or share it as stickers.
                            </p>

                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={() => setCreated(true)}
                                    className="w-full py-3 rounded-full text-[15px] font-bold bg-accent text-white hover:brightness-110 active:scale-95 transition-all shadow-md"
                                >
                                    Create your Avatar
                                </button>
                                <button className="text-[14px] font-semibold text-accent hover:underline">
                                    Learn more
                                </button>
                            </div>
                        </div>

                        <p className="mt-auto mb-10 text-[12px] text-text-secondary opacity-50 text-center px-4">
                            Your avatar is private and can be used as a profile photo or stickers.
                        </p>
                    </>
                ) : (
                    /* Avatar Editor state */
                    <div className="w-full pt-8 pb-10">
                        <h2 className="text-[18px] font-semibold text-text-primary mb-6 text-center">Choose your Avatar</h2>

                        <div className="grid grid-cols-4 gap-4 mb-8">
                            {AVATAR_STYLES.map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelected(i)}
                                    className={`aspect-square rounded-2xl flex items-center justify-center text-3xl transition-all active:scale-95 border-2
                                        ${selected === i ? 'border-accent scale-105 shadow-xl' : 'border-transparent opacity-60'}`}
                                    style={{ backgroundColor: s.bg }}
                                >
                                    {s.emoji}
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-col gap-3">
                            <button className="w-full py-3 rounded-full bg-accent text-white font-bold text-[14px] active:scale-95 transition-all shadow-md">
                                Use as profile photo
                            </button>
                            <button
                                onClick={() => setCreated(false)}
                                className="w-full py-3 rounded-full border border-border-main/20 text-text-secondary font-medium text-[14px] active:scale-95 transition-all"
                            >
                                Start over
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AvatarSettingsScreen;
