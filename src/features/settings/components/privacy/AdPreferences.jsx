import React from 'react';
import { Icons } from '@constants/icons';

const AdPreferences = ({ onBack }) => {
    return (
        <div className="flex flex-col h-full w-full bg-bg-surface animate-fade-in">
            <header className="px-4 py-5 flex items-center gap-6 bg-bg-surface shadow-sm">
                <button onClick={onBack} className="text-text-primary">
                    <Icons.ArrowLeft size={24} />
                </button>
                <h1 className="text-[20px] font-medium text-text-primary">Ad preferences</h1>
            </header>

            <div className="flex-1 py-6">
                <p className="text-[14.5px] text-text-secondary leading-relaxed mb-8 px-6">
                    View ad details and hide or unhide advertisers. Ads are only in Status and Channels.{' '}
                    <span className="text-accent cursor-pointer">Learn more</span>
                </p>

                <div className="flex flex-col">
                    {/* Full-width hover rows — aligned with SettingsRow */}
                    <div className="flex items-center px-5 py-4 cursor-pointer hover:bg-bg-hover transition-colors group w-full">
                        <div className="mr-6 flex shrink-0 w-6 items-center justify-center text-text-secondary">
                            <Icons.History size={22} className="opacity-70" />
                        </div>
                        <span className="text-[16.5px] text-text-primary flex-1">Recent ad activity</span>
                        <Icons.ChevronRight size={18} className="text-text-secondary opacity-40 shrink-0" />
                    </div>
                    <div className="flex items-center px-5 py-4 cursor-pointer hover:bg-bg-hover transition-colors group w-full">
                        <div className="mr-6 flex shrink-0 w-6 items-center justify-center text-text-secondary">
                            <Icons.UserRound size={22} className="opacity-70" />
                        </div>
                        <span className="text-[16.5px] text-text-primary flex-1">Advertisers you've seen</span>
                        <Icons.ChevronRight size={18} className="text-text-secondary opacity-40 shrink-0" />
                    </div>
                </div>

                <div className="mt-8 mx-6 pt-6 border-t border-border-main/10">
                    <div className="flex items-start gap-3">
                        <Icons.Lock size={14} className="text-text-secondary mt-1 opacity-60 shrink-0" />
                        <p className="text-[13px] text-text-secondary leading-snug">
                            Your personal messages, calls and statuses are{' '}
                            <span className="text-[#00a884]">end-to-end encrypted</span> and can't be used to show you ads.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdPreferences;
