import React, { useState } from 'react';
import { useFakeLoading } from '@shared/hooks';
import { SettingsSubScreenSkeleton } from '@shared/ui/display/Skeletons';
import { Icons } from '@constants/icons';
import SettingsRow from '@shared/ui/settings/SettingsRow';

const AppInfoModal = ({ onClose }) => (
    <div className="fixed inset-0 flex items-center justify-center z-200 bg-black/60 animate-fade-in" onClick={onClose}>
        <div className="w-75 rounded-2xl bg-bg-surface shadow-2xl p-6 text-center animate-zoom-in" onClick={e => e.stopPropagation()}>
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Icons.MessageSquare size={32} className="text-accent" />
            </div>
            <h2 className="text-[20px] font-bold text-text-primary mb-1">WhatsApp Clone</h2>
            <p className="text-text-secondary text-[14px] mb-1">Version 2.26.1.74</p>
            <p className="text-text-secondary text-[13px] opacity-60 mb-6">Built with React + Tailwind</p>
            <div className="text-left border-t border-border-main/10 pt-4 space-y-2">
                <p className="text-[13px] text-text-secondary"><span className="text-accent">Developer:</span> Muhammad Nabeel Ijaz</p>
                <p className="text-[13px] text-text-secondary"><span className="text-accent">Phone:</span> +92 304 7662828</p>
            </div>
            <button onClick={onClose} className="mt-6 text-accent font-bold text-[14px] px-4 py-2 hover:bg-accent/10 rounded-full transition-colors">CLOSE</button>
        </div>
    </div>
);

const FeedbackScreen = ({ onBack }) => {
    const [feedback, setFeedback] = useState('');
    const [sent, setSent] = useState(false);

    return (
        <div className="flex flex-col h-full w-full bg-bg-surface">
            <header className="px-4 py-3 flex items-center gap-4 border-b border-border-main/5 bg-bg-surface">
                <button onClick={onBack} className="p-2 hover:bg-bg-hover rounded-full text-text-primary"><Icons.ArrowLeft size={24} /></button>
                <h1 className="text-[20px] font-bold text-text-primary">Send feedback</h1>
            </header>
            <div className="flex-1 p-6">
                {sent ? (
                    <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                            <Icons.Check size={32} className="text-accent" />
                        </div>
                        <h2 className="text-[18px] font-semibold text-text-primary">Thank you!</h2>
                        <p className="text-text-secondary text-[14px]">Your feedback has been submitted.</p>
                    </div>
                ) : (
                    <>
                        <p className="text-text-secondary text-[14px] mb-4 leading-snug">Describe the technical issue you're experiencing. Include steps to reproduce if possible.</p>
                        <textarea
                            value={feedback}
                            onChange={e => setFeedback(e.target.value)}
                            placeholder="Describe your issue..."
                            className="w-full h-40 bg-bg-hover rounded-xl p-4 text-text-primary text-[15px] outline-none resize-none border border-border-main/10 focus:border-accent transition-colors"
                        />
                        <button
                            onClick={() => feedback.trim() && setSent(true)}
                            disabled={!feedback.trim()}
                            className="mt-4 w-full py-3 rounded-full bg-accent text-white font-bold text-[14px] disabled:opacity-40 active:scale-95 transition-all"
                        >
                            Submit
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

const HelpSettingsScreen = ({ onBack }) => {
    const [subScreen, setSubScreen] = useState(null);
    const isLoading = useFakeLoading();
    const [showAppInfo, setShowAppInfo] = useState(false);

    if (subScreen === 'feedback') return <FeedbackScreen onBack={() => setSubScreen(null)} />;

    if (isLoading) return <SettingsSubScreenSkeleton rowCount={5} />;

    return (
        <div className="flex flex-col h-full w-full overflow-hidden bg-bg-surface">
            <header className="px-4 py-3 flex items-center shrink-0 border-b border-border-main/5 bg-bg-surface">
                <button onClick={onBack} className="p-2 hover:bg-bg-hover rounded-full transition-all active:scale-90 text-text-primary">
                    <Icons.ArrowLeft size={24} />
                </button>
                <h1 className="ml-4 text-[20px] font-bold text-text-primary flex-1">Help</h1>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar py-2">
                <SettingsRow icon={<Icons.HelpCircle size={22} />} title="Help centre" subtitle="Get help, contact us" onClick={() => window.open('https://www.whatsapp.com/help', '_blank')} />
                <SettingsRow icon={<Icons.Users size={22} />} title="Send feedback" subtitle="Report technical issues" onClick={() => setSubScreen('feedback')} />
                <div className="h-px w-[90%] mx-auto bg-border-main/5 my-2" />
                <SettingsRow icon={<Icons.FileText size={22} />} title="Terms and Privacy Policy" onClick={() => window.open('https://www.whatsapp.com/legal', '_blank')} />
                <SettingsRow icon={<Icons.AlertOctagon size={22} />} title="Channel reports" onClick={() => window.open('https://www.whatsapp.com/contact', '_blank')} />
                <SettingsRow icon={<Icons.Info size={22} />} title="App info" subtitle="Version 2.26.1.74" onClick={() => setShowAppInfo(true)} />
                <div className="h-10" />
            </div>

            {showAppInfo && <AppInfoModal onClose={() => setShowAppInfo(false)} />}
        </div>
    );
};

export default HelpSettingsScreen;
