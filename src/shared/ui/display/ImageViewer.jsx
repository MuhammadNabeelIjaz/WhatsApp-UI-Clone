import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '@constants/icons';

/**
 * ImageViewer — Full-screen image/avatar zoom overlay.
 *
 * Works for: profile pictures, group icons, channel avatars,
 * community avatars, member avatars — anywhere in the app.
 *
 * Props:
 *   open        — boolean: show/hide
 *   onClose     — () => void
 *   src         — image URL (optional; shows initials fallback if absent)
 *   name        — display name (shown in top bar + initials fallback)
 *   initials    — override auto-initials (optional)
 *   color       — bg color for initials (hex, optional)
 *   subtitle    — secondary line below name (e.g. phone, "Channel", "Group")
 *   shape       — 'circle' (default) | 'rounded' (groups/communities)
 *   actions     — array of { icon, label, onClick } shown at bottom (optional)
 */
const ImageViewer = ({
    open,
    onClose,
    src,
    name = '',
    initials,
    color,
    subtitle,
    shape = 'circle',
    actions = [],
}) => {
    const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-3xl';

    const autoInitials = (
        initials ||
        name.split(' ').filter(Boolean).map(w => w[0]).join('')
    ).slice(0, 2).toUpperCase() || '?';

    // Close on Escape
    const handleKey = useCallback((e) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        if (!open) return;
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [open, handleKey]);

    // Prevent body scroll while open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    key="image-viewer"
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    onClick={onClose}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/92 backdrop-blur-sm" />

                    {/* Top bar */}
                    <div
                        className="absolute top-0 left-0 right-0 flex items-center px-3 py-3 z-10"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/10 active:scale-90 transition-all"
                            aria-label="Close"
                        >
                            <Icons.X size={24} />
                        </button>
                        {name && (
                            <span className="ml-3 text-white text-[17px] font-semibold truncate flex-1">
                                {name}
                            </span>
                        )}
                    </div>

                    {/* Image / Initials */}
                    <motion.div
                        className="relative z-10"
                        initial={{ scale: 0.72, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.72, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                        onClick={e => e.stopPropagation()}
                    >
                        {src ? (
                            <img
                                src={src}
                                alt={name}
                                className={`w-72 h-72 object-cover shadow-2xl ring-4 ring-white/10 ${shapeClass}`}
                                onError={e => {
                                    e.target.style.display = 'none';
                                    if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                        ) : null}
                        {/* Initials fallback — always rendered, hidden when img loads */}
                        <div
                            className={`w-72 h-72 flex items-center justify-center shadow-2xl ring-4 ring-white/10 text-white font-bold text-[72px] select-none ${shapeClass} ${src ? 'hidden' : 'flex'}`}
                            style={{ backgroundColor: color || '#374151' }}
                        >
                            {autoInitials}
                        </div>
                    </motion.div>

                    {/* Name + subtitle */}
                    {(name || subtitle) && (
                        <motion.div
                            className="relative z-10 mt-5 text-center px-6"
                            initial={{ y: 12, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 12, opacity: 0 }}
                            transition={{ delay: 0.06 }}
                            onClick={e => e.stopPropagation()}
                        >
                            {name && (
                                <p className="text-white text-[20px] font-semibold">{name}</p>
                            )}
                            {subtitle && (
                                <p className="text-white/55 text-[14px] mt-1">{subtitle}</p>
                            )}
                        </motion.div>
                    )}

                    {/* Action buttons */}
                    {actions.length > 0 && (
                        <motion.div
                            className="relative z-10 flex items-center gap-6 mt-8"
                            initial={{ y: 12, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 12, opacity: 0 }}
                            transition={{ delay: 0.1 }}
                            onClick={e => e.stopPropagation()}
                        >
                            {actions.map((action, i) => (
                                <button
                                    key={i}
                                    onClick={() => { onClose(); action.onClick?.(); }}
                                    className="flex flex-col items-center gap-2 group"
                                    title={action.label}
                                >
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-90 ${action.primary ? 'bg-accent group-hover:brightness-110' : 'bg-white/10 group-hover:bg-white/20'}`}>
                                        {action.icon}
                                    </div>
                                    <span className="text-white/70 text-[12px] font-medium">
                                        {action.label}
                                    </span>
                                </button>
                            ))}
                        </motion.div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ImageViewer;
