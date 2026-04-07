import React, { useState } from 'react';
import { Icons } from '@constants/icons';
import ChatColorPicker from './ChatColorPicker';
import WallpaperGrid from './WallpaperGrid';

const ChatThemeScreen = ({ onBack }) => {
    const [activeView, setActiveView] = useState('main');

    if (activeView === 'color') return <ChatColorPicker onBack={() => setActiveView('main')} />;
    if (activeView === 'wallpaper') return <WallpaperGrid onBack={() => setActiveView('main')} />;

    return (
        <div className="flex flex-col h-full w-full bg-bg-surface text-text-primary animate-fade-in">
            <header className="px-4 py-3 flex items-center gap-4 shrink-0 border-b border-border-main/20 bg-bg-surface">
                <button onClick={onBack} className="p-2 hover:bg-bg-hover rounded-full text-text-secondary transition-all active:scale-90">
                    <Icons.ArrowLeft size={24} />
                </button>
                <h1 className="text-[20px] font-medium text-text-primary">Chat theme</h1>
            </header>

            <div className="flex-1 overflow-y-auto px-4 pb-6 custom-scrollbar">
                <p className="text-text-secondary text-[13px] font-semibold py-5 uppercase tracking-wider">Themes</p>

                <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="relative aspect-[3/4.5] rounded-2xl overflow-hidden border-2 border-accent cursor-pointer shadow-xl group">
                        <div className="absolute inset-0 bg-bg-surface opacity-40 group-hover:opacity-30 transition-opacity" />
                        <div className="absolute top-2 right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center shadow-lg">
                            <Icons.Check size={14} className="text-white" />
                        </div>
                    </div>

                    <div className="aspect-[3/4.5] rounded-2xl overflow-hidden border border-border-main/30 cursor-pointer hover:border-accent/50 transition-colors group relative bg-bg-hover flex items-center justify-center">
                        <div className="flex flex-col items-center gap-1">
                            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                                <Icons.Sparkles size={16} className="text-accent" />
                            </div>
                            <p className="text-[10px] text-text-secondary text-center px-1">AI Create</p>
                        </div>
                    </div>

                    {[1, 2].map(i => (
                        <div key={i} className="aspect-[3/4.5] rounded-2xl overflow-hidden border border-border-main/30 cursor-pointer hover:border-accent/50 transition-colors bg-bg-hover" />
                    ))}
                </div>

                <div className="h-[1px] bg-border-main/20 mb-6" />

                <div className="flex flex-col gap-1">
                    <button
                        onClick={() => setActiveView('color')}
                        className="flex items-center gap-4 px-2 py-4 hover:bg-bg-hover rounded-xl transition-colors"
                    >
                        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                            <Icons.Palette size={20} className="text-white" />
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-[15px] text-text-primary font-medium">Chat colour</p>
                            <p className="text-[12px] text-text-secondary">Customise your chat bubble colours</p>
                        </div>
                        <Icons.ChevronRight size={18} className="text-text-secondary opacity-50" />
                    </button>

                    <button
                        onClick={() => setActiveView('wallpaper')}
                        className="flex items-center gap-4 px-2 py-4 hover:bg-bg-hover rounded-xl transition-colors"
                    >
                        <div className="w-10 h-10 rounded-full bg-bg-hover border border-border-main/30 flex items-center justify-center">
                            <Icons.Image size={20} className="text-text-secondary" />
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-[15px] text-text-primary font-medium">Wallpaper</p>
                            <p className="text-[12px] text-text-secondary">Change chat background</p>
                        </div>
                        <Icons.ChevronRight size={18} className="text-text-secondary opacity-50" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatThemeScreen;
