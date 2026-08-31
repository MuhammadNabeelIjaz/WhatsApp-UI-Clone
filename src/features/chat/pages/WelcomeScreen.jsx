import React, { useState, useEffect } from 'react';
import { Icons } from '@constants/icons';

/**
 * WhatsApp Web Clone - Desktop Landing Screen
 * Yeh screen tab dikhti hai jab desktop par koi chat select na ho.
 */
const ChatListScreen = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isStandalone, setIsStandalone] = useState(false);
    const [justInstalled, setJustInstalled] = useState(false);

    useEffect(() => {
        setIsStandalone(
            window.matchMedia('(display-mode: standalone)').matches || 
            window.navigator.standalone
        );
        const handleBeforeInstallPrompt = (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
        };

        const handleAppInstalled = () => {
            setJustInstalled(true);
            setDeferredPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);
        
        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstallClick = async () => {
        if (isStandalone) {
            alert('App is already opened and running!');
            return;
        }
        if (justInstalled) {
            alert('App has been installed successfully. Please open it from your apps menu or home screen.');
            return;
        }
        if (!deferredPrompt) {
            alert('WhatsApp is already installed on your device. Please open it from your home screen or apps list.');
            return;
        }
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
        }
    };

    return (
        <div className="hidden md:flex flex-col items-center justify-center h-full w-full bg-bg-chat-canvas border-l border-border-main/5 relative overflow-hidden">

            {/* Main Content Container */}
            <div className="max-w-[460px] text-center px-10 flex flex-col items-center z-10">

                {/* Visual Illustration */}
                <div className="mb-10 relative group">
                    {/* Background Glow Effect */}
                    <div className="absolute inset-0 bg-accent/5 blur-[60px] rounded-full scale-150 group-hover:bg-accent/10 transition-colors duration-500" />

                    <div className="relative animate-zoom-in">
                        <Icons.Laptop
                            size={140}
                            className="text-text-secondary/20 stroke-[0.5] transition-transform duration-500 hover:scale-105"
                        />
                        {/* Mobile Overlay Icon (Subtle touch) */}
                        <div className="absolute -bottom-2 -right-2 bg-bg-chat-canvas p-2 rounded-xl shadow-lg border border-border-main/5">
                            <Icons.Smartphone size={24} className="text-accent" />
                        </div>
                    </div>
                </div>

                {/* Typography */}
                <h1 className="text-[32px] font-light text-text-primary mb-4 tracking-tight animate-fade-in">
                    WhatsApp for Windows
                </h1>

                <p className="text-text-secondary text-[14px] leading-[1.6] mb-10 opacity-80 animate-fade-in">
                    Send and receive messages without keeping your phone online.
                    Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
                </p>

                {/* Call to Action */}
                <button 
                    onClick={handleInstallClick}
                    className="bg-accent hover:bg-accent-hover text-black px-8 py-2.5 rounded-full font-semibold text-[14px] transition-all hover:scale-[1.03] active:scale-95 mb-24 shadow-md animate-fade-in"
                >
                    {isStandalone ? "Already Opened" : justInstalled ? "App Installed" : "Install App"}
                </button>

                {/* Encryption Notice */}
                <div className="flex items-center gap-1.5 text-text-secondary text-[12px] opacity-50 absolute bottom-10 animate-fade-in">
                    <Icons.Lock size={12} className="shrink-0" />
                    <span className="tracking-wide uppercase text-[11px] font-medium">
                        Your personal messages are end-to-end encrypted
                    </span>
                </div>
            </div>

            {/* Bottom Accent Line (WhatsApp Style) */}
            <div className="absolute bottom-0 w-full h-[6px] bg-accent/40" />

            {/* Subtle Texture/Pattern (Optional: WhatsApp pattern background can go here) */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e71a7a32c17bc.png')]" />
        </div>
    );
};

export default ChatListScreen;