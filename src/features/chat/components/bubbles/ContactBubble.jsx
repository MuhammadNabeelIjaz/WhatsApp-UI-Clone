import React from 'react';
import { Icons } from '@constants/icons';

/**
 * ContactBubble — renders a shared contact card
 * Props: name, phone, initials, avatarColor, time, isMine, status
 */
const ContactBubble = ({ name, phone, initials, avatarColor, time, isMine, status, senderName, senderColor, onSenderClick }) => {
  const displayInitials = initials || (name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const bgColor = avatarColor || '#6b7280';

  return (
    <div
      className={`max-w-[280px] rounded-2xl shadow-md border border-border-main/20 transition-all overflow-hidden
        ${isMine ? 'self-end bg-bg-bubble-out' : 'self-start bg-bg-bubble-in'}
      `}
    >
      {/* Sender Name */}
      {senderName && (
          <div 
              className="text-[12.5px] font-semibold leading-tight mb-2 mt-2 ml-3 cursor-pointer hover:underline"
              style={{ color: senderColor || (isMine ? '#34b7f1' : '#e53935') }}
              onClick={onSenderClick}
          >
              {senderName}
          </div>
      )}
      {/* Top Section: Avatar and Name */}
      <div className="p-3 flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-text-primary text-[16px] font-bold shrink-0"
          style={{ backgroundColor: bgColor }}
        >
          {displayInitials}
        </div>
        <div className="flex-1 overflow-hidden">
          <h4 className="text-[15px] font-semibold text-text-primary leading-tight truncate">
            {name || 'Unknown'}
          </h4>
          {phone && (
            <p className="text-[12px] text-text-secondary truncate mt-0.5">{phone}</p>
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="flex justify-end items-center gap-1 px-3 pb-1 -mt-1">
        <span className="text-[11px] opacity-60 text-text-secondary">
          {time || 'Now'}
        </span>
        {isMine && (
          <div className="flex items-center">
            {status === 'read' ? (
              <Icons.CheckCheck size={15} className="text-[#53bdeb]" strokeWidth={2.5} />
            ) : (
              <Icons.Check size={15} className="opacity-60 text-text-secondary" strokeWidth={2.5} />
            )}
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="border-t border-white/10">
        <button className="w-full py-2.5 text-[15px] font-medium text-[#00e676] hover:bg-white/5 active:bg-white/10 transition-colors">
          Message
        </button>
      </div>
    </div>
  );
};

export default ContactBubble;
