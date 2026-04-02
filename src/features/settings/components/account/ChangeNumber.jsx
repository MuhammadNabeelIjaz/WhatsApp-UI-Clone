import React, { useState } from 'react';
import { Icons } from '@constants/icons';
import CountryPicker from '@shared/ui/inputs/CountryPicker';

const PK = { code: '+92', flag: '🇵🇰', name: 'Pakistan' };

const PhoneField = ({ label, country, onCountryOpen, value, onChange, autoFocus, borderActive }) => (
    <div className="mb-8">
        <p className="text-[15px] text-text-secondary mb-3 leading-snug">{label}</p>
        <div className={`flex items-center gap-2 border-b pb-2 transition-colors ${borderActive ? 'border-accent' : 'border-border-main/30 focus-within:border-accent'}`}>
            {/* Country selector button */}
            <button
                type="button"
                onClick={onCountryOpen}
                className="flex items-center gap-1.5 hover:bg-bg-hover rounded-lg px-2 py-1 transition-colors shrink-0 active:scale-95"
            >
                <span className="text-[20px] leading-none">{country.flag}</span>
                <span className="text-text-primary text-[16px] font-medium">{country.code}</span>
                <Icons.ChevronDown size={14} className="text-text-secondary" />
            </button>
            <div className="w-px h-5 bg-border-main/30 shrink-0" />
            <input
                value={value}
                onChange={e => onChange(e.target.value)}
                className="flex-1 bg-transparent text-text-primary text-[17px] outline-none"
                placeholder="Phone number"
                type="tel"
                autoFocus={autoFocus}
            />
        </div>
    </div>
);

const ChangeNumber = ({ onBack }) => {
    const [step, setStep]           = useState(1);
    const [oldNum, setOldNum]       = useState('304 7662828');
    const [newNum, setNewNum]       = useState('');
    const [oldCountry, setOldCountry] = useState(PK);
    const [newCountry, setNewCountry] = useState(PK);
    // Which picker is open: 'old' | 'new' | null
    const [pickerFor, setPickerFor] = useState(null);

    // ── Country picker overlay ───────────────────────────────────────────────
    if (pickerFor) {
        const current  = pickerFor === 'old' ? oldCountry : newCountry;
        const onSelect = pickerFor === 'old'
            ? (c) => { setOldCountry(c); setPickerFor(null); }
            : (c) => { setNewCountry(c); setPickerFor(null); };
        return (
            <div className="flex flex-col h-full w-full bg-bg-surface relative">
                <CountryPicker
                    selectedCountry={current}
                    onSelect={onSelect}
                    onClose={() => setPickerFor(null)}
                    title="Select country"
                />
            </div>
        );
    }

    // ── Step 2: enter numbers ────────────────────────────────────────────────
    if (step === 2) return (
        <div className="flex flex-col h-full w-full bg-bg-surface">
            <header className="px-4 py-3 flex items-center gap-4 sticky top-0 z-50 bg-bg-surface border-b border-border-main/5">
                <button onClick={() => setStep(1)} className="p-2 hover:bg-bg-hover rounded-full text-text-primary active:scale-90 transition-all">
                    <Icons.ArrowLeft size={24} />
                </button>
                <h1 className="text-[20px] font-bold text-text-primary">Change number</h1>
            </header>

            <div className="flex-1 px-6 py-8 overflow-y-auto">
                <PhoneField
                    label="Enter your old phone number with country code:"
                    country={oldCountry}
                    onCountryOpen={() => setPickerFor('old')}
                    value={oldNum}
                    onChange={setOldNum}
                    borderActive
                />
                <PhoneField
                    label="Enter your new phone number with country code:"
                    country={newCountry}
                    onCountryOpen={() => setPickerFor('new')}
                    value={newNum}
                    onChange={setNewNum}
                    autoFocus
                />
            </div>

            <div className="p-6 pb-10">
                <button
                    disabled={!newNum.trim()}
                    className="w-full py-3 rounded-full bg-accent text-white font-bold text-[14px] shadow-md hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-40"
                >
                    Next
                </button>
            </div>
        </div>
    );

    // ── Step 1: info screen ──────────────────────────────────────────────────
    return (
        <div className="flex flex-col h-full w-full bg-bg-surface">
            <header className="px-4 py-3 flex items-center gap-4 sticky top-0 z-50 bg-bg-surface border-b border-border-main/5">
                <button onClick={onBack} className="p-2 hover:bg-bg-hover rounded-full text-text-primary active:scale-90 transition-all">
                    <Icons.ArrowLeft size={24} />
                </button>
                <h1 className="text-[20px] font-bold text-text-primary">Change number</h1>
            </header>

            <div className="flex-1 px-8 py-10 flex flex-col items-center">
                <div className="flex items-center gap-4 mb-12 mt-4">
                    <div className="w-16 h-20 rounded-xl bg-accent flex items-center justify-center shadow-lg">
                        <Icons.Smartphone size={32} className="text-white" />
                    </div>
                    <div className="flex gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-text-secondary opacity-40" />
                        <div className="w-1.5 h-1.5 rounded-full bg-text-secondary opacity-40" />
                        <div className="w-1.5 h-1.5 rounded-full bg-text-secondary opacity-40" />
                    </div>
                    <div className="w-16 h-20 rounded-xl border-2 border-accent/40 flex items-center justify-center bg-bg-hover">
                        <Icons.Smartphone size={32} className="text-accent" />
                    </div>
                </div>

                <div className="w-full space-y-5">
                    <p className="text-[17px] font-semibold text-text-primary leading-snug">
                        Changing your phone number will migrate your account info, groups & settings.
                    </p>
                    <p className="text-[14.5px] text-text-secondary leading-relaxed">
                        Before proceeding, confirm you can receive SMS or calls at your new number.
                    </p>
                    <p className="text-[14.5px] text-text-secondary italic leading-relaxed">
                        If you have both a new phone & number, first change your number on your old phone.
                    </p>
                </div>
            </div>

            <div className="p-6 pb-10">
                <button
                    onClick={() => setStep(2)}
                    className="w-full py-3 rounded-full bg-accent text-white font-bold text-[14px] shadow-md hover:brightness-110 active:scale-[0.98] transition-all"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ChangeNumber;
