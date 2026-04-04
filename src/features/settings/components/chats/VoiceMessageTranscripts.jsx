import React, { useState } from 'react';
import { Icons } from '@constants/icons';

const VoiceMessageTranscripts = ({ onBack }) => {
    const [selected, setSelected] = useState('manually');

    return (
        <div className="flex flex-col h-full w-full bg-bg-surface animate-fade-in overflow-hidden">
            {/* --- Premium Header --- */}
            <header className="px-4 py-3 flex items-center gap-4 shrink-0 z-10 bg-bg-surface/90 backdrop-blur-md">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-bg-hover rounded-full text-text-secondary active:scale-75 transition-all"
                >
                    <Icons.ArrowLeft size={24} />
                </button>
                <h1 className="text-[20px] font-medium text-text-primary">Voice message transcripts</h1>
            </header>

            {/* --- Scrollable Body --- */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-md mx-auto px-6 py-8 flex flex-col items-center">

                    {/* --- Image/Illustration Section (Exact Match) --- */}
                    <div className="mb-10 w-full flex justify-center">
                        <div className="relative w-44 h-32 flex items-center justify-center">
                            {/* White Bubble with Mic Waves */}
                            <div className="absolute -left-4 top-2 w-32 h-20 bg-white rounded-[24px] rounded-bl-none flex items-center justify-center shadow-lg border border-black/5 rotate-[-5deg] z-10">
                                <div className="flex gap-1 items-center px-4 opacity-80">
                                    <Icons.Mic size={20} className="text-gray-400 mr-1" />
                                    <div className="h-4 w-1 bg-gray-300 rounded-full" />
                                    <div className="h-6 w-1 bg-gray-500 rounded-full" />
                                    <div className="h-3 w-1 bg-gray-300 rounded-full" />
                                    <div className="h-7 w-1 bg-gray-800 rounded-full" />
                                    <div className="h-5 w-1 bg-gray-400 rounded-full" />
                                </div>
                            </div>
                            {/* Green Document Bubble */}
                            <div className="absolute -right-2 top-0 w-32 h-24 bg-[#00a884] rounded-[24px] rounded-tr-none flex flex-col gap-2 p-4 justify-center shadow-xl rotate-[10deg] z-0">
                                <div className="w-16 h-1 bg-white/40 rounded-full" />
                                <div className="w-20 h-1 bg-white/40 rounded-full" />
                                <div className="w-14 h-1 bg-white/40 rounded-full" />
                            </div>
                        </div>
                    </div>

                    <h2 className="text-[24px] font-semibold text-text-primary text-center mb-4 tracking-tight">
                        Read your voice messages
                    </h2>
                    <p className="text-text-secondary text-[15px] text-center leading-snug mb-12 px-4">
                        Choose how you want to receive transcripts. You can adjust this at any time. <span className="text-sky-400 font-medium cursor-pointer">Learn more</span>
                    </p>

                    {/* --- Settings Grid/List --- */}
                    <div className="w-full space-y-9 px-2">
                        <div className="space-y-6">
                            <p className="text-text-secondary text-[14px] font-bold uppercase tracking-[1.5px] opacity-70">
                                Receive transcripts:
                            </p>

                            {/* Manual Selection */}
                            <div
                                onClick={() => setSelected('manually')}
                                className="flex items-start gap-5 cursor-pointer group select-none active:bg-bg-hover/50 p-2 -ml-2 rounded-2xl transition-all"
                            >
                                <div className={`w-[22px] h-[22px] rounded-full border-2 mt-1 flex items-center justify-center shrink-0 transition-all ${selected === 'manually' ? 'border-accent' : 'border-border-main'}`}>
                                    {selected === 'manually' && <div className="w-3 h-3 bg-accent rounded-full animate-zoom-in" />}
                                </div>
                                <div className="flex-1">
                                    <p className={`text-[17px] font-medium transition-colors ${selected === 'manually' ? 'text-accent' : 'text-text-primary'}`}>Manually</p>
                                    <p className="text-text-secondary text-[14px] leading-tight">Tap Transcribe when you want a transcript.</p>
                                </div>
                            </div>

                            {/* Never Selection */}
                            <div
                                onClick={() => setSelected('never')}
                                className="flex items-start gap-5 cursor-pointer group select-none active:bg-bg-hover/50 p-2 -ml-2 rounded-2xl transition-all"
                            >
                                <div className={`w-[22px] h-[22px] rounded-full border-2 mt-1 flex items-center justify-center shrink-0 transition-all ${selected === 'never' ? 'border-accent' : 'border-border-main'}`}>
                                    {selected === 'never' && <div className="w-3 h-3 bg-accent rounded-full animate-zoom-in" />}
                                </div>
                                <p className={`text-[17px] font-medium pt-0.5 transition-colors ${selected === 'never' ? 'text-accent' : 'text-text-primary'}`}>Never</p>
                            </div>
                        </div>

                        {/* Transcript Settings Section */}
                        <div className="space-y-5 pt-2">
                            <p className="text-text-secondary text-[14px] font-bold uppercase tracking-[1.5px] opacity-70">
                                Transcript settings:
                            </p>
                            <div className="pl-11 hover:bg-bg-hover/50 p-3 -ml-3 rounded-2xl cursor-pointer active:scale-95 transition-all">
                                <p className="text-text-primary text-[17px] font-medium">Transcript language</p>
                                <p className="text-text-secondary text-[14px]">English</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VoiceMessageTranscripts;