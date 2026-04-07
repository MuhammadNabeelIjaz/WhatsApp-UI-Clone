import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Icons } from '@constants/icons';

/* 6-digit PIN input */
const PinInput = ({ value, onChange, error }) => {
    const inputs = useRef([]);
    const digits = value.split('');

    const handleKey = (e, i) => {
        if (e.key === 'Backspace') {
            if (digits[i]) {
                onChange(value.slice(0, i) + value.slice(i + 1));
            } else if (i > 0) {
                inputs.current[i - 1]?.focus();
                onChange(value.slice(0, i - 1) + value.slice(i));
            }
            return;
        }
        if (!/^\d$/.test(e.key)) return;
        const next = value.slice(0, i) + e.key + value.slice(i + 1);
        onChange(next.slice(0, 6));
        if (i < 5) inputs.current[i + 1]?.focus();
    };

    useEffect(() => { inputs.current[0]?.focus(); }, []);

    return (
        <div className="flex gap-3 justify-center mt-4 mb-2">
            {Array.from({ length: 6 }).map((_, i) => (
                <input
                    key={i}
                    ref={el => inputs.current[i] = el}
                    type="tel"
                    inputMode="numeric"
                    maxLength={1}
                    value={digits[i] || ''}
                    onChange={() => {}}
                    onKeyDown={e => handleKey(e, i)}
                    className={`w-11 h-12 rounded-xl text-center text-[20px] font-bold text-text-primary bg-bg-input border-2 outline-none transition-colors
                        ${error ? 'border-red-500 bg-red-500/10' : digits[i] ? 'border-accent bg-accent/5' : 'border-border-main/30'}`}
                />
            ))}
        </div>
    );
};

/* PIN Dialog — rendered via Portal so it escapes overflow-hidden parents */
const PinDialog = ({ mode, onConfirm, onCancel }) => {
    const [pin, setPin]           = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [step, setStep]         = useState(1);
    const [error, setError]       = useState('');
    const CORRECT_PIN = '123456';

    const title    = mode === 'turn-off' ? 'Enter your PIN'
                   : step === 1 ? 'Enter new PIN' : 'Confirm new PIN';
    const subtitle = mode === 'turn-off'
                   ? 'Enter your 6-digit PIN to disable two-step verification'
                   : step === 1 ? 'Choose a 6-digit PIN' : 'Re-enter your PIN to confirm';

    const handleConfirm = () => {
        if (mode === 'turn-off') {
            if (pin !== CORRECT_PIN) { setError('Incorrect PIN. Try again.'); setPin(''); return; }
            onConfirm();
        } else {
            if (step === 1) {
                if (pin.length < 6) { setError('PIN must be 6 digits'); return; }
                setStep(2); setError(''); setConfirmPin('');
            } else {
                if (confirmPin !== pin) { setError('PINs do not match. Try again.'); setConfirmPin(''); return; }
                onConfirm(pin);
            }
        }
    };

    const activePin    = step === 1 ? pin : confirmPin;
    const setActivePin = step === 1 ? setPin : setConfirmPin;

    return ReactDOM.createPortal(
        <div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 animate-fade-in px-6"
            onClick={onCancel}
        >
            <div
                className="w-full max-w-[340px] bg-bg-surface rounded-2xl shadow-2xl p-6 animate-zoom-in"
                onClick={e => e.stopPropagation()}
            >
                {/* Lock icon */}
                <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
                        <Icons.Lock size={26} className="text-accent" />
                    </div>
                </div>

                <h2 className="text-[18px] font-semibold text-text-primary text-center mb-1">{title}</h2>
                <p className="text-[13px] text-text-secondary text-center mb-2 leading-snug">{subtitle}</p>

                <PinInput
                    value={activePin}
                    onChange={v => { setActivePin(v); setError(''); }}
                    error={!!error}
                />

                {error && <p className="text-[13px] text-red-400 text-center mt-2">{error}</p>}

                {mode === 'turn-off' && (
                    <p className="text-[12px] text-text-secondary text-center mt-1 opacity-60">Demo PIN: 123456</p>
                )}

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 rounded-xl border border-border-main/30 text-text-secondary text-[14px] font-medium hover:bg-bg-hover transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={activePin.length < 6}
                        className="flex-1 py-3 rounded-xl bg-accent text-white text-[14px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
                    >
                        {mode === 'turn-off' ? 'Turn off' : step === 1 ? 'Next' : 'Confirm'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

/* Main Component */
const TwoStepVerification = ({ onBack }) => {
    const [isEnabled, setIsEnabled] = useState(true);
    const [dialog, setDialog]       = useState(null); // null | 'turn-off' | 'change'
    const [toast, setToast]         = useState('');

    const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 2800); };

    const handleTurnOff  = ()      => { setIsEnabled(false); setDialog(null); showToast('Two-step verification disabled'); };
    const handleChangePIN = ()     => { setDialog(null); showToast('PIN changed successfully'); };
    const handleTurnOn   = ()      => { setIsEnabled(true);  setDialog(null); showToast('Two-step verification enabled'); };

    return (
        <div className="flex flex-col h-full w-full animate-fade-in bg-bg-surface relative">
            {/* Header */}
            <header className="px-4 py-5 flex items-center gap-6 sticky top-0 z-50 shadow-sm bg-bg-surface">
                <button onClick={onBack} className="p-1 hover:bg-bg-hover rounded-full transition-colors active:scale-95 text-text-primary">
                    <Icons.ArrowLeft size={24} />
                </button>
                <h1 className="text-[20px] font-medium text-text-primary">Two-step verification</h1>
            </header>

            <div className="flex-1 flex flex-col items-center px-8 pt-12 overflow-y-auto">
                {/* Visual */}
                <div className="relative mb-10 mt-4">
                    <div className={`rounded-lg px-4 py-2 flex gap-1 shadow-md border transition-colors ${isEnabled ? 'bg-white border-gray-200' : 'bg-bg-input border-border-main/20'}`}>
                        <Icons.Asterisk size={18} className={isEnabled ? 'text-slate-800' : 'text-text-secondary'} />
                        <Icons.Asterisk size={18} className={isEnabled ? 'text-slate-800' : 'text-text-secondary'} />
                        <Icons.Asterisk size={18} className={isEnabled ? 'text-slate-800' : 'text-text-secondary'} />
                    </div>
                    <div
                        className={`absolute -bottom-3 -left-3 rounded-full p-1 border-[3px] transition-colors ${isEnabled ? 'bg-[#00a884]' : 'bg-text-secondary/40'}`}
                        style={{ borderColor: 'var(--bg-surface)' }}
                    >
                        {isEnabled
                            ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                            : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        }
                    </div>
                </div>

                {/* Status text */}
                <p className="text-[14.5px] text-center leading-relaxed mb-1 opacity-80 text-text-primary">
                    {isEnabled
                        ? "Two-step verification is on. You'll need to enter your PIN if you register your phone number on WhatsApp again."
                        : "Two-step verification is off. Turn it on to add an extra layer of security to your account."
                    }
                </p>
                <button className="text-[14px] font-medium mb-12 text-accent">Learn more</button>

                {/* Actions */}
                <div className="w-full flex flex-col">
                    {isEnabled ? (
                        <>
                            <button
                                onClick={() => setDialog('turn-off')}
                                className="flex items-center gap-6 py-4 w-full cursor-pointer hover:bg-bg-hover transition-colors group rounded-xl px-2"
                            >
                                <Icons.XCircle size={22} className="text-text-secondary shrink-0" />
                                <span className="text-[16px] font-normal text-text-primary">Turn off</span>
                            </button>
                            <button
                                onClick={() => setDialog('change')}
                                className="flex items-center gap-6 py-4 w-full cursor-pointer hover:bg-bg-hover transition-colors group rounded-xl px-2"
                            >
                                <div className="shrink-0 flex flex-col items-center justify-center">
                                    <div className="flex gap-0.5">
                                        <Icons.Asterisk size={10} className="text-text-secondary" />
                                        <Icons.Asterisk size={10} className="text-text-secondary" />
                                        <Icons.Asterisk size={10} className="text-text-secondary" />
                                    </div>
                                    <div className="w-4 h-[1.5px] mt-0.5 bg-text-secondary" />
                                </div>
                                <span className="text-[16px] font-normal text-text-primary">Change PIN</span>
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setDialog('turn-on')}
                            className="w-full py-3.5 bg-accent text-white rounded-2xl font-semibold text-[16px] hover:opacity-90 transition-opacity active:scale-[0.98]"
                        >
                            Turn on
                        </button>
                    )}
                </div>
            </div>

            {/* PIN Dialogs — rendered via Portal */}
            {dialog === 'turn-off' && <PinDialog mode="turn-off" onConfirm={handleTurnOff}   onCancel={() => setDialog(null)} />}
            {dialog === 'change'   && <PinDialog mode="change"   onConfirm={handleChangePIN} onCancel={() => setDialog(null)} />}
            {dialog === 'turn-on'  && <PinDialog mode="turn-on"  onConfirm={handleTurnOn}    onCancel={() => setDialog(null)} />}

            {/* Toast */}
            {toast && ReactDOM.createPortal(
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-bg-surface border border-border-main/20 shadow-xl rounded-2xl px-5 py-3 animate-zoom-in z-[99999] flex items-center gap-3 whitespace-nowrap">
                    <Icons.Check size={16} className="text-accent shrink-0" />
                    <span className="text-[14px] text-text-primary">{toast}</span>
                </div>,
                document.body
            )}
        </div>
    );
};

export default TwoStepVerification;
