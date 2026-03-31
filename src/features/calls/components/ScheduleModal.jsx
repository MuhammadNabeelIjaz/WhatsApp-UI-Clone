// src/features/calls/components/ScheduleModal.jsx
// Responsive modal wrapper: bottom-sheet on mobile, centered modal on desktop.
import React from 'react';

const ScheduleModal = ({ isDesktop, onCancel, children }) => {
    if (isDesktop) {
        return (
            <div
                className="fixed inset-0 z-[600] flex items-center justify-center bg-black/50 animate-fade-in"
                onClick={onCancel}
            >
                <div
                    className="w-full max-w-md bg-bg-surface rounded-xl shadow-2xl overflow-hidden animate-zoom-in"
                    onClick={e => e.stopPropagation()}
                >
                    {children}
                </div>
            </div>
        );
    }
    return (
        <div
            className="absolute inset-0 z-[600] flex items-end bg-black/50 animate-fade-in"
            onClick={onCancel}
        >
            <div
                className="w-full bg-bg-surface rounded-t-3xl animate-slide-up"
                onClick={e => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};

export default ScheduleModal;
