// src/features/chat/sub-features/group-chat/components/GroupSettings.jsx
import React from 'react';
import { Icons } from '@constants/icons';

const GroupSettings = ({ group: _group, onEdit }) => (
    <div className="flex flex-col gap-2 px-4 py-3">
        <button
            onClick={() => onEdit?.('name')}
            className="flex items-center gap-3 py-2.5 hover:bg-bg-hover rounded-xl px-2 transition-colors"
        >
            <Icons.Edit size={20} className="text-text-secondary" />
            <span className="text-[15px] text-text-primary">Edit group name</span>
        </button>
        <button
            onClick={() => onEdit?.('description')}
            className="flex items-center gap-3 py-2.5 hover:bg-bg-hover rounded-xl px-2 transition-colors"
        >
            <Icons.FileText size={20} className="text-text-secondary" />
            <span className="text-[15px] text-text-primary">Edit description</span>
        </button>
    </div>
);

export default GroupSettings;
