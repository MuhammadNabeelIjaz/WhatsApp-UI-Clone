// src/features/chat/components/user-info/InfoPanelModals.jsx
import React from 'react';
import { Icons } from '@constants/icons';
import CenteredModal from '@shared/ui/modals/CenteredModal';
import { DISAPPEARING_OPTIONS } from './InfoPanelShared';

export const DisappearingModal = ({ disappearingDays, onSelect, onClose }) => (
  <CenteredModal onClose={onClose}>
    <div className="px-6 pt-6 pb-4">
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
          <Icons.History size={22} className="text-purple-400" />
        </div>
      </div>
      <p className="text-[17px] font-semibold text-text-primary text-center mb-1">Disappearing messages</p>
      <p className="text-[13px] text-text-secondary text-center">New messages will disappear after the selected time</p>
    </div>
    <div className="h-px bg-border-main/20" />
    {DISAPPEARING_OPTIONS.map(({ label, value }) => (
      <button
        key={label}
        onClick={() => onSelect(value)}
        className={`w-full flex items-center justify-between px-6 py-4 hover:bg-bg-hover transition-colors border-b border-border-main/10 last:border-0 ${disappearingDays === value ? 'text-accent' : 'text-text-primary'}`}
      >
        <span className="text-[15px]">{label}</span>
        {disappearingDays === value && <Icons.Check size={18} className="text-accent" />}
      </button>
    ))}
  </CenteredModal>
);

export const LockChatModal = ({ isLocked, lockPin, lockPinConfirm, lockStage, onPinInput, onPinConfirmInput, onSubmit, onRemoveLock, onClose }) => (
  <CenteredModal onClose={onClose}>
    <div className="px-6 pt-6 pb-4">
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
          <Icons.Lock size={22} className="text-yellow-400" />
        </div>
      </div>
      {isLocked ? (
        <>
          <p className="text-[17px] font-semibold text-text-primary text-center mb-1">Chat is locked</p>
          <p className="text-[13px] text-text-secondary text-center mb-4">This chat is secured with a PIN</p>
          <div className="h-px bg-border-main/20 mb-0" />
          <button onClick={onRemoveLock} className="w-full py-4 text-red-400 font-medium text-[15px] hover:bg-red-500/10 transition-colors border-b border-border-main/10">
            Remove lock
          </button>
          <button onClick={onClose} className="w-full py-4 text-text-secondary text-[15px] hover:bg-bg-hover transition-colors">Cancel</button>
        </>
      ) : (
        <>
          <p className="text-[17px] font-semibold text-text-primary text-center mb-1">
            {lockStage === 'enter' ? 'Set chat PIN' : 'Confirm PIN'}
          </p>
          <p className="text-[13px] text-text-secondary text-center mb-4">
            {lockStage === 'enter' ? 'Enter a 4-6 digit PIN to lock this chat' : 'Re-enter your PIN to confirm'}
          </p>
          <div className="h-px bg-border-main/20 mb-4" />
          <div className="flex justify-center gap-3 mb-4">
            {[0, 1, 2, 3, 4, 5].map(i => (
              <div key={i} className={`w-3 h-3 rounded-full transition-all ${(lockStage === 'enter' ? lockPin : lockPinConfirm).length > i ? 'bg-accent scale-110' : 'bg-border-main/40'}`} />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-1 px-2 pb-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '⌫'].map((k, i) => (
              <button
                key={i}
                disabled={k === ''}
                onClick={() => {
                  if (k === '⌫') {
                    lockStage === 'enter' ? onPinInput(p => p.slice(0, -1)) : onPinConfirmInput(p => p.slice(0, -1));
                  } else if (k !== '') {
                    const val = String(k);
                    if (lockStage === 'enter' && lockPin.length < 6) onPinInput(p => p + val);
                    else if (lockStage === 'confirm' && lockPinConfirm.length < 6) onPinConfirmInput(p => p + val);
                  }
                }}
                className={`h-12 rounded-xl text-[18px] font-semibold transition-all active:scale-90 ${k === '' ? '' : 'hover:bg-bg-hover text-text-primary'} ${k === '⌫' ? 'text-text-secondary text-[20px]' : ''}`}
              >
                {k}
              </button>
            ))}
          </div>
          <div className="h-px bg-border-main/20 mt-2" />
          <div className="flex">
            <button onClick={onClose} className="flex-1 py-4 text-text-secondary text-[15px] hover:bg-bg-hover transition-colors border-r border-border-main/10">
              Cancel
            </button>
            <button onClick={onSubmit} className="flex-1 py-4 font-semibold text-[15px] transition-colors" style={{ color: 'var(--accent)' }}>
              {lockStage === 'enter' ? 'Next' : 'Lock'}
            </button>
          </div>
        </>
      )}
    </div>
  </CenteredModal>
);
