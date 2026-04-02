import React, { useState } from 'react';
import { Icons } from '@constants/icons';
import ToggleSwitch from '@shared/ui/buttons/ToggleSwitch';

const SecuritySettingsScreen = ({ onBack }) => {
    const [showNotifications, setShowNotifications] = useState(false);

    const securityFeatures = [
        { icon: <Icons.MessageSquare size={20} />, text: "Text and voice messages" },
        { icon: <Icons.Phone size={20} />, text: "Audio and video calls" },
        { icon: <Icons.Paperclip size={20} />, text: "Photos, videos and documents" },
        { icon: <Icons.MapPin size={20} />, text: "Location sharing" },
        { icon: <Icons.RefreshCw size={20} />, text: "Status updates" },
    ];

    return (
        <div className="flex flex-col h-full w-full bg-bg-surface">
            <header className="px-4 py-3 flex items-center gap-4 sticky top-0 z-50 bg-bg-surface border-b border-border-main/5">
                <button onClick={onBack} className="p-2 hover:bg-bg-hover rounded-full transition-all active:scale-90 text-text-primary">
                    <Icons.ArrowLeft size={24} />
                </button>
                <h1 className="text-[20px] font-bold text-text-primary">Security notifications</h1>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-10 flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-accent/10 flex items-center justify-center mb-8">
                    <Icons.ShieldCheck size={80} className="text-accent" />
                </div>

                <h2 className="text-[18px] font-medium mb-4 w-full text-text-primary">
                    Your chats and calls are private
                </h2>

                <p className="text-[14px] leading-relaxed mb-6 text-text-secondary">
                    End-to-end encryption keeps your personal messages and calls between you and the people you choose. No one outside of the chat, not even WhatsApp, can read, listen to, or share them. This includes your:
                </p>

                <div className="w-full flex flex-col gap-4 mb-8">
                    {securityFeatures.map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <div className="text-accent">{item.icon}</div>
                            <span className="text-[15px] text-text-secondary">{item.text}</span>
                        </div>
                    ))}
                </div>

                <button className="w-full text-left text-[14px] font-medium mb-10 text-accent">Learn more</button>

                <hr className="w-full border-t border-border-main/10 mb-8" />

                <div className="w-full flex justify-between items-start gap-4">
                    <div className="flex flex-col gap-1 flex-1">
                        <span className="text-[16px] text-text-primary">Show security notifications on this device</span>
                        <p className="text-[13px] leading-tight text-text-secondary">
                            Get notified when your security code changes for a contact's phone in an end-to-end encrypted chat.
                            <span className="ml-1 cursor-pointer text-accent">Learn more</span>
                        </p>
                    </div>
                    <div className="pt-1">
                        <ToggleSwitch checked={showNotifications} onChange={() => setShowNotifications(!showNotifications)} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecuritySettingsScreen;
