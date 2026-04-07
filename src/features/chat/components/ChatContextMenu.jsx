// src/components/chat/ChatContextMenu.jsx
import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Icons } from '@constants/icons';

const ChatContextMenu = ({ chat, position, onClose, onAction }) => {
    const menuRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
        };
        document.addEventListener('mousedown', handler);
        document.addEventListener('touchstart', handler);
        return () => {
            document.removeEventListener('mousedown', handler);
            document.removeEventListener('touchstart', handler);
        };
    }, [onClose]);

    // ── Dynamic labels based on current chat state ─────────────────────────
    const items = [
        {
            key: 'multiselect',
            Icon: Icons.CheckSquare,
            label: 'Select',
        },
        {
            key: 'addtolist',
            Icon: Icons.List,
            label: 'Add to list',
        },
        {
            key: 'archive',
            Icon: chat?.isArchived ? Icons.ArchiveRestore : Icons.Archive,
            label: chat?.isArchived ? 'Unarchive' : 'Archive',
        },
        {
            key: 'mute',
            Icon: chat?.isMuted ? Icons.Bell : Icons.BellOff,
            label: chat?.isMuted ? 'Unmute notifications' : 'Mute notifications',
        },
        {
            key: 'pin',
            Icon: Icons.Pin,
            label: chat?.isPinned ? 'Unpin from top' : 'Pin to top',
        },
        {
            key: 'unread',
            Icon: Icons.MessageCircle,
            label: chat?.unreadCount > 0 ? 'Mark as read' : 'Mark as unread',
        },
        {
            key: 'delete',
            Icon: Icons.Trash2,
            label: 'Delete chat',
            danger: true,
        },
    ];

    // ── Clamp to viewport so menu doesn't go off-screen ───────────────────
    const MENU_W = 220;
    const MENU_H = 360;
    const x = Math.min(position?.x ?? 0, window.innerWidth  - MENU_W - 8);
    const y = Math.min(position?.y ?? 0, window.innerHeight - MENU_H - 8);

    return ReactDOM.createPortal(
        <>
            {/* Invisible backdrop to catch outside clicks */}
            <div className="fixed inset-0 z-[9998]" onClick={onClose} />

            {/* Menu card */}
            <div
                ref={menuRef}
                className="fixed z-[9999] rounded-xl shadow-2xl overflow-hidden animate-zoom-in origin-top-left"
                style={{
                    top: y,
                    left: x,
                    minWidth: MENU_W,
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid rgba(255,255,255,0.08)',
                }}
            >
                {/* Chat name header */}
                <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    <p className="text-[13px] font-semibold truncate" style={{ color: 'var(--text-secondary)' }}>
                        {chat?.name}
                    </p>
                </div>

                {/* Action buttons */}
                {items.map(({ key, Icon, label, danger }) => (
                    <button
                        key={key}
                        onClick={() => { onAction(key); onClose(); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-bg-hover active:bg-bg-hover/80 transition-colors"
                    >
                        <Icon
                            size={18}
                            strokeWidth={1.8}
                            className={danger ? 'text-red-500' : 'text-text-secondary'}
                        />
                        <span
                            className="text-[14.5px]"
                            style={{ color: danger ? '#ef4444' : 'var(--text-primary)' }}
                        >
                            {label}
                        </span>
                        {/* Active state indicator for pin/mute */}
                        {key === 'pin' && chat?.isPinned && (
                            <Icons.Check size={14} className="ml-auto text-accent" />
                        )}
                        {key === 'mute' && chat?.isMuted && (
                            <Icons.Check size={14} className="ml-auto text-accent" />
                        )}
                    </button>
                ))}
            </div>
        </>,
        document.body
    );
};

export default ChatContextMenu;
