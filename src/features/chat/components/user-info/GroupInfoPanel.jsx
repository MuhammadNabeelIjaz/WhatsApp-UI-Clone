// src/features/chat/components/user-info/GroupInfoPanel.jsx
import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Icons } from '@constants/icons';
import { selectContacts } from '@core/store/slices/contactSlice';
import { muteChat, unmuteChat, lockChat, toggleChatFavorite } from '@core/store/slices/chatSlice';
import { showToast } from '@core/store/slices/uiSlice';
import {
  RowItem, SectionDivider, MediaSection, PrivacySection, EncryptionBadge,
  ProfileHero, InfoPanelHeader,
} from './InfoPanelShared';
import { DisappearingModal, LockChatModal } from './InfoPanelModals';
import ConfirmDialog from '@shared/ui/feedback/ConfirmDialog';

import Avatar from '@shared/ui/display/Avatar';

const ActiveCallScreen = React.lazy(() => import('@features/calls/pages/ActiveCallScreen'));

const GroupInfoPanel = ({ chat, onBack, onShowMediaLinksDoc }) => {
  const dispatch = useDispatch();
  const contacts = useSelector(selectContacts);

  const groupName = chat?.name || 'Group';
  const groupAvatar = chat?.avatar || null;

  const groupMembers = useMemo(() => {
    const rawMembers = chat?.members || [];
    return rawMembers.map(m => {
      if (typeof m === 'object' && m !== null) return m;
      const contact = (contacts || []).find(c => c.id === m);
      if (contact) return contact;
      return { id: m, name: m === 'me' ? 'You' : m, initials: m === 'me' ? 'Y' : m.slice(0, 2).toUpperCase(), avatarColor: '#888' };
    });
  }, [chat?.members, contacts]);

  const groupMemberCount = groupMembers.length || chat?.memberCount || 0;
  const groupAdmins = chat?.admins || [];

  const [muted, setMuted] = useState(chat?.isMuted || false);
  const [disappearingDays, setDisappearingDays] = useState(null);
  const [showDisappearingModal, setShowDisappearingModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(chat?.isFavorite || false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [lockPin, setLockPin] = useState('');
  const [lockStage, setLockStage] = useState('enter');
  const [lockPinConfirm, setLockPinConfirm] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [chatCleared, setChatCleared] = useState(false);
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [activeCall, setActiveCall] = useState(null);

  const handleMuteToggle = () => {
    if (muted) { dispatch(unmuteChat(chat?.id)); setMuted(false); dispatch(showToast('Notifications unmuted')); }
    else { dispatch(muteChat(chat?.id, 'always')); setMuted(true); dispatch(showToast('Notifications muted')); }
  };

  const handleFavorite = () => {
    dispatch(toggleChatFavorite(chat?.id));
    dispatch(showToast(isFavorite ? 'Removed from favourites' : 'Added to favourites'));
    setIsFavorite(v => !v);
  };

  const handleLockSubmit = () => {
    if (lockStage === 'enter') {
      if (lockPin.length < 4) { dispatch(showToast('PIN must be at least 4 digits', 'error')); return; }
      setLockStage('confirm');
    } else if (lockStage === 'confirm') {
      if (lockPin !== lockPinConfirm) { dispatch(showToast('PINs do not match', 'error')); setLockPinConfirm(''); return; }
      dispatch(lockChat(chat?.id));
      setIsLocked(true); setShowLockModal(false); setLockStage('enter'); setLockPin(''); setLockPinConfirm('');
      dispatch(showToast('Chat locked with PIN'));
    }
  };

  const closeLockModal = () => { setShowLockModal(false); setLockStage('enter'); setLockPin(''); setLockPinConfirm(''); };

  if (activeCall) return (
    <React.Suspense fallback={<div className="absolute inset-0 bg-bg-surface" />}>
      <ActiveCallScreen
        call={{ type: activeCall.type, name: activeCall.name, avatar: activeCall.avatar, status: 'Calling...' }}
        onEnd={() => setActiveCall(null)}
      />
    </React.Suspense>
  );

  return (
    <>
      <InfoPanelHeader title="Group info" onBack={onBack} />

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <ProfileHero
          name={groupName} subtitle={`${groupMemberCount} member${groupMemberCount !== 1 ? 's' : ''}`}
          avatar={groupAvatar} color={chat?.avatarColor} initials={chat?.initials} isLocked={isLocked}
          onAvatarClick={() => {}}
        >
          <div className="flex items-center gap-6 mt-5">
            {[
              { icon: Icons.Phone, label: 'Audio', action: () => setActiveCall({ type: 'audio', name: groupName, avatar: groupAvatar }) },
              { icon: Icons.Video, label: 'Video', action: () => setActiveCall({ type: 'video', name: groupName, avatar: groupAvatar }) },
              { icon: Icons.Search, label: 'Search', action: () => dispatch(showToast('Search in chat')) },
            ].map(({ icon: Icon, label, action }) => (
              <button key={label} onClick={action} className="flex flex-col items-center gap-1.5 group">
                <div className="w-12 h-12 rounded-full flex items-center justify-center transition-all group-hover:scale-105 group-active:scale-95 bg-accent">
                  <Icon size={20} color="#fff" />
                </div>
                <span className="text-[11px] font-medium text-text-secondary">{label}</span>
              </button>
            ))}
          </div>
        </ProfileHero>

        <div className="mt-2 px-5 py-4 bg-bg-surface">
          <p className="text-[12px] font-medium mb-1 text-accent">Description</p>
          <p className="text-[15px] text-text-primary">{chat?.description || 'No description'}</p>
        </div>

        {/* Participants */}
        <div className="mt-2 bg-bg-surface">
          <div className="px-5 pt-4 pb-2 flex items-center justify-between">
            <p className="text-[12px] font-medium text-accent">{groupMemberCount} participants</p>
            <button onClick={() => setShowAllMembers(v => !v)} className="text-[13px] text-accent font-medium">
              {showAllMembers ? 'Show less' : 'See all'}
            </button>
          </div>
          {(showAllMembers ? groupMembers : groupMembers.slice(0, 5)).map((member) => {
            const isAdmin = groupAdmins.includes(member.id);
            return (
              <div key={member.id} className="flex items-center gap-3 px-5 py-3 hover:bg-bg-hover transition-colors">
                <Avatar
                  src={member.avatar}
                  name={member.name || 'User'}
                  initials={member.initials}
                  color={member.avatarColor}
                  size={40}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-medium text-text-primary truncate">{member.id === 'me' ? 'You' : member.name}</p>
                  <p className="text-[12px] text-text-secondary truncate">{member.status || member.about || ''}</p>
                </div>
                {isAdmin && <span className="text-[11px] text-accent border border-accent/40 rounded px-2 py-0.5 shrink-0">Admin</span>}
              </div>
            );
          })}
          <button onClick={() => dispatch(showToast('Add participant coming soon'))}
            className="flex items-center gap-3 px-5 py-3 w-full hover:bg-bg-hover transition-colors">
            <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
              <Icons.UserPlus size={18} className="text-accent" />
            </div>
            <p className="text-[15px] font-medium text-accent">Add participant</p>
          </button>
        </div>

        <MediaSection onOpen={onShowMediaLinksDoc} />

        <PrivacySection
          muted={muted} onMuteToggle={handleMuteToggle}
          disappearingDays={disappearingDays} onDisappearingOpen={() => setShowDisappearingModal(true)}
          isLocked={isLocked} onLockOpen={() => setShowLockModal(true)}
          isFavorite={isFavorite} onFavorite={handleFavorite}
        />

        <EncryptionBadge />

        <div className="mt-2 bg-bg-surface">
          <SectionDivider label="Actions" />
          <RowItem icon={Icons.Trash2} iconColor="#ef4444" label="Clear chat"
            value={chatCleared ? 'Chat cleared' : 'Delete all messages'}
            danger onClick={() => setConfirmClear(true)} rightNode={null} />
          <RowItem icon={Icons.LogOut} iconColor="#ef4444" label="Exit group"
            danger onClick={() => dispatch(showToast('Left group'))} rightNode={null} />
          <RowItem icon={Icons.Flag} iconColor="#ef4444" label={`Report ${groupName}`}
            danger onClick={() => dispatch(showToast('Report submitted'))} rightNode={null} />
        </div>

        <div className="h-10" />
      </div>

      {showDisappearingModal && (
        <DisappearingModal
          disappearingDays={disappearingDays}
          onSelect={(v) => { setDisappearingDays(v); setShowDisappearingModal(false); dispatch(showToast(v ? `Disappearing messages: ${v} days` : 'Disappearing messages off')); }}
          onClose={() => setShowDisappearingModal(false)}
        />
      )}

      {showLockModal && (
        <LockChatModal
          isLocked={isLocked} lockPin={lockPin} lockPinConfirm={lockPinConfirm} lockStage={lockStage}
          onPinInput={setLockPin} onPinConfirmInput={setLockPinConfirm}
          onSubmit={handleLockSubmit}
          onRemoveLock={() => { dispatch(lockChat(chat?.id)); setIsLocked(false); setShowLockModal(false); dispatch(showToast('Chat unlocked')); }}
          onClose={closeLockModal}
        />
      )}

      <ConfirmDialog isOpen={confirmClear} title="Clear chat?"
        message="All messages in this chat will be permanently deleted."
        confirmLabel="Clear" confirmColor="red"
        onConfirm={() => { setChatCleared(true); setConfirmClear(false); dispatch(showToast('Chat cleared')); }}
        onCancel={() => setConfirmClear(false)} />
    </>
  );
};

export default GroupInfoPanel;
