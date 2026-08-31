// src/features/chat/components/user-info/DMInfoPanel.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Icons } from '@constants/icons';
import logger from '@core/utils/logger';
import ConfirmDialog from '@shared/ui/feedback/ConfirmDialog';
import { ImageViewer } from '@shared/ui/display';
import NewContactScreen from '@shared/ui/contact/NewContactScreen';
import {
  RowItem, SectionDivider, MediaSection, PrivacySection, EncryptionBadge,
  ProfileHero, InfoPanelHeader,
} from './InfoPanelShared';
import { DisappearingModal, LockChatModal } from './InfoPanelModals';
import { muteChat, unmuteChat, lockChat, toggleChatFavorite } from '@core/store/slices/chatSlice';
import { blockContactThunk, unblockContactThunk, updateContactThunk } from '@core/store/slices/contactSlice';
import { showToast } from '@core/store/slices/uiSlice';

const ActiveCallScreen = React.lazy(() =>
  import('@features/calls').then(m => ({ default: m.ActiveCallScreen }))
);

const DMInfoPanel = ({ chat, onBack, onStartChat, onShowMedia: _onShowMedia, onShowMediaLinksDoc }) => {
  const dispatch = useDispatch();

  const contactName = chat?.name || 'Unknown';
  const contactAvatar = chat?.avatar || null;
  const phone = chat?.phone || '+1 555-010-0000';
  const about = chat?.about || '~Busyy 🎧';

  const [muted, setMuted] = useState(chat?.isMuted || false);
  const [disappearingDays, setDisappearingDays] = useState(null);
  const [showDisappearingModal, setShowDisappearingModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(chat?.isFavorite || false);
  const [isBlocked, setIsBlocked] = useState(chat?.isBlocked || false);
  const [confirmBlock, setConfirmBlock] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [chatCleared, setChatCleared] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [lockPin, setLockPin] = useState('');
  const [lockStage, setLockStage] = useState('enter');
  const [lockPinConfirm, setLockPinConfirm] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [showAvatarOverlay, setShowAvatarOverlay] = useState(false);
  const [activeCall, setActiveCall] = useState(null);
  const [showEditContact, setShowEditContact] = useState(false);

  const handleMuteToggle = () => {
    if (muted) { dispatch(unmuteChat(chat?.id)); setMuted(false); dispatch(showToast('Notifications unmuted')); }
    else { dispatch(muteChat(chat?.id, 'always')); setMuted(true); dispatch(showToast('Notifications muted')); }
  };

  const handleBlock = () => {
    if (isBlocked) { dispatch(unblockContactThunk(chat?.id)); setIsBlocked(false); dispatch(showToast(`${contactName} unblocked`)); }
    else setConfirmBlock(true);
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
      <InfoPanelHeader
        title="Contact info"
        onBack={onBack}
        onEditContact={() => setShowEditContact(true)}
        onShareContact={() => {
          const text = `Contact: ${contactName}\nPhone: ${phone}`;
          if (navigator.share) navigator.share({ title: contactName, text });
          else { navigator.clipboard.writeText(text); dispatch(showToast('Contact info copied')); }
        }}
      />

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <ProfileHero
          name={contactName} subtitle={phone}
          avatar={contactAvatar} color={chat?.avatarColor} initials={chat?.initials}
          isBlocked={isBlocked} isLocked={isLocked}
          onAvatarClick={() => setShowAvatarOverlay(true)}
        >
          {isBlocked && (
            <div className="mt-4 mx-2 px-4 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-center flex flex-col items-center gap-3">
              <Icons.Ban size={24} className="text-red-400" />
              <p className="text-text-secondary text-[13px] leading-relaxed">Blocked contacts can no longer call you or send you messages.</p>
              <button onClick={() => { dispatch(unblockContactThunk(chat?.id)); setIsBlocked(false); dispatch(showToast(`${contactName} unblocked`)); }}
                className="px-6 py-2 rounded-full border border-accent text-accent font-semibold text-[14px] hover:bg-accent/10 active:scale-95 transition-all">
                Unblock
              </button>
            </div>
          )}
          {!isBlocked && (
            <div className="flex items-center gap-6 mt-5">
              {[
                { icon: Icons.MessageSquare, label: 'Message', action: onStartChat },
                { icon: Icons.Phone, label: 'Audio', action: () => setActiveCall({ type: 'audio', name: contactName, avatar: contactAvatar }) },
                { icon: Icons.Video, label: 'Video', action: () => setActiveCall({ type: 'video', name: contactName, avatar: contactAvatar }) },
              ].map(({ icon: Icon, label, action }) => (
                <button key={label} onClick={action} className="flex flex-col items-center gap-1.5 group">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center transition-all group-hover:scale-105 group-active:scale-95 bg-accent">
                    <Icon size={20} color="#fff" />
                  </div>
                  <span className="text-[11px] font-medium text-text-secondary">{label}</span>
                </button>
              ))}
            </div>
          )}
        </ProfileHero>

        <div className="mt-2 px-5 py-4 bg-bg-surface">
          <p className="text-[12px] font-medium mb-1 text-accent">About</p>
          <p className="text-[15px] text-text-primary">{about}</p>
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
          <RowItem icon={Icons.UserX} iconColor="#ef4444"
            label={isBlocked ? `Unblock ${contactName}` : `Block ${contactName}`}
            danger onClick={handleBlock} rightNode={null} />
          <RowItem icon={Icons.Flag} iconColor="#ef4444" label={`Report ${contactName}`}
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

      <ConfirmDialog isOpen={confirmBlock} title={`Block ${contactName}?`}
        message="Blocked contacts can no longer call you or send you messages."
        confirmLabel="Block" confirmColor="red"
        onConfirm={() => { dispatch(blockContactThunk(chat?.id)); setIsBlocked(true); setConfirmBlock(false); dispatch(showToast(`${contactName} blocked`, 'success')); }}
        onCancel={() => setConfirmBlock(false)} />

      <ConfirmDialog isOpen={confirmClear} title="Clear chat?"
        message="All messages in this chat will be permanently deleted."
        confirmLabel="Clear" confirmColor="red"
        onConfirm={() => { setChatCleared(true); setConfirmClear(false); dispatch(showToast('Chat cleared')); logger.event('DMInfoPanel', 'chat_cleared', { chatId: chat?.id }); }}
        onCancel={() => setConfirmClear(false)} />

      <ImageViewer
        open={showAvatarOverlay} onClose={() => setShowAvatarOverlay(false)}
        src={contactAvatar} name={contactName} subtitle={phone} color={chat?.avatarColor} initials={chat?.initials}
        actions={[{ icon: <Icons.MessageSquare size={26} className="text-white" />, label: 'Message', primary: true, onClick: () => onStartChat?.() }]}
      />

      {showEditContact && (
        <NewContactScreen
          mode="edit"
          initialData={{ firstName: contactName.split(' ')[0] || contactName, lastName: contactName.split(' ').slice(1).join(' ') || '', phone: phone || '', email: chat?.email || '', about: about || '' }}
          onBack={() => setShowEditContact(false)}
          onSave={(data) => {
            if (chat?.id) dispatch(updateContactThunk(chat.id, { name: data.name, phone: data.phone, email: data.email, initials: data.initials }));
            setShowEditContact(false);
            dispatch(showToast('Contact updated'));
            logger.event('DMInfoPanel', 'contact_edited', { name: data.name });
          }}
        />
      )}
    </>
  );
};

export default DMInfoPanel;
