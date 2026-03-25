// src/features/chat/components/user-info/BroadcastInfoPanel.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Icons } from '@constants/icons';
import { muteChat, unmuteChat, lockChat, toggleChatFavorite } from '@core/store/slices/chatSlice';
import { showToast } from '@core/store/slices/uiSlice';
import {
  RowItem, SectionDivider, MediaSection, PrivacySection, EncryptionBadge,
  ProfileHero, InfoPanelHeader,
} from './InfoPanelShared';
import { DisappearingModal, LockChatModal } from './InfoPanelModals';
import ConfirmDialog from '@shared/ui/feedback/ConfirmDialog';

const BroadcastInfoPanel = ({ chat, onBack, onShowMediaLinksDoc }) => {
  const dispatch = useDispatch();

  const broadcastName = chat?.name || 'Broadcast';
  const broadcastAvatar = chat?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(broadcastName)}&background=random&size=300`;
  const recipientCount = (chat?.members || []).length || chat?.memberCount || 0;

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

  return (
    <>
      <InfoPanelHeader title="Broadcast info" onBack={onBack} />

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <ProfileHero
          name={broadcastName}
          subtitle={`${recipientCount} recipient${recipientCount !== 1 ? 's' : ''}`}
          avatar={broadcastAvatar} isLocked={isLocked}
          onAvatarClick={() => {}}
        >
          <div className="mt-3 px-4 py-2 bg-accent/10 rounded-full">
            <p className="text-[12px] text-accent font-medium">Broadcast List</p>
          </div>
        </ProfileHero>

        <div className="mt-2 px-5 py-4 bg-bg-surface">
          <p className="text-[12px] font-medium mb-1 text-accent">About</p>
          <p className="text-[15px] text-text-primary">{chat?.description || 'Broadcast list'}</p>
        </div>

        {/* Recipients */}
        {recipientCount > 0 && (
          <div className="mt-2 bg-bg-surface">
            <div className="px-5 pt-4 pb-2">
              <p className="text-[12px] font-medium text-accent">{recipientCount} recipients</p>
            </div>
            {(chat?.members || []).slice(0, 5).map((member, i) => {
              const name = typeof member === 'object' ? member.name : member;
              const avatar = typeof member === 'object' ? member.avatar : null;
              const displayAvatar = avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'U')}&background=555&color=fff&size=80`;
              return (
                <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-bg-hover transition-colors">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                    <img src={displayAvatar} alt={name} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-[15px] font-medium text-text-primary truncate">{name}</p>
                </div>
              );
            })}
            {recipientCount > 5 && (
              <div className="px-5 py-3 text-[13px] text-text-secondary">
                +{recipientCount - 5} more recipients
              </div>
            )}
          </div>
        )}

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
          <RowItem icon={Icons.Flag} iconColor="#ef4444" label={`Report ${broadcastName}`}
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

export default BroadcastInfoPanel;
