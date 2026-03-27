// src/features/chat/sub-features/group-chat/components/MemberList.jsx
import React from 'react';
import { Icons } from '@constants/icons';
import { GROUP_ROLES } from '../constants';

const MemberList = ({ members = [], currentUserId, onRemove }) => (
    <div className="flex flex-col">
        {members.map(member => (
            <div key={member.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-bg-hover transition-colors">
                <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[15px] font-semibold shrink-0"
                    style={{ backgroundColor: member.color || '#607d8b' }}
                >
                    {member.initials || member.name?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-medium text-text-primary truncate">{member.name}</p>
                    {member.role === GROUP_ROLES.ADMIN && (
                        <p className="text-[12px] text-accent">Group admin</p>
                    )}
                </div>
                {onRemove && member.id !== currentUserId && (
                    <button
                        onClick={() => onRemove(member.id)}
                        className="p-1.5 rounded-full hover:bg-red-500/10 text-text-secondary hover:text-red-400 transition-colors"
                    >
                        <Icons.X size={16} />
                    </button>
                )}
            </div>
        ))}
    </div>
);

export default MemberList;
