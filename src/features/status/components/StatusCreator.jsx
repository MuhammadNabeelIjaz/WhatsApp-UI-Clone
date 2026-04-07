// src/features/status/components/StatusCreator.jsx
// Full-screen text status composer.

import React from 'react';
import { Icons } from '@constants/icons';

const STATUS_BG_COLORS = [
    '#075e54', '#128c7e', '#25d366', '#dcf8c6',
    '#34b7f1', '#0e3b6b', '#9c27b0', '#e91e63',
    '#ff5722', '#795548',
];

const StatusCreator = ({ textContent, setTextContent, bgColor, setBgColor, onPost, onBack }) => (
    <div
        className="absolute inset-0 z-2000 flex flex-col animate-fade-in"
        style={{ backgroundColor: bgColor }}
    >
        {/* Header */}
        <header className="px-4 py-4 flex items-center gap-3 shrink-0">
            <button
                onClick={onBack}
                className="p-2 hover:bg-black/20 rounded-full text-white active:scale-90 transition-all"
            >
                <Icons.ArrowLeft size={24} />
            </button>
            <h2 className="text-white font-semibold text-[17px] flex-1">Text status</h2>
            <button
                onClick={onPost}
                className="px-5 py-2 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-full text-[14px] transition-all"
            >
                Post
            </button>
        </header>

        {/* Text input area */}
        <div className="flex-1 flex items-center justify-center px-8">
            <textarea
                autoFocus
                placeholder="Type a status..."
                value={textContent}
                onChange={e => setTextContent(e.target.value)}
                maxLength={700}
                rows={4}
                className="w-full bg-transparent text-white text-center text-[22px] font-medium placeholder:text-white/50 outline-none resize-none"
                style={{ textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}
            />
        </div>

        {/* Color palette */}
        <div className="px-4 pb-8 flex gap-3 justify-center flex-wrap">
            {STATUS_BG_COLORS.map(col => (
                <button
                    key={col}
                    onClick={() => setBgColor(col)}
                    className={`w-10 h-10 rounded-full border-4 transition-all active:scale-90 ${bgColor === col ? 'border-white scale-110' : 'border-transparent'}`}
                    style={{ background: col }}
                />
            ))}
        </div>
    </div>
);

export default StatusCreator;
