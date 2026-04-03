import React from 'react';
import { Icons } from '@constants/icons';
const LiveLocation = ({ onBack }) => {
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
                    Live location
                </h1>
            </header>

            {/* --- Content Area --- */}
            <div className="flex-1 flex flex-col items-center justify-start px-8 pt-16 text-center">
                {/* Custom Green Location Illustration */}
                <div className="relative mb-10 flex items-center justify-center">
                    {/* Pulsing Waves Animation */}
                    <div className="absolute w-24 h-24 border-2 border-accent/30 rounded-full animate-ping" />
                    <div className="absolute w-32 h-32 border-2 border-accent/10 rounded-full animate-pulse" />

                    {/* Main Icon Container */}
                    <div className="relative z-10 flex items-center gap-2">
                        <div className="text-accent transform -scale-x-100 opacity-60">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2 12h.01M5 12h.01M8 12h.01" />
                            </svg>
                        </div>
                        <div className="bg-accent rounded-full p-4 shadow-lg shadow-accent/20">
                            <Icons.MapPin size={40} className="text-bg-main fill-bg-main" />
                        </div>
                        <div className="text-accent opacity-60">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 12h-.01M19 12h-.01M16 12h-.01" />
                            </svg>
                        </div>
                    </div>
                </div>

                <h2 className="text-[17px] text-text-primary font-normal mb-6">
                    You aren't sharing live location in any chats
                </h2>

                <p className="text-[14.5px] text-text-secondary leading-relaxed opacity-80">
                    Live location requires background location. You can manage this in your device settings.
                </p>
            </div>
        </div>
    );
};

export default LiveLocation;