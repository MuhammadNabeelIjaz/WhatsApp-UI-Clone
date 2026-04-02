import React from 'react';
import { Icons } from '@constants/icons';

const ChatHistoryScreen = ({ onBack }) => {
    const items = [
        { icon: <Icons.ArrowUpCircle size={22} />, label: 'Export chat' },
        { icon: <Icons.Archive size={22} />,       label: 'Archive all chats' },
        { icon: <Icons.RotateCcw size={22} />,     label: 'Clear all chats' },
        { icon: <Icons.Trash2 size={22} />,        label: 'Delete all chats' },
    ];
    return (
        <div className="absolute inset-0 bg-bg-surface z-[700] flex flex-col animate-fade-in">
            <header className="flex items-center gap-3 px-3 py-3 shrink-0 border-b border-border-main/10">
                <button onClick={onBack} className="p-2 hover:bg-bg-hover rounded-full text-text-primary transition active:scale-90">
                    <Icons.ArrowLeft size={24} />
                </button>
                <h2 className="text-[18px] font-semibold text-text-primary">Chat history</h2>
            </header>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {items.map((item, i) => (
                    <button key={i} className="flex items-center gap-5 w-full px-5 py-4 hover:bg-bg-hover transition-colors border-b border-border-main/10">
                        <span className="text-text-secondary">{item.icon}</span>
                        <span className="text-[16px] text-text-primary">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ChatHistoryScreen;
