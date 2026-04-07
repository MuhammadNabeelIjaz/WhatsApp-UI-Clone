// src/features/status/components/StatusList.jsx
// Horizontal scrolling row of other contacts' status bubbles.

import React from 'react';
import StatusRing from './StatusRing';

const StatusList = ({ statuses, onOpenStatus }) => {
    if (!statuses.length) return null;

    return (
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pt-2 pb-2" style={{ overflowY: 'visible' }}>
            {statuses.map((user) => (
                <div
                    key={user.id}
                    className="flex flex-col items-center min-w-18 gap-2 cursor-pointer select-none"
                    onClick={() => onOpenStatus(user.id)}
                >
                    <div className="relative w-16 h-16 flex items-center justify-center overflow-visible">
                        <StatusRing total={user.totalSlides} seen={user.seenCount} />
                        <img
                            src={user.image}
                            className="w-13.5 h-13.5 rounded-full object-cover"
                            alt={user.name}
                            onError={(e) => { e.target.src = 'https://i.pravatar.cc/150?u=fallback'; }}
                        />
                    </div>
                    <span className="text-xs truncate w-full text-center text-text-secondary">
                        {user.name.split(' ')[0]}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default StatusList;
