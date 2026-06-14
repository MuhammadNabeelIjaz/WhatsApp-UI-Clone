import React from 'react';
import { useFakeLoading } from '@shared/hooks';
import { Icons } from '@constants/icons';
import ChatListItem from '../ChatListItem';
import { useSelector } from 'react-redux';
import { selectChats } from '@core/store/slices/chatSlice';
import { LockedViewSkeleton } from '@shared/ui/display/Skeletons';
import ProfilePictureOverlay from '@shared/ui/display/ProfilePictureOverlay';

/**
 * WhatsApp Web Clone - Locked Chats View
 * Displays chats where isLocked is true with privacy warnings
 */
const LockedView = ({ onBack, onChatSelect, selectedChat, onOpenInfoPanel }) => {
    const chats = useSelector(selectChats);
    const lockedChats = chats.filter(chat => chat.isLocked);
    const [avatarOverlayChat, setAvatarOverlayChat] = React.useState(null);
    const isLoading = useFakeLoading(320);

    if (isLoading) return <LockedViewSkeleton />;

    return (
        <div className="flex flex-col h-full bg-bg-surface animate-fade-in">
            {/* --- HEADER --- */}
            <header className="bg-bg-surface px-4 py-[18px] flex items-center gap-6 min-h-[64px]">
                <button
                    onClick={onBack}
                    className="p-1 hover:bg-bg-hover rounded-full text-text-secondary transition-colors"
                >
                    <Icons.ArrowLeft size={24} />
                </button>
                <h1 className="text-[19px] font-semibold text-text-primary">Locked chats</h1>
            </header>

            {/* --- PRIVACY BANNER (image_d3b69e.png context) --- */}
            <div className="mx-4 my-2 p-4 bg-bg-hover/40 rounded-xl border border-border-main/10">
                <div className="flex gap-4">
                    <Icons.Info size={20} className="text-accent shrink-0 mt-0.5" />
                    <div>
                        <p className="text-[14px] text-text-primary font-medium mb-1">
                            Locked on linked devices
                        </p>
                        <p className="text-[13px] text-text-secondary leading-snug">
                            For better privacy, locked chats are also hidden on your other linked devices.
                            <span className="text-accent cursor-pointer hover:underline ml-1">Learn more</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* --- LOCKED CHATS LIST --- */}
            <div className="flex-1 overflow-y-auto custom-scrollbar mt-2">
                {lockedChats.length > 0 ? (
                    lockedChats.map((chat) => (
                        <ChatListItem
                            key={chat.id}
                            chat={chat}
                            isCurrentChat={selectedChat?.id === chat.id}
                            onSelect={() => onChatSelect(chat)}
                            onAvatarClick={(c) => setAvatarOverlayChat(c)}
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-[60%] p-8 text-center">
                        <div className="w-20 h-20 bg-bg-hover rounded-full flex items-center justify-center mb-6 py-2">
                            <Icons.Lock size={40} className="text-text-secondary opacity-40" />
                        </div>
                        <h2 className="text-text-primary font-medium text-[16px] mb-2">No locked chats</h2>
                        <p className="text-text-secondary text-sm max-w-[250px]">
                            Lock your most personal chats to keep them extra private.
                        </p>
                    </div>
                )}
            </div>

            {/* --- FOOTER --- */}
            <div className="py-6 flex flex-col items-center gap-2 opacity-60">
                <div className="flex items-center gap-1.5">
                    <Icons.ShieldCheck size={14} className="text-accent" />
                    <span className="text-[12px] text-text-primary font-medium">Privacy Guaranteed</span>
                </div>
                <span className="text-[11px] text-text-secondary max-w-[200px] text-center">
                    Locked chats use your device's primary security method.
                </span>
            </div>
            {avatarOverlayChat && (
                <ProfilePictureOverlay
                    chat={avatarOverlayChat}
                    onClose={() => setAvatarOverlayChat(null)}
                    onInfo={() => { setAvatarOverlayChat(null); onChatSelect(avatarOverlayChat); onOpenInfoPanel?.(avatarOverlayChat); }}
                    onMessage={() => { setAvatarOverlayChat(null); onChatSelect(avatarOverlayChat); }}
                />
            )}
        </div>
    );
};

export default LockedView;