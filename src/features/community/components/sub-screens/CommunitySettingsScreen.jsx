import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Icons } from '@constants/icons';
import { updateCommunity } from '@core/store/slices/communitySlice';
import { showToast } from '@core/store/slices/uiSlice';

const CommunitySettingsScreen = ({ community, onBack }) => {
    const dispatch = useDispatch();
    const currentSettings = community.settings || { addMembers: 'Everyone', addGroups: 'Only community admins' };
    const [addMembers, setAddMembers] = useState(currentSettings.addMembers);
    const [addGroups,  setAddGroups]  = useState(currentSettings.addGroups);

    const RadioGroup = ({ label, value, onChange, options }) => (
        <div className="px-5 py-4 border-b border-border-main/10">
            <p className="text-[16px] text-text-primary mb-3">{label}</p>
            {options.map(opt => (
                <button
                    key={opt}
                    className="flex items-center gap-3 w-full py-2"
                    onClick={() => onChange(opt)}
                >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${value === opt ? 'border-accent' : 'border-text-secondary/40'}`}>
                        {value === opt && <div className="w-2.5 h-2.5 rounded-full bg-accent" />}
                    </div>
                    <span className="text-[15px] text-text-primary">{opt}</span>
                </button>
            ))}
        </div>
    );

    return (
        <div className="absolute inset-0 bg-bg-surface z-[700] flex flex-col animate-fade-in">
            <header className="flex items-center gap-3 px-3 py-3 shrink-0 border-b border-border-main/10">
                <button onClick={onBack} className="p-2 hover:bg-bg-hover rounded-full text-text-primary transition active:scale-90">
                    <Icons.ArrowLeft size={24} />
                </button>
                <h2 className="text-[18px] font-semibold text-text-primary">Community settings</h2>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <p className="px-5 py-3 text-[13px] text-text-secondary uppercase tracking-wider font-medium">Community permissions</p>
                <RadioGroup
                    label="Who can add new members"
                    value={addMembers}
                    onChange={setAddMembers}
                    options={['Everyone', 'Community admins']}
                />
                <RadioGroup
                    label="Who can add new groups"
                    value={addGroups}
                    onChange={setAddGroups}
                    options={['Only community admins', 'Everyone']}
                />
                <div className="px-5 py-4">
                    <button
                        onClick={() => {
                            dispatch(updateCommunity(community.id, { settings: { addMembers, addGroups } }));
                            dispatch(showToast('Settings saved', 'success'));
                            onBack();
                        }}
                        className="w-full py-3 rounded-xl bg-accent text-white font-semibold text-[15px] hover:opacity-90 active:scale-95 transition-all"
                    >
                        Save settings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommunitySettingsScreen;
