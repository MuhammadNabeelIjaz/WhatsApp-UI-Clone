import React from 'react';

/**
 * WhatsApp Web Clone - Skeleton Chat List Item
 * Displays a pulsing placeholder while the chat list data is loading.
 * Ensures a smooth user experience by preventing layout shift.
 */
const SkeletonChatListItem = () => {
    return (
        <div className="flex items-center px-4 py-3 animate-pulse">
            {/* Avatar Placeholder */}
            <div className="w-[52px] h-[52px] rounded-full bg-bg-skeleton flex-shrink-0" />

            {/* Content Placeholder */}
            <div className="flex-1 ml-4 space-y-2 overflow-hidden">
                <div className="flex justify-between items-center">
                    <div className="h-4 bg-bg-skeleton rounded w-1/3" />
                    <div className="h-3 bg-bg-skeleton rounded w-10" />
                </div>
                <div className="h-3 bg-bg-skeleton rounded w-1/2" />
            </div>
        </div>
    );
};

export default SkeletonChatListItem;