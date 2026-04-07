import React from 'react';
import { Icons } from '@constants/icons';
import Avatar from '@shared/ui/display/Avatar';

const CallHistoryItem = ({ call, onRowClick, onCallClick, onAvatarClick }) => {
    const isMissed = call.status === 'missed';
    const isIncoming = call.direction === 'incoming';
    const StatusIcon = isIncoming ? Icons.ArrowDownLeft : Icons.ArrowUpRight;

    return (
        <div
            onClick={onRowClick}
            className="flex items-center px-4 py-3 cursor-pointer transition-all duration-200 hover:bg-bg-hover active:bg-bg-hover/80 border-b border-border-main/10 group"
        >
            <div className="flex-shrink-0" onClick={(e) => { if (onAvatarClick) { e.stopPropagation(); onAvatarClick(call); } }}>
                <Avatar src={call.avatar} name={call.name} size={48} shape="circle" />
            </div>

            <div className="flex-1 ml-4 flex flex-col justify-center min-w-0">
                <h3 className={`text-[16.5px] font-semibold truncate leading-tight transition-colors ${isMissed ? 'text-status-danger' : 'text-text-primary'}`}>
                    {call.name}
                </h3>
                <div className="flex items-center gap-1.5 mt-1">
                    <StatusIcon size={15} className={isMissed ? 'text-status-danger' : 'text-status-success'} strokeWidth={2.5} />
                    <span className="text-[13.5px] text-text-secondary truncate font-medium opacity-90">{call.time}</span>
                </div>
            </div>

            <div className="ml-2 flex items-center justify-center">
                <button
                    onClick={(e) => { e.stopPropagation(); onCallClick?.(); }}
                    className="p-2.5 rounded-full hover:bg-accent/10 active:scale-90 transition-all text-accent"
                >
                    {call.type === 'video' ? <Icons.Video size={20} /> : <Icons.Phone size={19} />}
                </button>
            </div>
        </div>
    );
};

export default React.memo(CallHistoryItem);
