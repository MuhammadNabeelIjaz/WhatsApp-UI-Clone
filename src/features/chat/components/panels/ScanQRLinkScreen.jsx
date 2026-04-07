import React from 'react';
import { Icons } from '@constants/icons';
import ScreenHeader from '@shared/ui/layout/ScreenHeader';

const ScanQRLinkScreen = ({ onBack }) => {
    return (
        <div className="absolute inset-0 bg-bg-surface z-[1000] flex flex-col animate-fade-in">
            <ScreenHeader title="Scan QR code" onBack={onBack} />

            <div className="flex-1 flex flex-col items-center justify-center px-8">
                <p className="text-[14px] text-text-secondary text-center mb-8 leading-relaxed">
                    Open web.whatsapp.com, desktop app, or other devices.
                </p>

                {/* Fake QR Code */}
                <div className="p-4 bg-white rounded-2xl shadow-xl mb-8">
                    <svg width="220" height="220" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
                        {/* QR pattern - simplified fake QR */}
                        <rect width="220" height="220" fill="white" />
                        {/* Corner squares */}
                        <rect x="10" y="10" width="60" height="60" fill="black" rx="4" />
                        <rect x="18" y="18" width="44" height="44" fill="white" rx="2" />
                        <rect x="26" y="26" width="28" height="28" fill="black" rx="2" />

                        <rect x="150" y="10" width="60" height="60" fill="black" rx="4" />
                        <rect x="158" y="18" width="44" height="44" fill="white" rx="2" />
                        <rect x="166" y="26" width="28" height="28" fill="black" rx="2" />

                        <rect x="10" y="150" width="60" height="60" fill="black" rx="4" />
                        <rect x="18" y="158" width="44" height="44" fill="white" rx="2" />
                        <rect x="26" y="166" width="28" height="28" fill="black" rx="2" />

                        {/* Data modules */}
                        {[85,95,105,115,125,135].map((x, i) => (
                            <rect key={`h${i}`} x={x} y="10" width="8" height="8" fill="black" rx="1" />
                        ))}
                        {[85,95,105,115,125].map((y, i) => (
                            <rect key={`v${i}`} x="10" y={y} width="8" height="8" fill="black" rx="1" />
                        ))}
                        {[85,105,125,145,165,185].map((x, i) => (
                            [85,95,105,115,125,135,145].map((y, j) => (
                                (i + j) % 2 === 0 && <rect key={`m${i}${j}`} x={x} y={y} width="8" height="8" fill="black" rx="1" />
                            ))
                        ))}
                        {/* WhatsApp logo in center */}
                        <circle cx="110" cy="110" r="18" fill="#25d366" />
                        <text x="110" y="116" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">W</text>
                    </svg>
                </div>

                <button className="text-accent text-[14px] font-medium mb-6 hover:underline">
                    Need help?
                </button>
            </div>

            <div className="px-6 pb-8 flex items-center justify-center gap-2 text-text-secondary">
                <Icons.Lock size={14} className="text-accent" />
                <p className="text-[12.5px]">Your calls and messages are <span className="text-accent font-medium">end-to-end encrypted</span></p>
            </div>
        </div>
    );
};

export default ScanQRLinkScreen;
