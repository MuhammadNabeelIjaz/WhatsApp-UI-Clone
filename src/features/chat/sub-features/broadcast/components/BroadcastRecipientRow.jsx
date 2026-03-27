// src/features/chat/sub-features/broadcast/components/BroadcastRecipientRow.jsx
import React from 'react';
import SelectionCheckCircle from '@shared/ui/list/SelectionCheckCircle';

const BroadcastRecipientRow = ({ contact, selected, onToggle }) => (
    <div
        role="button"
        tabIndex={0}
        onClick={() => onToggle(contact)}
        onKeyDown={e => e.key === 'Enter' && onToggle(contact)}
        className="flex items-center gap-3 px-4 py-2.5 hover:bg-bg-hover cursor-pointer transition-colors"
    >
        <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[15px] font-semibold shrink-0"
            style={{ backgroundColor: contact.color || '#607d8b' }}
        >
            {contact.initials || contact.name?.[0]}
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-[15px] font-medium text-text-primary truncate">{contact.name}</p>
            <p className="text-[13px] text-text-secondary truncate">{contact.status}</p>
        </div>
        <SelectionCheckCircle selected={selected} />
    </div>
);

export default BroadcastRecipientRow;
