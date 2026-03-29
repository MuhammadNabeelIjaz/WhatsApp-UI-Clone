import React, { useState, useRef } from 'react';
import { Icons } from '@constants/icons';
import SectionLabel from '@shared/ui/list/SectionLabel';

const CreateChannelScreen = ({ onBack, onCreate }) => {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [photo, setPhoto] = useState(null);
    const [channelIcon, setChannelIcon] = useState(null); // raw File for backend
    const fileInputRef = useRef(null);

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setChannelIcon(file);
        setPhoto(URL.createObjectURL(file));
    };

    const handleCreate = () => {
        onCreate({
            name,
            description,
            avatar: photo,
            channelIcon, // raw File object for multipart upload
            avatarColor: '#00a884',
            initials: name.slice(0, 2).toUpperCase(),
            handle: `@${name.replace(/\s+/g, '').toLowerCase()}`,
            isVerified: false,
            posts: [],
            createdAt: new Date().toLocaleDateString(),
        });
    };

    
    return (
        <>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="hidden"
                onChange={handlePhotoChange}
            />

            {step === 2 && (
                <div className="absolute inset-0 bg-bg-surface z-[1000] flex flex-col animate-fade-in">
                    <header className="px-4 py-5 flex items-center gap-4 bg-bg-surface shrink-0 border-b border-border-main">
                        <button onClick={() => setStep(1)} className="p-2 hover:bg-bg-hover rounded-full text-text-secondary active:scale-90 transition-all">
                            <Icons.ArrowLeft size={24} />
                        </button>
                        <h2 className="text-[19px] font-medium text-text-primary flex-1">Create channel</h2>
                        <button onClick={onBack} className="p-2 hover:bg-bg-hover rounded-full text-text-secondary active:scale-90 transition-all">
                            <Icons.X size={22} />
                        </button>
                    </header>
                    <div className="flex-1 flex flex-col items-center pt-10 px-6">
                        <div className="relative mb-6">
                            <div className="w-28 h-28 rounded-full bg-bg-input border-2 border-dashed border-border-main flex items-center justify-center overflow-hidden">
                                {photo
                                    ? <img src={photo} alt="Channel" className="w-full h-full object-cover" />
                                    : <Icons.CircleDot size={40} className="text-text-secondary" />
                                }
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-accent flex items-center justify-center shadow-lg"
                            >
                                <Icons.Camera size={18} className="text-white" />
                            </button>
                        </div>
                        <h3 className="text-[22px] font-bold text-text-primary mb-1">{name || 'Channel name'}</h3>
                        {description && <p className="text-[13px] text-text-secondary mb-6">{description}</p>}
                    </div>
                    <div className="px-6 pb-8 space-y-3">
                        <p className="text-[12px] text-text-secondary text-center px-4">
                            By tapping "Create channel", you agree to our Terms of Service.
                        </p>
                        <button
                            onClick={handleCreate}
                            className="w-full bg-accent hover:opacity-90 text-text-inverse py-[13px] rounded-full font-semibold text-[15px] shadow-md active:scale-[0.98] transition-all"
                        >
                            Create channel
                        </button>
                    </div>
                </div>
            )}

            {step === 1 && (
                <div className="absolute inset-0 bg-bg-surface z-[1000] flex flex-col animate-fade-in">
                    <header className="px-4 py-5 flex items-center gap-4 bg-bg-surface shrink-0 border-b border-border-main">
                        <button onClick={onBack} className="p-2 hover:bg-bg-hover rounded-full text-text-secondary active:scale-90 transition-all">
                            <Icons.ArrowLeft size={24} />
                        </button>
                        <h2 className="text-[19px] font-medium text-text-primary flex-1">Create channel</h2>
                        <button onClick={onBack} className="p-2 hover:bg-bg-hover rounded-full text-text-secondary active:scale-90 transition-all">
                            <Icons.X size={22} />
                        </button>
                    </header>

                    <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pt-6">
                        <div className="flex flex-col items-center mb-6">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-bg-input border-2 border-dashed border-border-main/50 flex items-center justify-center overflow-hidden">
                                    {photo
                                        ? <img src={photo} alt="Channel" className="w-full h-full object-cover" />
                                        : <Icons.CircleDot size={36} className="text-text-secondary" />
                                    }
                                </div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow"
                                >
                                    <Icons.Camera size={15} className="text-white" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <SectionLabel label="Channel name" className="mb-1 px-0 py-0" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Enter channel name"
                                    className="w-full bg-transparent border-b border-border-main text-text-primary text-[16px] pb-2 outline-none placeholder:text-text-secondary/50 focus:border-accent transition-colors"
                                />
                            </div>
                            <div>
                                <SectionLabel label="Description (optional)" className="mb-1 px-0 py-0" />
                                <textarea
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    placeholder="Describe your channel. Including a description is useful for your followers."
                                    rows={4}
                                    className="w-full bg-bg-input rounded-xl p-3 text-text-primary text-[14px] outline-none placeholder:text-text-secondary/50 resize-none border border-border-main/30 focus:border-accent transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="px-6 pb-8">
                        <button
                            onClick={() => name.trim() && setStep(2)}
                            disabled={!name.trim()}
                            className="w-full bg-accent hover:opacity-90 disabled:opacity-40 text-text-inverse py-[13px] rounded-full font-semibold text-[15px] shadow-md active:scale-[0.98] transition-all"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default CreateChannelScreen;
