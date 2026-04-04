import React, { useState } from 'react';
import { Icons } from '@constants/icons';
import RadioOption from '@shared/ui/forms/RadioOption';
const LastSeenPrivacy = ({ onBack }) => {
    // State for radio selections
    const [lastSeen, setLastSeen] = useState('nobody');
    const [onlineStatus, setOnlineStatus] = useState('same');


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
                    Last seen and online
                </h1>
            </header>

            {/* --- Content Area --- */}
            <div className="flex-1 overflow-y-auto px-6 pt-6">

                {/* Section 1: Who can see my last seen */}
                <div className="mb-8">
                    <h3 className="text-[14px] font-medium text-text-secondary mb-2 opacity-80 uppercase tracking-wide">
                        Who can see my last seen
                    </h3>
                    <div className="flex flex-col">
                        <RadioOption label="Everyone" value="everyone" current={lastSeen} onChange={setLastSeen} name="lastSeen" />
                        <RadioOption label="My contacts" value="contacts" current={lastSeen} onChange={setLastSeen} name="lastSeen" />
                        <RadioOption label="My contacts except..." value="except" current={lastSeen} onChange={setLastSeen} name="lastSeen" />
                        <RadioOption label="Nobody" value="nobody" current={lastSeen} onChange={setLastSeen} name="lastSeen" />
                    </div>
                </div>

                <div className="h-[1px] w-full bg-border-main/5 mb-8" />

                {/* Section 2: Who can see when I'm online */}
                <div className="mb-8">
                    <h3 className="text-[14px] font-medium text-text-secondary mb-2 opacity-80 uppercase tracking-wide">
                        Who can see when I'm online
                    </h3>
                    <div className="flex flex-col">
                        <RadioOption label="Everyone" value="everyone" current={onlineStatus} onChange={setOnlineStatus} name="online" />
                        <RadioOption label="Same as last seen" value="same" current={onlineStatus} onChange={setOnlineStatus} name="online" />
                    </div>
                </div>

                {/* Info Footer */}
                <p className="text-[13.5px] leading-relaxed text-text-secondary opacity-70 pr-4">
                    If you don't share when you were last seen or online, you won't be able to see when other people were last seen or online.
                </p>

            </div>
        </div>
    );
};

export default LastSeenPrivacy;