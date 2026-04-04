import React, { useState } from 'react';
import { Icons } from '@constants/icons';
const MessageTimer = ({ onBack }) => {
    const [timer, setTimer] = useState('off');
    const options = [
        { id: '24h', label: '24 hours' },
        { id: '7d', label: '7 days' },
        { id: '90d', label: '90 days' },
        { id: 'off', label: 'Off' }
    ];

    return (
        <div className="flex flex-col h-full w-full bg-bg-surface animate-fade-in">
            <header className="px-4 py-5 flex items-center gap-6 bg-bg-surface shadow-sm">
                <button onClick={onBack} className="text-text-primary"><Icons.ArrowLeft size={24} /></button>
                <h1 className="text-[20px] font-medium text-text-primary">Default message timer</h1>
            </header>

            <div className="px-6 py-6">
                <p className="text-[15px] text-text-secondary mb-6">
                    Start new chats with a disappearing message timer set to
                </p>

                {options.map((opt) => (
                    <label key={opt.id} className="flex items-center justify-between py-4 cursor-pointer">
                        <span className="text-[16.5px] text-text-primary">{opt.label}</span>
                        <div className="relative flex items-center justify-center">
                            <input
                                type="radio"
                                checked={timer === opt.id}
                                onChange={() => setTimer(opt.id)}
                                className="appearance-none w-5 h-5 border-2 rounded-full border-text-secondary checked:border-accent transition-all"
                            />
                            {timer === opt.id && (
                                <div className="absolute w-2.5 h-2.5 bg-accent rounded-full animate-scale-in" />
                            )}
                        </div>
                    </label>
                ))}

                <div className="mt-8">
                    <p className="text-[14px] text-text-secondary leading-relaxed opacity-80">
                        When turned on, all new individual chats will start with disappearing messages set to the duration you select. This setting will not affect your existing chats. <span className="text-accent cursor-pointer">Learn more</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MessageTimer;