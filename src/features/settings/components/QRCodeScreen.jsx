import React, { useState } from 'react';
import { Icons } from '@constants/icons';

const ShareQRModal = ({ onClose }) => (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/60 animate-fade-in" onClick={onClose}>
        <div className="w-full max-w-md rounded-t-3xl bg-bg-surface shadow-2xl p-6 animate-fade-in" onClick={e => e.stopPropagation()}>
            <h2 className="text-[18px] font-bold text-text-primary mb-5">Share QR code</h2>
            <div className="grid grid-cols-4 gap-4 mb-6">
                {['Save image', 'WhatsApp', 'Email', 'Copy link'].map((app, i) => (
                    <button key={app} className="flex flex-col items-center gap-2 group" onClick={onClose}>
                        <div className="w-14 h-14 rounded-2xl bg-bg-hover flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                            <span className="text-2xl">{['💾', '💬', '📧', '🔗'][i]}</span>
                        </div>
                        <span className="text-[11px] text-text-secondary text-center leading-tight">{app}</span>
                    </button>
                ))}
            </div>
            <button onClick={onClose} className="w-full py-3 rounded-full bg-bg-hover text-text-primary font-medium active:scale-95 transition-all">Cancel</button>
        </div>
    </div>
);

const QRCodeScreen = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState('myCode');
    const [showShare, setShowShare] = useState(false);

    return (
        <div className="flex flex-col h-full w-full overflow-hidden bg-bg-surface transition-colors duration-300">
            <header className="px-4 py-3 flex items-center justify-between shrink-0 bg-bg-surface border-b border-border-main/5">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-bg-hover rounded-full transition-all active:scale-90 text-text-primary">
                        <Icons.ArrowLeft size={24} />
                    </button>
                    <h1 className="text-[20px] font-bold text-text-primary">QR code</h1>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={() => setShowShare(true)} className="p-2 hover:bg-bg-hover rounded-full text-text-primary">
                        <Icons.Share2 size={22} />
                    </button>
                    <button className="p-2 hover:bg-bg-hover rounded-full text-text-primary">
                        <Icons.MoreVertical size={22} />
                    </button>
                </div>
            </header>

            {/* Tabs */}
            <div className="flex border-b border-border-main/5 bg-bg-surface shrink-0">
                {['myCode', 'scanCode'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-3 text-[14px] font-bold transition-all border-b-2 uppercase tracking-wider
                        ${activeTab === tab ? 'border-accent text-accent' : 'border-transparent text-text-secondary opacity-60'}`}>
                        {tab === 'myCode' ? 'My Code' : 'Scan Code'}
                    </button>
                ))}
            </div>

            <div className="flex-1 flex flex-col items-center justify-center overflow-y-auto custom-scrollbar">
                {activeTab === 'myCode' ? (
                    <div className="flex flex-col items-center max-w-[320px] px-6 py-8 animate-zoom-in">
                        {/* Profile float */}
                        <div className="relative mb-[-32px] z-10 shadow-lg">
                            <img
                                src="https://media.licdn.com/dms/image/v2/D4D35AQEo7B-5pOKGjw/profile-framedphoto-shrink_400_400/B4DaBTLml_KkAU-/0/1788101946087?e=1788760800&v=beta&t=dLPyspBgwi_JtqnyQqrUR0CoUI_lcQRK8HEry44tR8Q"
                                className="w-16 h-16 rounded-full border-4 border-bg-surface object-cover"
                                alt="Profile"
                            />
                        </div>

                        {/* QR Card */}
                        <div className="p-6 pt-14 rounded-[28px] flex flex-col items-center text-center shadow-2xl bg-bg-hover border border-border-main/5 w-full">
                            <h2 className="text-[20px] font-bold text-text-primary mb-1">Muhammad Nabeel Ijaz</h2>
                            <p className="text-[13px] text-text-secondary opacity-70 mb-6">WhatsApp contact</p>

                            <div className="p-4 bg-white rounded-2xl shadow-inner group cursor-pointer overflow-hidden hover:scale-[1.02] transition-transform">
                                <img
                                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://wa.me/923047662828"
                                    alt="QR"
                                    className="w-48 h-48"
                                />
                            </div>

                            <p className="mt-4 text-[12px] text-text-secondary opacity-60">+1 555-010-9999</p>
                        </div>

                        <p className="mt-6 text-center text-[13px] leading-relaxed text-text-secondary opacity-60 italic">
                            Your QR code is private. Share it so others can add you as a contact.
                        </p>
                    </div>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-black/30 animate-fade-in relative">
                        {/* Scanner viewport */}
                        <div className="relative w-64 h-64 mb-8">
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-accent rounded-tl-lg" />
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-accent rounded-tr-lg" />
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-accent rounded-bl-lg" />
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-accent rounded-br-lg" />
                            <div className="absolute inset-4 flex items-center justify-center">
                                <Icons.Camera size={64} className="text-accent opacity-20" />
                            </div>
                            {/* Scanning line */}
                            <div className="absolute w-full h-0.5 bg-accent/70 shadow-[0_0_12px_rgba(0,168,132,0.8)] top-0 animate-[bounce_2s_ease-in-out_infinite]" />
                        </div>

                        <p className="text-text-primary font-medium mb-6 text-[16px]">Scan a WhatsApp QR code</p>

                        <div className="flex gap-6">
                            <button className="p-4 bg-bg-hover/80 backdrop-blur-md rounded-full text-text-primary hover:bg-bg-hover transition-colors active:scale-90">
                                <Icons.Image size={24} />
                            </button>
                            <button className="p-4 bg-bg-hover/80 backdrop-blur-md rounded-full text-text-primary hover:bg-bg-hover transition-colors active:scale-90">
                                <Icons.FlashlightOff size={24} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {showShare && <ShareQRModal onClose={() => setShowShare(false)} />}
        </div>
    );
};

export default QRCodeScreen;
