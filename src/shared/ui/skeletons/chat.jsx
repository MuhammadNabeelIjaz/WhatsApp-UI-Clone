/**
 * skeletons/chat.jsx — Chat-domain skeletons.
 * Covers: chat list, chat detail, starred/kept messages,
 *         forward picker, contact picker, media panel,
 *         archived view, locked view.
 */
import React from 'react';
import { Bone } from './base';

// ─── Chat List Item ───────────────────────────────────────────────────────────
export const ChatItemSkeleton = () => (
  <div className="flex items-center px-4 py-3 gap-3">
    <div className="relative shrink-0">
      <Bone className="w-[52px] h-[52px]" rounded="rounded-full" />
      <div className="absolute -bottom-0.5 -right-0.5 w-[18px] h-[18px] rounded-full bg-bg-surface opacity-0" />
    </div>
    <div className="flex-1 overflow-hidden space-y-2 min-w-0">
      <div className="flex justify-between items-center gap-2">
        <Bone className="h-[15px] w-[38%]" />
        <div className="flex items-center gap-1.5 shrink-0">
          <Bone className="h-[11px] w-[42px]" />
        </div>
      </div>
      <div className="flex justify-between items-center gap-2">
        <Bone className="h-[13px] w-[58%]" />
        <Bone className="h-[18px] w-[18px] shrink-0" rounded="rounded-full" />
      </div>
    </div>
  </div>
);

export const ChatListSkeleton = ({ count = 9 }) => (
  <div className="flex flex-col h-full bg-bg-surface">
    <div className="px-4 py-4 flex items-center justify-between min-h-[64px] shrink-0">
      <Bone className="h-[22px] w-[62px]" rounded="rounded-md" />
      <div className="flex items-center gap-1">
        <Bone className="w-8 h-8" rounded="rounded-full" />
        <Bone className="w-8 h-8" rounded="rounded-full" />
        <Bone className="w-8 h-8" rounded="rounded-full" />
      </div>
    </div>
    <div className="px-4 pb-3 shrink-0">
      <Bone className="h-[38px] w-full" rounded="rounded-full" />
    </div>
    <div className="px-4 pb-4 flex items-center gap-2 overflow-hidden shrink-0">
      <Bone className="h-[32px] w-[42px]" rounded="rounded-full" />
      <Bone className="h-[32px] w-[64px]" rounded="rounded-full" />
      <Bone className="h-[32px] w-[84px]" rounded="rounded-full" />
      <Bone className="h-[32px] w-[68px]" rounded="rounded-full" />
      <Bone className="h-[32px] w-[32px] shrink-0" rounded="rounded-full" />
    </div>
    <div className="flex flex-col">
      {Array.from({ length: count }, (_, i) => <ChatItemSkeleton key={i} />)}
    </div>
  </div>
);

export const SidebarFilterChipsSkeleton = () => (
  <div className="px-4 pb-4 flex items-center gap-2 overflow-hidden shrink-0">
    <Bone className="h-[32px] w-[42px]" rounded="rounded-full" />
    <Bone className="h-[32px] w-[64px]" rounded="rounded-full" />
    <Bone className="h-[32px] w-[84px]" rounded="rounded-full" />
    <Bone className="h-[32px] w-[68px]" rounded="rounded-full" />
    <Bone className="h-[32px] w-[32px] shrink-0" rounded="rounded-full" />
  </div>
);

// ─── Chat Detail ─────────────────────────────────────────────────────────────
export const ChatDetailHeaderSkeleton = () => (
  <div className="px-4 py-5 flex items-center gap-3 bg-bg-surface border-b border-border-main/10 shrink-0 shadow-md">
    <Bone className="w-8 h-8 shrink-0" rounded="rounded-full" />
    <Bone className="w-10 h-10 shrink-0" rounded="rounded-full" />
    <div className="flex-1 flex flex-col gap-1 min-w-0">
      <Bone className="h-[15px] w-[130px]" />
      <Bone className="h-[11px] w-[44px]" />
    </div>
    <Bone className="w-8 h-8 shrink-0" rounded="rounded-full" />
    <Bone className="w-8 h-8 shrink-0" rounded="rounded-full" />
    <div className="w-px h-6 bg-border-main/20 shrink-0" />
    <Bone className="w-8 h-8 shrink-0" rounded="rounded-full" />
    <Bone className="w-8 h-8 shrink-0" rounded="rounded-full" />
  </div>
);

// ── Message bubble primitives (internal helpers) ──────────────────────────────

const MsgBubble = ({ isMine, width, height, showAvatar = true }) => (
  <div className={`flex items-end gap-2 ${isMine ? 'justify-end' : 'justify-start'} px-3`}>
    {!isMine && showAvatar && <Bone className="w-7 h-7 shrink-0 mb-0.5" rounded="rounded-full" />}
    {!isMine && !showAvatar && <div className="w-7 shrink-0" />}
    <Bone
      className={isMine ? 'rounded-xl rounded-tr-sm' : 'rounded-xl rounded-tl-sm'}
      style={{ height, width }}
    />
  </div>
);

const ReplyBubbleSkeleton = ({ isMine }) => (
  <div className={`flex items-end gap-2 ${isMine ? 'justify-end' : 'justify-start'} px-3`}>
    {!isMine && <Bone className="w-7 h-7 shrink-0 mb-0.5" rounded="rounded-full" />}
    <div className={`flex flex-col rounded-xl overflow-hidden ${isMine ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}
      style={{ width: isMine ? '56%' : '60%', background: 'var(--bg-skeleton)', opacity: 0.9 }}>
      <div className="px-3 pt-2.5 pb-2 border-l-[3px] border-accent/50 bg-black/10 space-y-1">
        <Bone className="h-[10px] w-[70px]" style={{ background: 'var(--bg-hover)' }} />
        <Bone className="h-[12px] w-[80%]" style={{ background: 'var(--bg-hover)' }} />
      </div>
      <div className="px-3 py-2 space-y-1">
        <Bone className="h-[13px] w-[85%]" style={{ background: 'var(--bg-hover)' }} />
        <Bone className="h-[10px] w-[40px]" style={{ alignSelf: 'flex-end', background: 'var(--bg-hover)' }} />
      </div>
    </div>
  </div>
);

const VoiceMsgSkeleton = ({ isMine }) => (
  <div className={`flex items-end gap-2 ${isMine ? 'justify-end' : 'justify-start'} px-3`}>
    {!isMine && <Bone className="w-7 h-7 shrink-0 mb-0.5" rounded="rounded-full" />}
    <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl ${isMine ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}
      style={{ width: isMine ? '58%' : '62%', background: 'var(--bg-skeleton)' }}>
      <Bone className="w-9 h-9 shrink-0" rounded="rounded-full" />
      <div className="flex-1 space-y-1.5">
        <div className="flex items-end gap-[2px] h-[24px]">
          {Array.from({ length: 28 }, (_, i) => (
            <Bone key={i} className="w-[2px]" rounded="rounded-sm"
              style={{ height: `${6 + Math.abs(Math.sin(i * 0.65) * 10) + (i % 3) * 3}px` }} />
          ))}
        </div>
        <Bone className="h-[10px] w-[36px]" />
      </div>
    </div>
  </div>
);

const ImageMsgSkeleton = ({ isMine }) => (
  <div className={`flex items-end gap-2 ${isMine ? 'justify-end' : 'justify-start'} px-3`}>
    {!isMine && <Bone className="w-7 h-7 shrink-0 mb-0.5" rounded="rounded-full" />}
    <div className="flex flex-col gap-0.5" style={{ width: '54%' }}>
      <Bone className={`h-[150px] w-full rounded-xl ${isMine ? 'rounded-tr-sm' : 'rounded-tl-sm'}`} />
      <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} px-1`}>
        <Bone className="h-[10px] w-[40px]" />
      </div>
    </div>
  </div>
);

const DocMsgSkeleton = ({ isMine }) => (
  <div className={`flex items-end gap-2 ${isMine ? 'justify-end' : 'justify-start'} px-3`}>
    {!isMine && <Bone className="w-7 h-7 shrink-0 mb-0.5" rounded="rounded-full" />}
    <div className={`flex items-center gap-3 px-3 py-3 rounded-xl ${isMine ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}
      style={{ width: '60%', background: 'var(--bg-skeleton)' }}>
      <Bone className="w-10 h-10 shrink-0" rounded="rounded-lg" />
      <div className="flex-1 space-y-1.5 min-w-0">
        <Bone className="h-[13px] w-[75%]" />
        <Bone className="h-[10px] w-[50%]" />
      </div>
    </div>
  </div>
);

const DateSepSkeleton = () => (
  <div className="flex justify-center my-3">
    <Bone className="h-[22px] w-[90px]" rounded="rounded-full" />
  </div>
);

const SysMsgSkeleton = () => (
  <div className="flex justify-center px-8 my-1">
    <Bone className="h-[28px] w-[72%]" rounded="rounded-xl" />
  </div>
);

export const ChatDetailSkeleton = () => (
  <div className="flex flex-col h-full bg-bg-surface">
    <ChatDetailHeaderSkeleton />
    <div className="flex-1 py-3 space-y-2.5 overflow-hidden relative">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, var(--text-secondary) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      <DateSepSkeleton />
      <SysMsgSkeleton />
      <MsgBubble isMine={false} width="52%" height="42px" />
      <MsgBubble isMine={false} width="44%" height="36px" showAvatar={false} />
      <MsgBubble isMine={true}  width="48%" height="38px" />
      <ImageMsgSkeleton isMine={false} />
      <MsgBubble isMine={true}  width="62%" height="58px" />
      <ReplyBubbleSkeleton isMine={false} />
      <MsgBubble isMine={true}  width="36%" height="34px" />
      <VoiceMsgSkeleton isMine={false} />
      <MsgBubble isMine={false} width="55%" height="48px" />
      <DocMsgSkeleton isMine={true} />
      <MsgBubble isMine={true}  width="42%" height="36px" />
      <MsgBubble isMine={false} width="60%" height="52px" />
    </div>
    <div className="px-2 py-2 bg-bg-surface flex items-end gap-2 shrink-0 border-t border-border-main/5">
      <div className="flex-1 flex items-end bg-bg-hover rounded-[26px] min-h-[46px] px-1 py-1 gap-1">
        <Bone className="w-9 h-9 shrink-0" rounded="rounded-full" />
        <div className="flex-1 self-center px-1">
          <Bone className="h-[18px] w-[55%]" rounded="rounded-md" />
        </div>
        <Bone className="w-9 h-9 shrink-0" rounded="rounded-full" />
      </div>
      <Bone className="w-[46px] h-[46px] shrink-0" rounded="rounded-full" />
    </div>
  </div>
);

// ─── Starred Messages ─────────────────────────────────────────────────────────
export const StarredMessagesSkeleton = () => (
  <div className="flex flex-col h-full bg-bg-surface">
    <div className="px-4 py-3 flex items-center gap-3 h-[59px] shrink-0">
      <Bone className="w-8 h-8 shrink-0" rounded="rounded-full" />
      <Bone className="h-[20px] w-[80px]" />
      <div className="flex-1" />
      <Bone className="w-8 h-8 shrink-0" rounded="rounded-full" />
      <Bone className="w-8 h-8 shrink-0" rounded="rounded-full" />
    </div>
    <div className="flex-1 px-4 py-3 space-y-3 overflow-hidden">
      {[{ w: '65%', mine: false, h: '54px' }, { w: '50%', mine: true, h: '42px' }, { w: '70%', mine: false, h: '72px' },
        { w: '45%', mine: true, h: '36px' }, { w: '60%', mine: false, h: '54px' }, { w: '55%', mine: true, h: '48px' }].map((b, i) => (
        <div key={i} className={`flex flex-col gap-1 ${b.mine ? 'items-end' : 'items-start'}`}>
          <Bone className="h-[11px] w-[80px] mb-0.5" />
          <Bone className={`${b.mine ? 'rounded-xl rounded-tr-none' : 'rounded-xl rounded-tl-none'}`}
            style={{ height: b.h, width: b.w }} />
        </div>
      ))}
    </div>
  </div>
);

// ─── Forward Picker ───────────────────────────────────────────────────────────
export const ForwardPickerSkeleton = () => (
  <div className="absolute inset-0 bg-bg-surface z-[2000] flex flex-col">
    <header className="px-4 py-4 flex items-center gap-3 bg-bg-surface shrink-0 border-b border-border-main/20 h-[72px]">
      <Bone className="w-9 h-9 shrink-0" rounded="rounded-full" />
      <div className="flex-1 space-y-1.5">
        <Bone className="h-[15px] w-[130px]" />
        <Bone className="h-[12px] w-[80px]" />
      </div>
    </header>
    <div className="px-4 py-3 shrink-0">
      <Bone className="h-10 w-full" rounded="rounded-xl" />
    </div>
    <div className="flex items-center px-4 py-3 gap-3 border-b border-border-main/10">
      <Bone className="w-12 h-12 shrink-0" rounded="rounded-full" />
      <Bone className="h-[14px] w-[90px]" />
    </div>
    <div className="px-4 py-2"><Bone className="h-[11px] w-[80px]" /></div>
    {Array.from({ length: 7 }, (_, i) => (
      <div key={i} className="flex items-center px-4 py-2.5 gap-3">
        <Bone className="w-12 h-12 shrink-0" rounded="rounded-full" />
        <Bone className="h-[14px] w-[40%]" />
      </div>
    ))}
    <div className="mt-auto px-4 py-4 border-t border-border-main/10">
      <Bone className="h-[46px] w-full" rounded="rounded-full" />
    </div>
  </div>
);

// ─── Contact Picker Sheet ─────────────────────────────────────────────────────
export const ContactPickerSkeleton = () => (
  <div className="fixed inset-0 z-[600] flex items-end sm:items-center justify-center bg-black/50">
    <div className="w-full sm:max-w-[480px] bg-bg-surface rounded-t-2xl sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl" style={{ maxHeight: '90vh' }}>
      <div className="flex justify-center pt-2 pb-1 shrink-0">
        <div className="w-10 h-1 rounded-full bg-border-main/30" />
      </div>
      <div className="px-4 py-3 flex items-center gap-3 border-b border-border-main/10 shrink-0">
        <Bone className="w-8 h-8 shrink-0" rounded="rounded-full" />
        <Bone className="h-[17px] w-[120px]" />
      </div>
      <div className="px-4 py-2 shrink-0">
        <Bone className="h-10 w-full" rounded="rounded-xl" />
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="px-4 py-2"><Bone className="h-[11px] w-[24px]" /></div>
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="flex items-center px-4 py-3 gap-3">
            <Bone className="w-11 h-11 shrink-0" rounded="rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Bone className="h-[14px] w-[44%]" />
              <Bone className="h-[12px] w-[30%]" />
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 py-4 shrink-0 border-t border-border-main/10">
        <Bone className="h-[46px] w-full" rounded="rounded-full" />
      </div>
    </div>
  </div>
);

// ─── Media / Links / Docs Panel ───────────────────────────────────────────────
export const MediaLinkDocsSkeleton = () => (
  <div className="flex flex-col h-full w-full bg-bg-surface">
    <div className="px-3 py-3 flex items-center gap-3 shrink-0 bg-bg-surface border-b border-border-main/10 h-[56px]">
      <Bone className="w-9 h-9 shrink-0" rounded="rounded-full" />
      <div className="flex-1 min-w-0 space-y-1.5">
        <Bone className="h-[16px] w-[130px]" />
        <Bone className="h-[11px] w-[90px]" />
      </div>
      <Bone className="w-8 h-8 shrink-0" rounded="rounded-full" />
    </div>
    <div className="flex border-b border-border-main/10 bg-bg-surface shrink-0">
      {['Media', 'Links', 'Docs'].map((_, i) => (
        <div key={i} className="flex-1 py-3 flex justify-center">
          <Bone className="h-[13px] w-[46px]" />
        </div>
      ))}
    </div>
    <div className="flex-1 overflow-hidden">
      <div className="grid grid-cols-3 gap-[2px]">
        {Array.from({ length: 12 }, (_, i) => (
          <Bone key={i} className="aspect-square w-full" rounded="rounded-none" />
        ))}
      </div>
    </div>
  </div>
);

// ─── Kept Messages ────────────────────────────────────────────────────────────
export const KeptMessagesSkeleton = () => (
  <div className="flex flex-col h-full w-full bg-bg-surface">
    <div className="px-3 py-3 flex items-center gap-3 shrink-0 border-b border-border-main/10 h-[59px]">
      <Bone className="w-9 h-9 shrink-0" rounded="rounded-full" />
      <Bone className="h-[18px] flex-1 max-w-[140px]" />
      <div className="flex-1" />
      <Bone className="w-8 h-8 shrink-0" rounded="rounded-full" />
    </div>
    <div className="px-5 py-3 bg-bg-surface border-b border-border-main/10 shrink-0 flex flex-col items-center gap-1">
      <Bone className="h-[12px] w-[85%]" />
      <Bone className="h-[12px] w-[70%]" />
    </div>
    <div className="flex-1 px-4 py-3 space-y-3 overflow-hidden">
      {[{ lines: 3, w: '85%' }, { lines: 2, w: '70%' }, { lines: 4, w: '90%' }].map((card, i) => (
        <div key={i} className="rounded-xl border border-border-main/10 p-4 space-y-2 bg-bg-surface/30">
          <div className="flex items-center gap-2 pb-2 border-b border-border-main/10">
            <Bone className="w-7 h-7 shrink-0" rounded="rounded-full" />
            <Bone className="h-[13px] w-[48%]" />
            <div className="flex-1" />
            <Bone className="h-[11px] w-[50px]" />
          </div>
          {Array.from({ length: card.lines }, (_, li) => (
            <Bone key={li} className="h-[14px]" style={{ width: li === card.lines - 1 ? card.w : '100%' }} />
          ))}
          <div className="pt-1">
            <Bone className="h-[11px] w-[80px]" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Archived View ────────────────────────────────────────────────────────────
export const ArchivedViewSkeleton = () => (
  <div className="flex flex-col h-full bg-bg-surface">
    <div className="bg-bg-surface px-4 py-[18px] flex items-center gap-4 min-h-[64px] shrink-0">
      <Bone className="w-8 h-8 shrink-0" rounded="rounded-full" />
      <Bone className="h-[18px] w-[80px]" />
    </div>
    <div className="px-6 py-3 border-b border-border-main/10 shrink-0">
      <Bone className="h-[11px] w-[75%] mx-auto" rounded="rounded-full" />
    </div>
    <div className="flex-1 overflow-hidden">
      {Array.from({ length: 7 }, (_, i) => <ChatItemSkeleton key={i} />)}
    </div>
  </div>
);

// ─── Locked View ─────────────────────────────────────────────────────────────
export const LockedViewSkeleton = () => (
  <div className="flex flex-col h-full bg-bg-surface">
    <div className="bg-bg-surface px-4 py-[18px] flex items-center gap-6 min-h-[64px] shrink-0">
      <Bone className="w-8 h-8 shrink-0" rounded="rounded-full" />
      <Bone className="h-[18px] w-[120px]" />
    </div>
    <div className="mx-4 my-2 rounded-xl overflow-hidden">
      <div className="p-4 flex gap-4">
        <Bone className="w-5 h-5 shrink-0 mt-0.5" rounded="rounded-full" />
        <div className="flex-1 space-y-1.5">
          <Bone className="h-[14px] w-[65%]" />
          <Bone className="h-[12px] w-[100%] mt-1" />
          <Bone className="h-[12px] w-[80%]" />
          <Bone className="h-[12px] w-[70px]" />
        </div>
      </div>
    </div>
    <div className="flex-1 overflow-hidden mt-2">
      {Array.from({ length: 5 }, (_, i) => <ChatItemSkeleton key={i} />)}
    </div>
    <div className="py-6 flex flex-col items-center gap-2 shrink-0">
      <div className="flex items-center gap-1.5">
        <Bone className="w-3.5 h-3.5 shrink-0" rounded="rounded-full" />
        <Bone className="h-[12px] w-[120px]" />
      </div>
      <Bone className="h-[11px] w-[160px]" />
    </div>
  </div>
);
