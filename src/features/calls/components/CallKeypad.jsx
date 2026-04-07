import React, { useState } from 'react';
import { Icons } from '@constants/icons'; // Using your centralized icons

const CallKeypad = ({ onBack, onCall, onMessage, onAddContact }) => {
    const [phoneNumber, setPhoneNumber] = useState('');

    const keys = [
        { num: '1', sub: '' }, { num: '2', sub: 'ABC' }, { num: '3', sub: 'DEF' },
        { num: '4', sub: 'GHI' }, { num: '5', sub: 'JKL' }, { num: '6', sub: 'MNO' },
        { num: '7', sub: 'PQRS' }, { num: '8', sub: 'TUV' }, { num: '9', sub: 'WXYZ' },
        { num: '*', sub: '' }, { num: '0', sub: '+' }, { num: '#', sub: '' },
    ];

    const handleKeyPress = (num) => {
        if (phoneNumber.length < 15) setPhoneNumber(prev => prev + num);
    };

    const handleDelete = () => setPhoneNumber(prev => prev.slice(0, -1));

    return (
        <div className="flex flex-col h-full w-full select-none overflow-hidden bg-bg-surface transition-colors duration-300">

            {/* 1. Header */}
            <header className="px-4 py-2 flex items-center justify-between shrink-0 h-[60px]">
                <button
                    onClick={onBack}
                    className="p-2 rounded-full active:bg-bg-hover active:scale-90 text-text-primary transition-all"
                >
                    <Icons.ArrowLeft size={24} />
                </button>
                <button
                    onClick={() => onAddContact?.(phoneNumber)}
                    className="p-2 rounded-full active:bg-bg-hover active:scale-90 text-text-primary transition-all"
                >
                    <Icons.UserPlus size={24} />
                </button>
            </header>

            {/* 2. Main Content Container */}
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center justify-between min-h-0">

                {/* Number Display Area */}
                <div className="flex-[0.5] flex items-center justify-center px-6 min-h-[80px] w-full">
                    <div className="text-4xl font-light tracking-[0.12em] truncate w-full text-center text-text-primary">
                        {phoneNumber || " "}
                    </div>
                </div>

                {/* Keypad Grid */}
                <div className="flex-[2] flex items-center justify-center px-6 w-full">
                    <div className="grid grid-cols-3 gap-x-10 gap-y-5 sm:gap-y-6">
                        {keys.map((key, idx) => (
                            <div
                                key={idx}
                                onClick={() => handleKeyPress(key.num)}
                                className="flex flex-col items-center justify-center w-[72px] h-[72px] rounded-full cursor-pointer 
                                           bg-bg-hover hover:brightness-110 active:scale-90 transition-all 
                                           border border-border-main/10 shadow-sm"
                            >
                                <span className="text-[28px] font-normal leading-none text-text-primary">
                                    {key.num}
                                </span>
                                {key.sub && (
                                    <span className="text-[10px] font-bold text-text-secondary opacity-60 uppercase mt-1 tracking-wider">
                                        {key.sub}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Action Row */}
                <div className="flex-1 flex items-end justify-center w-full max-w-[340px] px-8 pb-10 pt-4">
                    <div className="flex items-center justify-between w-full">

                        {/* Message Icon — routes to chat with dialed number */}
                        <button
                            onClick={() => phoneNumber && onMessage?.(phoneNumber)}
                            title={phoneNumber ? `Message ${phoneNumber}` : 'Enter a number first'}
                            className={`p-4 rounded-full active:bg-bg-hover text-text-primary transition-all ${
                                phoneNumber ? 'opacity-100 hover:bg-bg-hover' : 'opacity-30 cursor-not-allowed'
                            }`}
                        >
                            <Icons.MessageSquareText size={28} />
                        </button>

                        {/* WhatsApp Style Call Button */}
                        <button
                            onClick={() => phoneNumber && onCall?.({ name: phoneNumber })}
                            className={`w-[75px] h-[75px] rounded-full flex items-center justify-center cursor-pointer bg-status-success shadow-lg shadow-status-success/20 active:scale-95 transition-all hover:brightness-110 shrink-0 ${!phoneNumber ? 'opacity-60' : ''}`}
                        >
                            <Icons.Phone size={30} className="text-white fill-white" />
                        </button>

                        {/* Delete Button */}
                        <div className="w-[60px] flex justify-center shrink-0">
                            {phoneNumber && (
                                <button
                                    onClick={handleDelete}
                                    className="p-4 rounded-full active:bg-bg-hover text-text-primary transition-all"
                                >
                                    <Icons.Trash2 size={26} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CallKeypad;