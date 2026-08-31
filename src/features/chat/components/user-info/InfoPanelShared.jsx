// src/features/chat/components/user-info/InfoPanelShared.jsx
// Shared primitives reused by DMInfoPanel, GroupInfoPanel, BroadcastInfoPanel
import React from 'react';
import { Icons } from '@constants/icons';
import Avatar from '@shared/ui/display/Avatar';

export const MEDIA_THUMBNAILS = [
  'https://picsum.photos/seed/11/150/150',
  'https://picsum.photos/seed/22/150/150',
  'https://picsum.photos/seed/33/150/150',
];

export const DISAPPEARING_OPTIONS = [
  { label: 'Off', value: null },
  { label: '7 days', value: 7 },
  { label: '30 days', value: 30 },
  { label: '90 days', value: 90 },
];

export const RowItem = ({ icon: Icon, iconColor, label, value, onClick, danger, rightNode }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-bg-hover transition-all active:scale-[0.99] text-left"
  >
    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
      style={{ backgroundColor: iconColor ? `${iconColor}22` : 'var(--bg-hover)' }}>
      <Icon size={18} style={{ color: iconColor || 'var(--text-secondary)' }} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[14px] font-medium leading-tight"
        style={{ color: danger ? '#ef4444' : 'var(--text-primary)' }}>
        {label}
      </p>
      {value && <p className="text-[12px] mt-0.5 text-text-secondary">{value}</p>}
    </div>
    {rightNode !== undefined ? rightNode : <Icons.ChevronRight size={17} className="text-text-secondary opacity-50" />}
  </button>
);

export const SectionDivider = ({ label }) => (
  <div className="px-5 pt-5 pb-1">
    <p className="text-[12px] font-semibold uppercase tracking-widest text-accent">{label}</p>
  </div>
);

export const Toggle = ({ on, onToggle }) => (
  <div
    className="w-11 h-6 rounded-full flex items-center transition-all px-1 cursor-pointer"
    style={{ backgroundColor: on ? 'var(--accent)' : 'var(--bg-hover)' }}
    onClick={(e) => { e.stopPropagation(); onToggle(); }}
  >
    <div className="w-4 h-4 rounded-full bg-white shadow transition-transform"
      style={{ transform: on ? 'translateX(20px)' : 'translateX(0)' }} />
  </div>
);

export const MediaSection = ({ onOpen }) => (
  <div className="mt-2 bg-bg-surface">
    <button onClick={onOpen} className="w-full px-5 pt-4 pb-2 hover:bg-bg-hover transition-all">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[14px] font-semibold text-text-primary">Media, links, and docs</p>
        <div className="flex items-center gap-1">
          <span className="text-[13px] text-text-secondary">24 · 4 · 4</span>
          <Icons.ChevronRight size={16} className="text-text-secondary" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1.5 pb-3">
        {MEDIA_THUMBNAILS.map((src, i) => (
          <div key={i} className="aspect-square rounded-lg overflow-hidden">
            <img src={src} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </button>
  </div>
);

export const PrivacySection = ({ muted, onMuteToggle, disappearingDays, onDisappearingOpen, isLocked, onLockOpen, isFavorite, onFavorite }) => (
  <div className="mt-2 bg-bg-surface">
    <SectionDivider label="Privacy" />
    <RowItem
      icon={Icons.Bell} iconColor="var(--accent)"
      label="Mute notifications" value={muted ? 'Muted' : 'Not muted'}
      onClick={onMuteToggle} rightNode={<Toggle on={muted} onToggle={onMuteToggle} />}
    />
    <RowItem
      icon={Icons.History} iconColor="#8b5cf6"
      label="Disappearing messages"
      value={disappearingDays ? `On · ${disappearingDays} days` : 'Off'}
      onClick={onDisappearingOpen}
    />
    <RowItem
      icon={Icons.Lock} iconColor="#f59e0b"
      label={isLocked ? 'Chat locked' : 'Lock chat'}
      value={isLocked ? 'Tap to manage lock' : 'Secure with PIN'}
      onClick={onLockOpen}
      rightNode={isLocked ? <Icons.CheckCircle size={18} className="text-yellow-400" /> : undefined}
    />
    <RowItem
      icon={Icons.Heart}
      iconColor={isFavorite ? '#ef4444' : '#f59e0b'}
      label={isFavorite ? 'Remove from favourites' : 'Add to favourites'}
      value="Starred contacts appear at the top"
      onClick={onFavorite}
      rightNode={null}
    />
  </div>
);

export const EncryptionBadge = () => (
  <div className="mt-2 px-5 py-4 flex items-start gap-3 cursor-pointer hover:bg-bg-hover transition-all bg-bg-surface">
    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-green-500/10">
      <Icons.Lock size={17} className="text-green-500" />
    </div>
    <div>
      <p className="text-[13px] font-medium leading-snug text-text-primary">Messages are end-to-end encrypted</p>
      <p className="text-[12px] mt-0.5 text-accent">Click to verify</p>
    </div>
  </div>
);

export const ProfileHero = ({ name, subtitle, avatar, color, initials, isBlocked, isLocked, onAvatarClick, children }) => (
  <div className="flex flex-col items-center pt-8 pb-6 px-4 bg-bg-surface">
    <div className="relative mb-4">
      <div
        className="cursor-pointer hover:opacity-90 transition-all rounded-full"
        onClick={onAvatarClick}
      >
        <Avatar src={avatar} name={name} initials={initials} color={color} size={112} className="ring-4 ring-accent/30 hover:ring-accent/60" />
      </div>
      {isBlocked && (
        <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
          <Icons.Ban size={32} className="text-red-400" />
        </div>
      )}
      {isLocked && (
        <div className="absolute bottom-0 right-0 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-bg-surface">
          <Icons.Lock size={14} className="text-white" />
        </div>
      )}
    </div>
    <h2 className="text-[22px] font-bold mb-0.5 text-text-primary">{name}</h2>
    <p className="text-[14px] text-text-secondary">{subtitle}</p>
    {children}
  </div>
);

export const InfoPanelHeader = ({ title, onBack, onEditContact, onShareContact }) => {
  const [showMenu, setShowMenu] = React.useState(false);
  return (
    <header className="px-4 py-3 flex items-center justify-between shrink-0 border-b border-border-main bg-bg-surface">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-bg-hover transition-all active:scale-90 text-text-secondary">
          <Icons.ArrowLeft size={22} />
        </button>
        <span className="text-[17px] font-semibold text-text-primary">{title}</span>
      </div>
      {(onEditContact || onShareContact) && (
        <div className="relative">
          <button onClick={() => setShowMenu(v => !v)} className="p-2 rounded-full hover:bg-bg-hover text-text-secondary">
            <Icons.MoreVertical size={22} />
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-[1900]" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-10 z-[2000] bg-bg-surface border border-border-main/20 rounded-xl shadow-2xl overflow-hidden min-w-[180px] animate-zoom-in">
                {onEditContact && (
                  <button onClick={() => { onEditContact(); setShowMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-bg-hover transition-colors text-left border-b border-border-main/10">
                    <Icons.Edit2 size={17} className="text-text-secondary shrink-0" />
                    <span className="text-[14px] text-text-primary">Edit contact</span>
                  </button>
                )}
                {onShareContact && (
                  <button onClick={() => { onShareContact(); setShowMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-bg-hover transition-colors text-left">
                    <Icons.Share2 size={17} className="text-text-secondary shrink-0" />
                    <span className="text-[14px] text-text-primary">Share contact</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
};
