import React, { useState } from 'react';
import { Icons } from '@constants/icons';

const PasskeysSettings = ({ onBack }) => {
    const [passkeyCreated, setPasskeyCreated] = useState(true);

    return (
        <div className="flex flex-col h-full w-full animate-fade-in" style={{ backgroundColor: "var(--bg-surface)" }}>

            {/* --- Header --- */}
            <header className="px-4 py-5 flex items-center gap-6 sticky top-0 z-50 shadow-sm" style={{ backgroundColor: "var(--bg-surface)" }}>
                <button
                    onClick={onBack}
                    className="p-1 hover:bg-bg-hover rounded-full transition-colors active:scale-95"
                >
                    <Icons.ArrowLeft size={24} style={{ color: "var(--text-primary)" }} />
                </button>
                <h1 className="text-[20px] font-medium" style={{ color: "var(--text-primary)" }}>
                    Passkeys
                </h1>
            </header>

            {/* --- Main Content Area --- */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-10 flex flex-col items-center text-center">

                {/* Center Icon Illustration */}
                <div className="relative mb-8">
                    <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--accent-soft)" }}>
                        <UserIcon size={50} className="text-accent" />
                    </div>
                    {/* Floating Key Icon */}
                    <div className="absolute -bottom-2 -right-2 bg-bg-surface rounded-full p-1.5 shadow-lg border-2 border-border-main">
                        <Icons.Key size={20} className="text-accent" />
                    </div>
                </div>

                {/* Manage Title */}
                <h2 className="text-[22px] font-normal mb-4" style={{ color: "var(--text-primary)" }}>
                    Manage your passkey
                </h2>

                {/* Description Text */}
                <p className="text-[14px] leading-relaxed mb-1" style={{ color: "var(--text-secondary)" }}>
                    Access WhatsApp the same way you unlock your phone: with your fingerprint, face or screen lock.
                </p>
                <p className="text-[13px] mb-8" style={{ color: "var(--text-secondary)" }}>
                    Your passkey is safely stored in your password manager.
                    <span className="ml-1 cursor-pointer font-medium" style={{ color: "var(--accent)" }}>Learn more</span>
                </p>

                {/* --- Passkeys List Section --- */}
                <div className="w-full text-left">
                    <h3 className="text-[14px] font-medium mb-6 px-2" style={{ color: "var(--text-secondary)" }}>
                        Your passkeys
                    </h3>

                    {/* Google Password Manager Entry */}
                    <div className="flex items-center gap-5 p-3 hover:bg-bg-hover rounded-xl cursor-pointer transition-colors group">
                        <div className="shrink-0 p-2 rounded-lg" style={{ backgroundColor: "var(--bg-input)" }}>
                            <Icons.Key size={20} style={{ color: "var(--text-secondary)" }} />
                        </div>

                        <div className="flex-1 min-w-0">
                            <h4 className="text-[16px] font-normal" style={{ color: "var(--text-primary)" }}>
                                Google Password Manager
                            </h4>
                            <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
                                Created on 8 October 2025
                            </p>
                        </div>

                        <button className="p-2 opacity-60 group-hover:opacity-100 transition-opacity">
                            <Icons.MoreVertical size={20} style={{ color: "var(--text-primary)" }} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Actions Area */}
            <div className="p-6">
                {!passkeyCreated && (
                    <button
                        onClick={() => setPasskeyCreated(true)}
                        className="w-full py-3 rounded-full font-bold text-[14px] transition-transform active:scale-95"
                        style={{ backgroundColor: "var(--accent)", color: "#fff" }}
                    >
                        Create passkey
                    </button>
                )}
            </div>
        </div>
    );
};

// Custom Icon for User Profile Illustration
const UserIcon = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM12 5a3 3 0 110 6 3 3 0 010-6zm0 14.2c-2.505 0-4.588-1.257-5.415-3.126.03-1.785 3.61-2.774 5.415-2.774 1.795 0 5.385.989 5.415 2.774-.827 1.869-2.91 3.126-5.415 3.126z" fill="currentColor" />
    </svg>
);

export default PasskeysSettings;
