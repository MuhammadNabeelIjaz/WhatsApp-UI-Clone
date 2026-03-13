import React, { useEffect } from 'react';

/**
 * BottomSheet — slide-up modal overlay.
 * Used for: MuteSheet, AttachmentMenu, reaction pickers, etc.
 *
 * Props:
 *   isOpen     — boolean
 *   onClose    — click-outside / close handler
 *   title      — optional header string
 *   children
 *   maxHeight  — CSS value (default '80vh')
 *   className
 */
const BottomSheet = ({
    isOpen,
    onClose,
    title,
    children,
    maxHeight = '80vh',
    className = '',
}) => {
    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-[900] animate-fade-in"
                onClick={onClose}
            />

            {/* Sheet */}
            <div
                className={`
                    fixed bottom-0 left-0 right-0 z-[910]
                    bg-bg-surface rounded-t-2xl shadow-2xl
                    flex flex-col overflow-hidden
                    animate-slide-up
                    ${className}
                `}
                style={{ maxHeight }}
            >
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-1 shrink-0">
                    <div className="w-10 h-1 rounded-full bg-border-main/40" />
                </div>

                {/* Optional header */}
                {title && (
                    <div className="px-5 pb-3 shrink-0">
                        <h3 className="text-[16px] font-semibold text-text-primary">{title}</h3>
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </>
    );
};

export default BottomSheet;
