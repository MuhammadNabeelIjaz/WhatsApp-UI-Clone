import React, { useState } from 'react';
import { Icons } from '@constants/icons';

const MAX = 25;

const NameScreen = ({ onBack, name: initialName, onSave }) => {
    const [name, setName] = useState(initialName || 'Muhammad Nabeel Ijaz');

    return (
        <div className="flex flex-col h-full w-full select-none bg-bg-surface animate-fade-in">
            {/* Header */}
            <header className="px-4 py-3 flex items-center sticky top-0 z-[100] bg-bg-surface">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-bg-hover rounded-full transition-all active:scale-90 text-text-primary cursor-pointer"
                >
                    <Icons.ArrowLeft size={24} />
                </button>
                <h1 className="ml-4 text-[20px] font-bold text-text-primary flex-1">Name</h1>
            </header>

            {/* Content */}
            <div className="flex-1 px-6 pt-8">
                <div className="relative">
                    <label className="absolute -top-2 left-3 text-[12px] text-accent bg-bg-surface px-1 font-medium">
                        Your name
                    </label>
                    <div className="flex items-center border-2 border-accent rounded-lg px-3 py-3 gap-2 bg-bg-surface">
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value.slice(0, MAX))}
                            className="flex-1 bg-transparent text-text-primary text-[16px] outline-none"
                            autoFocus
                        />
                        <button className="text-text-secondary hover:text-accent transition-colors">
                            <Icons.Smile size={22} />
                        </button>
                    </div>
                    <p className="text-right text-[12px] text-text-secondary mt-1">
                        {name.length}/{MAX}
                    </p>
                </div>
                <p className="text-[13px] text-text-secondary mt-4 leading-snug">
                    People will see this name if you interact with them and they don't have you saved as a contact.
                </p>
            </div>

            {/* Save Button */}
            <div className="p-6 pb-10">
                <button
                    onClick={() => { onSave && onSave(name); onBack(); }}
                    disabled={!name.trim()}
                    className="w-full py-3 rounded-full bg-accent text-white font-bold text-[14px] shadow-md hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-40"
                >
                    Save
                </button>
            </div>
        </div>
    );
};

export default NameScreen;
