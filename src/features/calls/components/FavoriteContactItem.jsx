import React, { useState } from 'react';
import { Icons } from '@constants/icons';
import Avatar from '@shared/ui/display/Avatar';

const FavoriteContactItem = ({ contact, onCall, onVideoCall, onRemove }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="relative">
      <div
        className="flex items-center px-5 py-3 hover:bg-bg-hover cursor-pointer transition-colors group"
        onContextMenu={(e) => { e.preventDefault(); setShowActions(v => !v); }}
        onLongPress={() => setShowActions(v => !v)}
      >
        {/* Avatar */}
        <Avatar
          src={contact.avatar}
          name={contact.name}
          color={contact.avatarColor}
          size="md"
          badge={
            <div className="bg-bg-surface p-[2px] rounded-full">
              <Icons.Heart size={12} className="text-red-500 fill-red-500" />
            </div>
          }
        />

        {/* Info */}
        <div className="flex-1 ml-4 overflow-hidden">
          <p className="text-[16px] font-semibold text-text-primary truncate">{contact.name}</p>
          <p className="text-[13px] text-text-secondary">Tap to call</p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onVideoCall?.(contact); }}
            className="p-2 hover:bg-bg-surface rounded-full text-text-secondary transition-colors"
          >
            <Icons.Video size={20} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onCall?.(contact); }}
            className="p-2 hover:bg-bg-surface rounded-full text-accent transition-colors"
          >
            <Icons.Phone size={20} />
          </button>
        </div>
      </div>

      {/* Long-press / context menu */}
      {showActions && (
        <>
          <div className="fixed inset-0 z-[500]" onClick={() => setShowActions(false)} />
          <div className="absolute right-4 top-14 z-[510] bg-bg-surface border border-border-main rounded-xl shadow-2xl py-2 w-52 animate-zoom-in origin-top-right">
            <button
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bg-hover text-text-primary text-[14px] transition-colors"
              onClick={() => { onCall?.(contact); setShowActions(false); }}
            >
              <Icons.Phone size={18} className="text-text-secondary" /> Voice call
            </button>
            <button
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bg-hover text-text-primary text-[14px] transition-colors"
              onClick={() => { onVideoCall?.(contact); setShowActions(false); }}
            >
              <Icons.Video size={18} className="text-text-secondary" /> Video call
            </button>
            <div className="h-[1px] bg-border-main/30 my-1 mx-3" />
            <button
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bg-hover text-red-500 text-[14px] transition-colors"
              onClick={() => { onRemove?.(contact.id); setShowActions(false); }}
            >
              <Icons.HeartOff size={18} /> Remove from favourites
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(FavoriteContactItem);
