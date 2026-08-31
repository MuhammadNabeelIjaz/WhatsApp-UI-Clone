import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectProfile, setProfile } from '@core/store/slices/settingsSlice';
import { showToast } from '@core/store/slices/uiSlice';
import { useFakeLoading } from '@shared/hooks';
import { createPortal } from 'react-dom';
import { Icons } from '@constants/icons';
import logger from '@core/utils/logger';
import SectionLabel from '@shared/ui/list/SectionLabel';
import NameScreen from './NameScreen';
import AboutScreen from './AboutScreen';
import LinksScreen from './LinksScreen';
import { ChangeNumber } from '@features/settings';
import { ProfileScreenSkeleton } from '@shared/ui/display/Skeletons';

const VIEWS = { main: 'main', name: 'name', about: 'about', links: 'links', phone: 'phone' };

const ProfileScreen = ({ onBack }) => {
    const [view, setView] = useState(VIEWS.main);
    const isLoading = useFakeLoading(420);
    const dispatch  = useDispatch();
    const profile   = useSelector(selectProfile);
    const [avatarUrl, setAvatarUrl] = useState(profile?.avatar || '');
    const [showAvatarOptions, setShowAvatarOptions] = useState(false);
    const fileInputRef = useRef(null);

    // Sync avatar state when profile changes
    useEffect(() => {
        if (profile?.avatar) setAvatarUrl(profile.avatar);
    }, [profile?.avatar]);

    if (isLoading) return <ProfileScreenSkeleton />;
    if (view === VIEWS.name)  return <NameScreen  onBack={() => setView(VIEWS.main)} name={profile?.name} onSave={n => { dispatch(setProfile({ name: n })); dispatch(showToast('Name updated')); setView(VIEWS.main); }} />;
    if (view === VIEWS.about) return <AboutScreen onBack={() => setView(VIEWS.main)} about={profile?.about} onSave={a => { dispatch(setProfile({ about: a })); dispatch(showToast('About updated')); setView(VIEWS.main); }} />;
    if (view === VIEWS.links) return <LinksScreen onBack={() => setView(VIEWS.main)} />;
    if (view === VIEWS.phone) return <ChangeNumber onBack={() => setView(VIEWS.main)} />;

    const handleGallerySelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) { logger.skip('ProfileScreen', 'no file selected'); return; }
        logger.event('ProfileScreen', 'avatar_gallery_select', { name: file.name });
        const reader = new FileReader();
        reader.onload = (ev) => {
            const newUrl = ev.target.result;
            setAvatarUrl(newUrl);
            dispatch(setProfile({ avatar: newUrl }));
            dispatch(showToast('Profile photo updated'));
            setShowAvatarOptions(false);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="flex flex-col h-full w-full select-none bg-bg-surface animate-fade-in relative">
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleGallerySelect}
            />

            {/* Header */}
            <header className="px-4 py-3 flex items-center sticky top-0 z-[100] bg-bg-surface">
                <button
                    onClick={(e) => { e.stopPropagation(); onBack(); }}
                    className="p-2 hover:bg-bg-hover rounded-full transition-all active:scale-90 text-text-primary cursor-pointer"
                >
                    <Icons.ArrowLeft size={24} />
                </button>
                <h1 className="ml-4 text-[20px] font-bold text-text-primary flex-1">Profile</h1>
            </header>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {/* Avatar Section */}
                <div className="flex flex-col items-center py-8">
                    <div
                        className="relative group cursor-pointer"
                        onClick={() => {
                            setShowAvatarOptions(true);
                            logger.event('ProfileScreen', 'avatar_click');
                        }}
                    >
                        <div className="w-[180px] h-[180px] rounded-full overflow-hidden border-4 border-bg-hover shadow-2xl transition-transform group-active:scale-95">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-bg-hover flex items-center justify-center">
                                    <Icons.User size={64} className="text-text-secondary" />
                                </div>
                            )}
                        </div>
                        <div className="absolute bottom-1 right-1 w-12 h-12 bg-accent rounded-full flex items-center justify-center text-black shadow-lg border-4 border-bg-surface group-hover:scale-110 transition-transform">
                            <Icons.Camera size={20} className="text-white" />
                        </div>
                    </div>

                    {/* Edit Profile button  — wired to name screen */}
                    <button
                        onClick={() => {
                            logger.event('ProfileScreen', 'edit_profile_click');
                            setView(VIEWS.name);
                        }}
                        className="mt-6 text-accent font-bold text-[16px] hover:opacity-80 active:scale-95 transition-all p-2"
                    >
                        Edit Profile
                    </button>
                </div>

                {/* Info Rows */}
                <div className="flex flex-col px-2 pb-10">
                    <ProfileRow
                        icon={<Icons.User size={22} />}
                        label="Name"
                        value={profile?.name}
                        description="This is not your username or pin. This name will be visible to your WhatsApp contacts."
                        onClick={() => setView(VIEWS.name)}
                    />
                    <ProfileRow
                        icon={<Icons.Info size={22} />}
                        label="About"
                        value={profile?.about}
                        onClick={() => setView(VIEWS.about)}
                    />
                    <ProfileRow
                        icon={<Icons.Phone size={22} />}
                        label="Phone"
                        value={profile?.phone}
                        onClick={() => setView(VIEWS.phone)}
                    />
                    <ProfileRow
                        icon={<Icons.Link size={22} />}
                        label="Links"
                        value="Add links"
                        isLink
                        onClick={() => setView(VIEWS.links)}
                    />
                </div>
            </div>

            {/* Avatar Options — Portal modal: renders over full viewport, not clipped by sidebar */}
            {showAvatarOptions && createPortal(
                <div
                    className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center px-6"
                    onClick={() => setShowAvatarOptions(false)}
                >
                    <div
                        className="w-full max-w-[320px] bg-bg-surface rounded-2xl px-6 pt-6 pb-6 shadow-2xl animate-zoom-in"
                        onClick={e => e.stopPropagation()}
                    >
                        <p className="text-[16px] font-semibold text-text-primary mb-5">Profile photo</p>
                        <div className="flex flex-col gap-1">
                            <button
                                onClick={() => {
                                    setShowAvatarOptions(false);
                                    logger.event('ProfileScreen', 'avatar_camera_select');
                                    // Camera not available in browser — show gallery instead
                                    fileInputRef.current?.click();
                                }}
                                className="flex items-center gap-4 px-2 py-4 hover:bg-bg-hover rounded-xl transition-all"
                            >
                                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                                    <Icons.Camera size={22} className="text-accent" />
                                </div>
                                <p className="text-[15px] text-text-primary font-medium">Camera</p>
                            </button>
                            <button
                                onClick={() => {
                                    setShowAvatarOptions(false);
                                    logger.event('ProfileScreen', 'avatar_gallery_select');
                                    fileInputRef.current?.click();
                                }}
                                className="flex items-center gap-4 px-2 py-4 hover:bg-bg-hover rounded-xl transition-all"
                            >
                                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                                    <Icons.Image size={22} className="text-blue-400" />
                                </div>
                                <p className="text-[15px] text-text-primary font-medium">Gallery</p>
                            </button>
                            {avatarUrl && (
                                <button
                                    onClick={() => {
                                        logger.event('ProfileScreen', 'avatar_remove');
                                        setAvatarUrl(null);
                                        setShowAvatarOptions(false);
                                    }}
                                    className="flex items-center gap-4 px-2 py-4 hover:bg-bg-hover rounded-xl transition-all"
                                >
                                    <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                                        <Icons.Trash2 size={22} className="text-red-400" />
                                    </div>
                                    <p className="text-[15px] text-red-400 font-medium">Remove photo</p>
                                </button>
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

const ProfileRow = ({ icon, label, value, description, isLink, onClick }) => (
    <div
        onClick={onClick}
        className="flex items-start px-4 py-3 mx-2 my-0.5 rounded-xl hover:bg-bg-hover cursor-pointer transition-colors group"
    >
        <div className="mt-1 mr-8 flex-shrink-0 text-text-secondary group-hover:text-accent transition-colors">
            {icon}
        </div>
        <div className="flex-1 border-b border-border-main/5 pb-4 pr-4 relative">
            <SectionLabel label={label} className="px-0 py-0 mb-1" />
            <div className="flex justify-between items-center">
                <p className="text-[16px] font-medium text-text-primary leading-tight">{value}</p>
                {!isLink && (
                    <Icons.Pencil size={16} className="text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
            </div>
            {description && (
                <p className="text-[13px] text-text-secondary mt-2 leading-snug opacity-70">{description}</p>
            )}
        </div>
    </div>
);

export default ProfileScreen;
