import React from 'react';

/**
 * CenteredModal — centered overlay modal wrapper.
 * Used in UserInfoPanel (disappearing messages, lock chat, edit contact),
 * MuteSheet, ConfirmDialog pattern, etc.
 *
 * Props:
 *   onClose   — backdrop click handler
 *   children  — modal content
 *   maxWidth  — CSS value (default '320px')
 *   className — extra classes
 *   zIndex    — CSS z-index string (default '3000')
 */
const CenteredModal = ({ onClose, children, maxWidth = '320px', className = '', zIndex = '3000' }) => (
    <div
        className="fixed inset-0 flex items-center justify-center bg-black/60 px-6 animate-fade-in"
        style={{ zIndex }}
        onClick={onClose}
    >
        <div
            className={`w-full bg-bg-surface rounded-2xl shadow-2xl overflow-hidden animate-zoom-in ${className}`}
            style={{ maxWidth }}
            onClick={e => e.stopPropagation()}
        >
            {children}
        </div>
    </div>
);

export default CenteredModal;
