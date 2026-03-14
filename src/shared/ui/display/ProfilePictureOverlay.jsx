import React, { useEffect } from 'react';
import { Icons } from '@constants/icons';

/**
 * WhatsApp-style profile picture enlargement overlay.
 * - Full-screen dark backdrop
 * - Large circular avatar (or initials fallback)
 * - Name + phone subtitle
 * - Info icon (opens contact info) and Message icon (opens chat)
 * - Closes on backdrop click or X button
 */
const ProfilePictureOverlay = ({ chat, onClose, onInfo, onMessage }) => {
    const name = chat?.name || 'Unknown';
    const avatar = chat?.avatar;
    const phone = chat?.phone || '';
    const initials = (chat?.initials || name.split(' ').map(w => w[0]).join('')).slice(0, 2).toUpperCase();
    const color = chat?.avatarColor || '#374151';

    // Close on Escape key
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-[2000] flex flex-col items-center justify-center bg-black/90 animate-fade-in"
            onClick={onClose}
        >
            {/* Top bar */}
            <div
                className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-4"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/10 active:scale-90 transition-all"
                >
                    <Icons.X size={24} />
                </button>
                <span className="text-white text-[17px] font-semibold flex-1 ml-3">{name}</span>
            </div>

            {/* Avatar */}
            <div
                className="relative"
                onClick={(e) => e.stopPropagation()}
            >
                {avatar ? (
                    <img
                        src={avatar}
                        alt={name}
                        className="w-72 h-72 rounded-full object-cover shadow-2xl ring-4 ring-white/10"
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                    />
                ) : null}
                {/* Initials fallback */}
                <div
                    className={`w-72 h-72 rounded-full flex items-center justify-center shadow-2xl ring-4 ring-white/10 text-white font-bold text-[72px] ${avatar ? 'hidden' : 'flex'}`}
                    style={{ backgroundColor: color }}
                >
                    {initials}
                </div>
            </div>

            {/* Name + phone */}
            <div className="mt-5 text-center" onClick={(e) => e.stopPropagation()}>
                <p className="text-white text-[20px] font-semibold">{name}</p>
                {phone && <p className="text-white/60 text-[14px] mt-1">{phone}</p>}
            </div>

            {/* Action buttons — Info + Message */}
            <div
                className="flex items-center gap-8 mt-8"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={() => { onClose(); onInfo?.(); }}
                    className="flex flex-col items-center gap-2 group"
                    title="Contact info"
                >
                    <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 active:scale-90 transition-all">
                        <Icons.Info size={26} className="text-white" />
                    </div>
                    <span className="text-white/70 text-[12px] font-medium">Info</span>
                </button>

                <button
                    onClick={() => { onClose(); onMessage?.(); }}
                    className="flex flex-col items-center gap-2 group"
                    title="Send message"
                >
                    <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center group-hover:brightness-110 active:scale-90 transition-all">
                        <Icons.MessageSquare size={26} className="text-white" />
                    </div>
                    <span className="text-white/70 text-[12px] font-medium">Message</span>
                </button>
            </div>
        </div>
    );
};

export default ProfilePictureOverlay;
