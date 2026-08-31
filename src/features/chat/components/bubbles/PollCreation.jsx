import React, { useState } from 'react';
import { Icons } from '@constants/icons';
import { motion } from 'framer-motion';
import ToggleSwitch from '@shared/ui/buttons/ToggleSwitch';

/**
 * WhatsApp Premium Clone - Poll Creation
 * Renders as centered modal / bottom sheet — chat remains visible behind it.
 */
const PollCreation = ({ onClose, onSend }) => {
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", ""]);
    const [allowMultiple, setAllowMultiple] = useState(true);

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        if (index === options.length - 1 && value.trim() !== "" && options.length < 12) {
            newOptions.push("");
        }
        setOptions(newOptions);
    };

    const canSend = question.trim() && options.filter(o => o.trim()).length >= 2;

    return (
        <div
            className="fixed inset-0 z-[600] flex items-end sm:items-center justify-center bg-black/50"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="w-full sm:max-w-[480px] bg-bg-surface rounded-t-2xl sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl"
                style={{ maxHeight: '90vh' }}
                onClick={e => e.stopPropagation()}
            >
                {/* Drag handle */}
                <div className="flex justify-center pt-2 pb-1 shrink-0">
                    <div className="w-10 h-1 rounded-full bg-border-main/30" />
                </div>

                {/* Header */}
                <header className="px-4 py-3 flex items-center gap-4 border-b border-border-main/10 shrink-0">
                    <button onClick={onClose} className="p-1.5 hover:bg-bg-hover rounded-full text-text-secondary transition-colors">
                        <Icons.ArrowLeft size={22} />
                    </button>
                    <h1 className="text-[18px] font-semibold text-text-primary flex-1">Create poll</h1>
                </header>

                {/* Scrollable Form */}
                <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                    {/* Question */}
                    <div className="mb-6">
                        <label className="text-[13px] text-text-secondary font-medium block mb-3">Question</label>
                        <div className="border-2 border-accent rounded-xl px-4 py-3">
                            <input
                                autoFocus
                                type="text"
                                placeholder="Ask question"
                                value={question}
                                onChange={e => setQuestion(e.target.value)}
                                className="w-full bg-transparent outline-none text-text-primary text-[16px] placeholder:text-text-secondary/50"
                            />
                        </div>
                    </div>

                    {/* Options */}
                    <div className="space-y-3">
                        <label className="text-[13px] text-text-secondary font-medium block">Options</label>
                        {options.map((option, index) => (
                            <div key={index} className="border border-border-main/30 rounded-xl px-4 py-3 focus-within:border-accent transition-colors">
                                <input
                                    type="text"
                                    placeholder="+ Add"
                                    value={option}
                                    onChange={e => handleOptionChange(index, e.target.value)}
                                    className="w-full bg-transparent outline-none text-text-primary text-[15px] placeholder:text-text-secondary/50"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Multiple Answers Toggle */}
                    <div className="mt-6 flex items-center justify-between py-4 border-t border-border-main/10">
                        <span className="text-text-primary text-[15px]">Allow multiple answers</span>
                        <ToggleSwitch checked={allowMultiple} onChange={() => setAllowMultiple(v => !v)} />
                    </div>
                </div>

                {/* Send button */}
                <div className="p-4 flex justify-end border-t border-border-main/10 shrink-0">
                    <button
                        disabled={!canSend}
                        onClick={() => onSend({ question, options, allowMultiple })}
                        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-90 ${
                            canSend ? 'bg-accent text-text-primary' : 'bg-bg-input text-text-secondary opacity-50 cursor-not-allowed'
                        }`}
                    >
                        <Icons.Send size={22} fill="currentColor" className="ml-0.5" />
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default PollCreation;
