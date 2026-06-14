// src/components/sidebar/panels/NewListModal.jsx
import React, { useState } from 'react';
import SearchInput from '@shared/ui/inputs/SearchInput';
import { Icons } from '@constants/icons';

const NewListModal = ({ isOpen, onClose }) => {
    const [listName, setListName] = useState('');
    const [step, setStep] = useState(1); // 1=name, 2=pick contacts

    const handleClose = () => {
        setListName('');
        setStep(1);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/60 animate-fade-in" onClick={handleClose}>
        <div className="w-full max-w-[420px] mx-4 bg-bg-surface rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-zoom-in" style={{maxHeight: '85vh'}} onClick={e => e.stopPropagation()}>

            {/* Header */}
            <header className="flex items-center px-4 h-[64px] shrink-0 border-b border-border-main/10">
                <button
                    onClick={handleClose}
                    className="p-2 -ml-2 hover:bg-bg-hover rounded-full text-text-secondary transition-colors"
                >
                    <Icons.ArrowLeft size={24} />
                </button>
                <h2 className="ml-4 text-[18px] font-semibold text-text-primary flex-1">
                    {step === 1 ? 'New list' : `Add to "${listName}"`}
                </h2>
                {step === 2 && (
                    <button
                        onClick={handleClose}
                        className="px-4 py-1.5 text-accent text-sm font-semibold hover:bg-accent/10 rounded-full transition-colors"
                    >
                        Done
                    </button>
                )}
            </header>

            {step === 1 && (
                <div className="flex-1 flex flex-col px-6 pt-8 overflow-y-auto">
                    {/* Name input */}
                    <label className="text-[12px] text-accent font-medium mb-2 block uppercase tracking-wider">
                        List name
                    </label>
                    <div className="relative border-b-2 border-accent pb-1">
                        <input
                            autoFocus
                            type="text"
                            placeholder="e.g. Work, Friends, Family"
                            className="w-full bg-transparent py-2 pr-10 text-text-primary outline-none text-[16px] placeholder:text-text-secondary/40"
                            value={listName}
                            onChange={(e) => setListName(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && listName.trim()) setStep(2); }}
                        />
                        <button className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-text-secondary hover:text-accent">
                            <Icons.Smile size={22} />
                        </button>
                    </div>
                    <p className="mt-4 text-[13px] text-text-secondary leading-relaxed">
                        Lists let you filter chats by category. The list appears as a filter chip at the top of your Chats tab.
                    </p>

                    {/* Next button */}
                    <div className="mt-auto pb-10">
                        <button
                            disabled={!listName.trim()}
                            onClick={() => setStep(2)}
                            className={`w-full py-3.5 rounded-full font-semibold text-[15px] transition-all ${
                                listName.trim()
                                    ? 'bg-accent text-white shadow-lg shadow-accent/20 active:scale-95'
                                    : 'bg-bg-input text-text-secondary cursor-not-allowed opacity-50'
                            }`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Search */}
                    <div className="px-4 py-3 border-b border-border-main/10 shrink-0">
                        <div className="bg-bg-input rounded-full flex items-center px-4 py-2.5 gap-3">
                            <Icons.Search size={18} className="text-text-secondary" />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search contacts or groups"
                                className="bg-transparent outline-none text-[14px] w-full text-text-primary placeholder:text-text-secondary"
                            />
                        </div>
                    </div>

                    {/* Empty state */}
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                        <div className="w-16 h-16 bg-bg-hover rounded-full flex items-center justify-center mb-4">
                            <Icons.Users size={28} className="text-text-secondary opacity-40" />
                        </div>
                        <p className="text-text-secondary text-sm">
                            Search contacts or groups to add to this list.
                        </p>
                    </div>
                </div>
            )}
        </div>
        </div>
    );
};

export default NewListModal;
