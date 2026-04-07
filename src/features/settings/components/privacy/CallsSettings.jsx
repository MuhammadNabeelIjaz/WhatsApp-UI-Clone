import React, { useState } from 'react';
import { Icons } from '@constants/icons';
const CallsSettings = ({ onBack }) => {
    const [silenceUnknown, setSilenceUnknown] = useState(true);

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
                    Calls
                </h1>
            </header>

            {/* --- Content Area --- */}
            <div className="flex-1 px-6 py-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <h3 className="text-[16.5px] text-text-primary mb-1">
                            Silence unknown callers
                        </h3>
                        <p className="text-[14px] text-text-secondary leading-relaxed">
                            Calls from unknown numbers will be silenced. They will still be shown in the Calls tab and in your notifications. <span className="text-accent cursor-pointer hover:underline">Learn more</span>
                        </p>
                    </div>

                    {/* WhatsApp Style Toggle Switch */}
                    <button
                        onClick={() => setSilenceUnknown(!silenceUnknown)}
                        className={`mt-1 w-10 h-5 rounded-full relative transition-colors duration-200 ease-in-out ${silenceUnknown ? 'bg-accent/40' : 'bg-border-main/30'}`}
                    >
                        <div className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full shadow-md transition-all duration-200 ${silenceUnknown ? 'right-0 bg-accent' : 'left-0 bg-[#b1b1b1]'}`} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CallsSettings;