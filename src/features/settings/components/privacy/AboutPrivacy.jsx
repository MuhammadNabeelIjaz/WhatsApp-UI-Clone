import React, { useState } from 'react';
import { Icons } from '@constants/icons';
const AboutPrivacy = ({ onBack }) => {
    // State management based on your screenshot (Default: Nobody)
    const [selection, setSelection] = useState('nobody');

    const options = [
        { id: 'everyone', label: 'Everyone' },
        { id: 'contacts', label: 'My contacts' },
        { id: 'except', label: 'My contacts except...' },
        { id: 'nobody', label: 'Nobody' }
    ];

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
                    About
                </h1>
            </header>

            {/* --- Content Area --- */}
            <div className="flex-1 px-6 py-6">
                <h3 className="text-[14px] font-medium text-text-secondary mb-4 opacity-80">
                    Who can see my About
                </h3>

                <div className="flex flex-col">
                    {options.map((option) => (
                        <label
                            key={option.id}
                            className="flex items-center justify-between py-4 cursor-pointer active:bg-bg-hover transition-colors group"
                        >
                            <span className="text-[16.5px] text-text-primary">
                                {option.label}
                            </span>

                            {/* Custom Radio Button */}
                            <div className="relative flex items-center justify-center">
                                <input
                                    type="radio"
                                    name="about_privacy"
                                    checked={selection === option.id}
                                    onChange={() => setSelection(option.id)}
                                    className="appearance-none w-5 h-5 border-2 rounded-full border-text-secondary checked:border-accent transition-all"
                                />
                                {selection === option.id && (
                                    <div className="absolute w-2.5 h-2.5 bg-accent rounded-full animate-scale-in" />
                                )}
                            </div>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AboutPrivacy;