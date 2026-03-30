import React from 'react';
import { Icons } from '@constants/icons'; // Centralized icons use karein

const CallDialerButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="absolute bottom-6 right-6 w-14 h-14 bg-status-success text-bg-main rounded-[18px] flex items-center justify-center shadow-2xl shadow-status-success/30 active:scale-90 transition-all z-50 hover:brightness-110"
        >
            {/* Phone Icon with Plus Badge */}
            <div className="relative">
                <Icons.Phone size={24} className="fill-current" />
                <span className="absolute -top-2 -right-2 text-[18px] font-bold leading-none">
                    +
                </span>
            </div>
        </button>
    );
};

export default CallDialerButton;