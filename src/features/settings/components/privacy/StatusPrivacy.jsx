import React, { useState } from 'react';
import { Icons } from '@constants/icons';

const StatusPrivacy = ({ onBack }) => {
    const [selection, setSelection] = useState('contacts');
    const [allowSharing, setAllowSharing] = useState(false);
    const [fbStory, setFbStory] = useState(false);
    const [igStory, setIgStory] = useState(false);

    const RadioOption = ({ label, id, current, badge, badgeColor = "text-accent" }) => (
        <label className="flex items-center justify-between py-4 cursor-pointer active:bg-bg-hover transition-colors">
            <div className="flex flex-col">
                <span className="text-[16.5px] text-text-primary">{label}</span>
            </div>
            <div className="flex items-center gap-3">
                {badge && <span className={`text-[14px] ${badgeColor}`}>{badge}</span>}
                <div className="relative flex items-center justify-center">
                    <input
                        type="radio"
                        checked={current === id}
                        onChange={() => setSelection(id)}
                        className="appearance-none w-5 h-5 border-2 rounded-full border-text-secondary checked:border-accent transition-all"
                    />
                    {current === id && (
                        <div className="absolute w-2.5 h-2.5 bg-accent rounded-full animate-scale-in" />
                    )}
                </div>
            </div>
        </label>
    );

    const ToggleRow = ({ icon: Icon, title, desc, active, setter }) => (
        <div className="flex items-start gap-5 py-5">
            <Icon size={22} className="text-text-secondary mt-1 opacity-70" />
            <div className="flex-1">
                <h3 className="text-[16px] text-text-primary">{title}</h3>
                {desc && <p className="text-[14px] text-text-secondary mt-1 leading-snug">{desc}</p>}
            </div>
            <button
                onClick={() => setter(!active)}
                className={`w-10 h-5 rounded-full relative transition-colors ${active ? 'bg-accent/40' : 'bg-border-main/20'}`}
            >
                <div className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full shadow-sm transition-all ${active ? 'right-0 bg-accent' : 'left-0 bg-text-secondary'}`} />
            </button>
        </div>
    );

    return (
        <div className="flex flex-col h-full w-full animate-fade-in bg-bg-surface">
            <header className="px-4 py-5 flex items-center gap-6 sticky top-0 z-50 shadow-sm bg-bg-surface">
                <button onClick={onBack} className="p-1 hover:bg-bg-hover rounded-full text-text-primary">
                    <Icons.ArrowLeft size={24} />
                </button>
                <h1 className="text-[20px] font-medium text-text-primary">Status privacy</h1>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
                <h3 className="text-[14px] font-medium text-text-secondary mb-2 opacity-80">Who can see my status updates</h3>

                <div className="flex flex-col mb-4">
                    <RadioOption label="My contacts" id="contacts" current={selection} />
                    <RadioOption label="My contacts except..." id="except" current={selection} badge="569 excluded" />
                    <RadioOption label="Only share with..." id="only" current={selection} badge="4 included" />
                </div>

                <div className="h-[1px] w-full bg-border-main/5 my-2" />

                <ToggleRow
                    icon={Icons.RefreshCw}
                    title="Allow sharing"
                    desc="Let people who can see your status reshare and forward it."
                    active={allowSharing}
                    setter={setAllowSharing}
                />

                <div className="mt-8 mb-4">
                    <h3 className="text-[14px] font-medium text-text-secondary opacity-80">Share across apps</h3>
                    <p className="text-[14px] text-text-secondary mt-1">
                        Automatically share your status to your Facebook or Instagram Stories.
                        <span className="text-accent ml-1 cursor-pointer">Manage in Accounts Centre</span>
                    </p>
                </div>

                <ToggleRow icon={Icons.Share2} title="Facebook Story" active={fbStory} setter={setFbStory} />
                <ToggleRow icon={Icons.Image} title="Instagram Story" active={igStory} setter={setIgStory} />

                <p className="text-[13px] text-text-secondary opacity-60 mt-8 leading-relaxed">
                    Changes to your privacy settings won't affect status updates that you shared already.
                </p>
            </div>
        </div>
    );
};

export default StatusPrivacy;
