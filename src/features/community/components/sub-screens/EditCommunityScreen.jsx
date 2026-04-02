import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Icons } from '@constants/icons';
import { updateCommunity } from '@core/store/slices/communitySlice';
import { showToast } from '@core/store/slices/uiSlice';

const EditCommunityScreen = ({ community, onBack }) => {
    const dispatch = useDispatch();
    const [name, setName] = useState(community.name || '');
    const [desc, setDesc] = useState(community.description || '');

    const handleSave = () => {
        dispatch(updateCommunity(community.id, { name: name.trim(), description: desc.trim() }));
        dispatch(showToast('Community info updated', 'success'));
        onBack();
    };

    return (
        <div className="absolute inset-0 bg-bg-surface z-[700] flex flex-col animate-fade-in">
            <header className="flex items-center gap-3 px-3 py-3 shrink-0 border-b border-border-main/10">
                <button onClick={onBack} className="p-2 hover:bg-bg-hover rounded-full text-text-primary transition active:scale-90">
                    <Icons.ArrowLeft size={24} />
                </button>
                <h2 className="text-[18px] font-semibold text-text-primary">Edit community</h2>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-5 py-6 space-y-6">
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="w-28 h-28 rounded-3xl overflow-hidden bg-bg-hover flex items-center justify-center shadow-lg">
                            {community.image
                                ? <img src={community.image} alt="" className="w-full h-full object-cover" />
                                : <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white"
                                    style={{ background: community.avatarColor || '#00a884' }}>
                                    {(community.name || '').slice(0, 2).toUpperCase()}
                                </div>
                            }
                        </div>
                        <button className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-accent flex items-center justify-center shadow-lg">
                            <Icons.Camera size={18} className="text-white" />
                        </button>
                    </div>
                </div>

                <div className="relative">
                    <label className="absolute -top-2 left-3 text-[12px] text-accent bg-bg-surface px-1">Community name</label>
                    <div className="border-2 border-accent rounded-lg p-3">
                        <input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            maxLength={100}
                            className="w-full bg-transparent text-[16px] text-text-primary outline-none"
                        />
                    </div>
                    <p className="text-right text-[12px] text-text-secondary mt-1">{name.length}/100</p>
                </div>

                <div className="relative">
                    <div className="border border-border-main/40 rounded-lg p-3">
                        <textarea
                            value={desc}
                            onChange={e => setDesc(e.target.value)}
                            maxLength={2048}
                            rows={5}
                            className="w-full bg-transparent text-[16px] text-text-primary outline-none resize-none"
                            placeholder="Community description..."
                        />
                    </div>
                    <p className="text-right text-[12px] text-text-secondary mt-1">{desc.length}/2048</p>
                </div>
            </div>

            <button
                onClick={handleSave}
                className="absolute bottom-6 right-6 w-14 h-14 rounded-2xl bg-accent flex items-center justify-center shadow-xl hover:opacity-90 active:scale-95 transition-all"
            >
                <Icons.Check size={24} className="text-white" />
            </button>
        </div>
    );
};

export default EditCommunityScreen;
