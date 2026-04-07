import React, { useState } from 'react';
import { Icons } from '@constants/icons';
const options = [
    { id: 'everyone', label: 'Everyone' },
    { id: 'contacts', label: 'My contacts' },
    { id: 'except', label: 'My contacts except...' },
    { id: 'nobody', label: 'Nobody' },
];

const GroupsPrivacy = ({ onBack }) => {
    const [selected, setSelected] = useState('contacts');
    return (
        <div className="flex flex-col h-full w-full bg-bg-surface">
            <header className="px-4 py-5 flex items-center gap-6 sticky top-0 z-50 shadow-sm bg-bg-surface">
                <button onClick={onBack} className="p-1 hover:bg-bg-hover rounded-full transition-colors active:scale-95 text-text-primary">
                    <Icons.ArrowLeft size={24} />
                </button>
                <h1 className="text-[20px] font-medium text-text-primary">Groups</h1>
            </header>
            <div className="flex-1 px-6 py-6">
                <h3 className="text-[14px] font-medium text-text-secondary mb-4 opacity-80">Who can add me to groups</h3>
                <div className="flex flex-col">
                    {options.map(o => (
                        <label key={o.id} className="flex items-center justify-between py-4 cursor-pointer hover:bg-bg-hover transition-colors">
                            <span className="text-[16.5px] text-text-primary">{o.label}</span>
                            <div className="relative flex items-center justify-center">
                                <input type="radio" name="groups" checked={selected === o.id} onChange={() => setSelected(o.id)}
                                    className="appearance-none w-5 h-5 border-2 rounded-full border-text-secondary checked:border-accent transition-all" />
                                {selected === o.id && <div className="absolute w-2.5 h-2.5 bg-accent rounded-full" />}
                            </div>
                        </label>
                    ))}
                </div>
                <p className="text-[13px] text-text-secondary opacity-70 mt-6 leading-relaxed">
                    If you select My contacts or My contacts except, anyone not in your list will need to send an invite via a private message.
                </p>
            </div>
        </div>
    );
};
export default GroupsPrivacy;
