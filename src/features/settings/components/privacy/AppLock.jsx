import React, { useState } from 'react';
import { Icons } from '@constants/icons';
const AppLock = ({ onBack }) => {
    const [unlockBiometric, setUnlockBiometric] = useState(true);
    const [lockTimer, setLockTimer] = useState('immediately');

    const timerOptions = [
        { label: 'Immediately', id: 'immediately' },
        { label: 'After 1 minute', id: 'after_1min' },
        { label: 'After 30 minutes', id: 'after_30min' },
    ];

    return (
        <div className="flex flex-col h-full w-full bg-bg-surface animate-fade-in">
            <header className="px-4 py-5 flex items-center gap-6 bg-bg-surface">
                <button onClick={onBack} className="text-text-primary"><Icons.ArrowLeft size={24} /></button>
                <h1 className="text-[20px] font-medium text-text-primary">App lock</h1>
            </header>

            <div className="p-6">
                <div className="flex items-start justify-between mb-8">
                    <div className="flex-1">
                        <h3 className="text-[16.5px] text-text-primary">Unlock with biometric</h3>
                        <p className="text-[14px] text-text-secondary mt-1 leading-relaxed">
                            When enabled, you'll need to use fingerprint, face or other unique identifiers to open WhatsApp.
                        </p>
                    </div>
                    <button
                        onClick={() => setUnlockBiometric(!unlockBiometric)}
                        className={`w-10 h-5 rounded-full relative transition-colors mt-2 ${unlockBiometric ? 'bg-accent/40' : 'bg-border-main/30'}`}
                    >
                        <div className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full transition-all ${unlockBiometric ? 'right-0 bg-accent' : 'left-0 bg-[#b1b1b1]'}`} />
                    </button>
                </div>

                {unlockBiometric && (
                    <div className="animate-slide-down">
                        <h4 className="text-text-secondary text-[14px] font-medium mb-4">Automatically lock</h4>
                        {timerOptions.map(({ label, id }) => (
                            <label key={id} className="flex items-center justify-between py-4 cursor-pointer">
                                <span className="text-[16px] text-text-primary">{label}</span>
                                <input
                                    type="radio"
                                    checked={lockTimer === id}
                                    className="w-5 h-5 accent-accent"
                                    onChange={() => setLockTimer(id)}
                                />
                            </label>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

AppLock.defaultProps = {
    onBack: () => { },
};

export default AppLock;