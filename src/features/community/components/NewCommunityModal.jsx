import React, { useState, useRef } from "react";
import { Icons } from "@core/constants/icons";

const NewCommunityModal = ({ isOpen, onClose, onCreateCommunity, editData }) => {
    const isEditMode = Boolean(editData);
    const [step, setStep] = useState(isEditMode ? 2 : 1);
    const [communityName, setCommunityName] = useState(editData?.name || "");
    const [description, setDescription] = useState(
        editData?.description ||
        "Hi everyone! This community is for members to chat in topic-based groups and get important announcements."
    );
    const [photo, setPhoto] = useState(editData?.image || null);
    const fileInputRef = useRef(null);

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPhoto(url);
        }
    };

    if (!isOpen) return null;

    const handleClose = () => {
        setStep(1);
        setCommunityName("");
        setPhoto(null);
        onClose();
    };

    /* ---------------- STEP 1 ---------------- */

    if (step === 1) {
        return (
            // FIXED: absolute inset-0 z-[500] instead of fixed inset-0 z-[9000]
            <div className="absolute inset-0 bg-bg-surface z-[500] flex flex-col animate-slide-in-right overflow-hidden">
                <header className="px-4 py-4 flex items-center bg-bg-surface shrink-0">
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-bg-hover rounded-full text-text-secondary transition-colors"
                    >
                        <Icons.X size={24} />
                    </button>
                </header>

                <div className="flex-1 flex flex-col items-center justify-center px-8 text-center pb-16 overflow-y-auto">
                    <div className="w-[240px] mb-8">
                        <div className="bg-accent/10 rounded-3xl p-6 flex flex-col gap-3 shadow-inner">
                            <div className="flex justify-between items-start">
                                <Icons.Users2 size={40} className="text-accent" />
                                <div className="bg-accent h-3 w-20 rounded-full opacity-20" />
                            </div>

                            <div className="bg-accent h-10 w-full rounded-lg opacity-10 flex items-center px-2">
                                <Icons.Megaphone size={20} className="text-accent" />
                            </div>

                            <div className="flex gap-2">
                                <div className="bg-accent h-8 flex-1 rounded-lg opacity-20" />
                                <div className="bg-accent h-8 flex-1 rounded-lg opacity-20" />
                            </div>
                        </div>
                    </div>

                    <h1 className="text-[22px] font-semibold text-text-primary mb-4">
                        Create a new community
                    </h1>

                    <p className="text-[14px] text-text-secondary leading-[20px] mb-4 max-w-[320px]">
                        Bring together a neighborhood, school or more. Create topic-based
                        groups for members, and easily send them admin announcements.
                    </p>

                    <button className="text-accent text-[14px] font-medium flex items-center gap-1 hover:underline">
                        See example communities <Icons.ChevronRight size={16} />
                    </button>
                </div>

                <div className="p-6 bg-bg-surface shrink-0">
                    <button
                        onClick={() => setStep(2)}
                        className="w-full bg-accent hover:opacity-90 text-text-inverse py-[10px] rounded-full font-semibold text-[14px] shadow-md active:scale-[0.98] transition-all"
                    >
                        Get started
                    </button>
                </div>
            </div>
        );
    }

    /* ---------------- STEP 2 ---------------- */

    return (
        // FIXED: absolute inset-0 z-[500] instead of fixed inset-0 z-[9000]
        <div className="absolute inset-0 bg-bg-surface z-[500] flex flex-col animate-slide-in-right overflow-hidden">

            {/* HEADER */}
            <header className="px-4 py-5 flex items-center gap-8 bg-bg-surface shrink-0 shadow-sm">
                <button
                    onClick={() => (isEditMode ? handleClose() : setStep(1))}
                    className="text-text-primary hover:bg-bg-hover p-2 rounded-full transition"
                >
                    <Icons.ArrowLeft size={24} />
                </button>

                <h2 className="text-[19px] font-medium text-text-primary">
                    {isEditMode ? 'Edit community' : 'New community'}
                </h2>
            </header>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="flex flex-col items-center pt-4 px-6 pb-32 max-w-[500px] mx-auto">
                    <button className="text-[13px] pb-7">
                        <span className="text-accent hover:underline">See examples</span> of different communities
                    </button>

                    {/* PROFILE PHOTO */}
                    <div className="mb-10 flex flex-col items-center gap-3">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handlePhotoChange}
                        />

                        <div className="relative w-[120px] h-[120px]">
                            <div className="absolute inset-0 rounded-[30px] bg-bg-hover overflow-hidden shadow-xl flex items-center justify-center">
                                {photo ? (
                                    <img src={photo} alt="Community" className="w-full h-full object-cover" />
                                ) : (
                                    <Icons.Users2 size={90} className="text-text-secondary opacity-80" />
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-1 right-1 bg-accent p-2.5 rounded-full border-[3px] border-bg-surface shadow-lg active:scale-90 transition"
                            >
                                <Icons.Camera size={18} className="text-text-inverse" />
                            </button>
                        </div>

                        <p className="text-center text-text-secondary text-[13px]">
                            Change photo
                        </p>
                    </div>

                    {/* FORM */}
                    <div className="w-full space-y-10">

                        {/* COMMUNITY NAME */}
                        <div className="relative">
                            <div
                                className={`border-b-2 transition ${communityName
                                    ? "border-accent"
                                    : "border-border-main focus-within:border-accent"
                                    }`}
                            >
                                <span
                                    className={`absolute left-0 transition-all duration-200 ${communityName
                                        ? "-top-5 text-[12px] text-accent"
                                        : "top-1 text-text-secondary"
                                        }`}
                                >
                                    Community name
                                </span>

                                <input
                                    type="text"
                                    autoFocus
                                    value={communityName}
                                    onChange={(e) =>
                                        setCommunityName(e.target.value.slice(0, 100))
                                    }
                                    className="w-full bg-transparent py-2 text-[16px] text-text-primary outline-none"
                                />
                            </div>

                            <div className="flex justify-end mt-1">
                                <span className="text-[11px] text-text-secondary">
                                    {communityName.length} / 100
                                </span>
                            </div>
                        </div>

                        {/* DESCRIPTION */}
                        <div>
                            <div className="border border-border-main rounded-lg p-3 focus-within:border-accent transition bg-bg-input">
                                <textarea
                                    rows="4"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value.slice(0, 2048))
                                    }
                                    className="w-full bg-transparent text-[15px] text-text-primary outline-none resize-none"
                                    placeholder="Community description"
                                />
                            </div>

                            <div className="flex justify-end mt-1">
                                <span className="text-[11px] text-text-secondary">
                                    {description.length} / 2048
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* FLOAT BUTTON */}
            <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-end bg-gradient-to-t from-bg-main via-bg-main/90 to-transparent pointer-events-none">
                <button
                    disabled={!communityName.trim()}
                    onClick={() => {
                        if (!communityName.trim()) return;
                        onCreateCommunity?.({ name: communityName, description, image: photo });
                        handleClose();
                    }}
                    className={`p-4 rounded-2xl shadow-2xl transition-all duration-500 pointer-events-auto ${communityName.trim()
                        ? "bg-accent text-text-inverse"
                        : "bg-bg-hover text-text-secondary opacity-50 cursor-not-allowed"
                        }`}
                >
                    <Icons.Check size={28} />
                </button>
            </div>
        </div>
    );
};

export default NewCommunityModal;
