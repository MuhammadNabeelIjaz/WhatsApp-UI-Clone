import React from 'react';
import { Icons } from '@constants/icons';

const ChatLock = ({ onBack }) => {
    return (
        <div className="flex flex-col h-full w-full bg-bg-surface animate-fade-in text-text-primary">

            {/* --- Header --- */}
            <header className="px-4 py-3 flex items-center shrink-0">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-bg-hover rounded-full transition-all active:scale-90"
                >
                    <Icons.ArrowLeft size={24} />
                </button>
                <h1 className="ml-4 text-[20px] font-medium">Chat lock</h1>
            </header>

            {/* --- Content --- */}
            <div className="flex-1 overflow-y-auto px-6 pt-8 text-center flex flex-col items-center">

                {/* Visual Illustration based on Image */}
                <div className="relative mb-10">
                    <div className="w-32 h-20 bg-accent/10 rounded-lg flex items-center justify-center relative border border-accent/20">
                        {/* Box Lines Graphic */}
                        <div className="flex flex-col gap-2 w-16">
                            <div className="h-1 w-full bg-accent/30 rounded-full" />
                            <div className="h-1 w-2/3 bg-accent/30 rounded-full" />
                        </div>
                        {/* Floating Lock Icon */}
                        <div className="absolute -right-4 -bottom-2 bg-[#25D366] p-3 rounded-xl shadow-lg border-2 border-bg-surface">
                            <Icons.Lock size={32} className="text-bg-main" />
                        </div>
                    </div>
                </div>

                <h2 className="text-[22px] font-medium leading-tight mb-6">
                    Chat lock keeps your chats locked and hidden
                </h2>

                <p className="text-[14.5px] text-text-secondary leading-relaxed mb-1">
                    If you have locked chats, pull down on your chat list or type your secret code in the search bar to find them.
                </p>
                <span className="text-accent text-[14.5px] font-medium cursor-pointer hover:underline mb-16">
                    Learn more
                </span>

                {/* --- Bottom Action Section --- */}
                <div className="w-full text-left border-t border-border-main/10 pt-8 mt-auto pb-10">
                    <h3 className="text-[16px] font-medium mb-2">
                        Unlock and clear locked chats
                    </h3>
                    <p className="text-[14px] text-text-secondary leading-snug">
                        If you forgot your secret code, you can clear it. This will also unlock and clear messages, photos and videos in locked chats.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChatLock;