import React from 'react';
import { Icons } from '@constants/icons';

const AdPreferences = ({ onBack }) => {
    return (
        <div className="flex flex-col h-full w-full animate-fade-in bg-bg-surface">
            {/* --- Header --- */}
            <header className="px-4 py-5 flex items-center gap-6 sticky top-0 z-50 shadow-sm bg-bg-surface">
                <button
                    onClick={onBack}
                    className="p-1 hover:bg-bg-hover rounded-full transition-colors active:scale-95 text-text-primary"
                >
                    <Icons.ArrowLeft size={24} />
                </button>
                <h1 className="text-[20px] font-medium text-text-primary">
                    Ad preferences
                </h1>
            </header>

            {/* --- Content Area --- */}
            <div className="flex-1 py-6">

                {/* Intro Text */}
                <p className="text-[14px] leading-relaxed text-text-secondary mb-8 px-6">
                    View ad details and hide or unhide advertisers. Ads are only in Status and Channels.{' '}
                    <span className="text-accent cursor-pointer">Learn more</span>
                </p>

                {/* Options List — full-width hover, aligned with SettingsRow */}
                <div className="flex flex-col">
                    {/* Recent Ad Activity */}
                    <div className="flex items-center px-5 py-4 cursor-pointer hover:bg-bg-hover transition-colors group w-full">
                        <div className="mr-6 flex shrink-0 w-6 items-center justify-center text-text-secondary">
                            <Icons.History size={22} className="opacity-70" />
                        </div>
                        <span className="text-[16.5px] text-text-primary flex-1">Recent ad activity</span>
                        <Icons.ChevronRight size={18} className="text-text-secondary opacity-40 shrink-0" />
                    </div>

                    {/* Advertisers you've seen */}
                    <div className="flex items-center px-5 py-4 cursor-pointer hover:bg-bg-hover transition-colors group w-full">
                        <div className="mr-6 flex shrink-0 w-6 items-center justify-center text-text-secondary">
                            <Icons.Users size={22} className="opacity-70" />
                        </div>
                        <span className="text-[16.5px] text-text-primary flex-1">Advertisers you've seen</span>
                        <Icons.ChevronRight size={18} className="text-text-secondary opacity-40 shrink-0" />
                    </div>
                </div>

                {/* Encryption Footer Note */}
                <div className="mt-10 mx-6 pt-6 border-t border-border-main/5 flex gap-4">
                    <Icons.Lock size={16} className="text-text-secondary opacity-50 mt-1 shrink-0" />
                    <p className="text-[13px] leading-relaxed text-text-secondary">
                        Your personal messages, calls and statuses are{' '}
                        <span className="text-accent">end-to-end encrypted</span> and can't be used to show you ads.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdPreferences;
