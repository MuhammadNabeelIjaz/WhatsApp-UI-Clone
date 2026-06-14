import React from 'react';
import { Bone } from './Skeletons';

/**
 * SkeletonChatDetail — Premium chat conversation skeleton.
 * Mirrors real chat UI: header with avatar+name+status+action buttons,
 * alternating incoming/outgoing bubbles with sender labels, date separator,
 * voice/image placeholders, and full input bar.
 * Uses the same shimmer Bone from Skeletons.jsx for visual consistency.
 */

const BUBBLES = [
  { mine: false, w: '52%', h: '44px',  showSender: true },
  { mine: true,  w: '48%', h: '38px',  showSender: false },
  { mine: false, w: '62%', h: '68px',  showSender: false },
  { mine: true,  w: '70%', h: '52px',  showSender: false },
  { mine: false, w: '44%', h: '38px',  showSender: true, isVoice: true },
  { mine: true,  w: '56%', h: '42px',  showSender: false },
  { mine: false, w: '68%', h: '100px', showSender: false, isImage: true },
  { mine: true,  w: '60%', h: '46px',  showSender: false },
  { mine: false, w: '50%', h: '38px',  showSender: true },
];

const SkeletonChatDetail = () => (
  <div className="flex flex-col h-full bg-bg-chat-canvas transition-all duration-300">

    {/* ── Header ── */}
    <div className="px-3 flex items-center gap-2 bg-bg-surface border-b border-border-main/30 shrink-0 h-[59px]">
      <Bone className="w-10 h-10 shrink-0" rounded="rounded-full" />
      <div className="flex-1 space-y-1.5 min-w-0">
        <Bone className="h-[14px] w-[38%]" />
        <Bone className="h-[11px] w-[22%]" />
      </div>
      {/* Action buttons: video, call, search, more */}
      <div className="flex items-center gap-1 shrink-0">
        <Bone className="w-8 h-8 shrink-0" rounded="rounded-full" />
        <Bone className="w-8 h-8 shrink-0" rounded="rounded-full" />
        <Bone className="w-8 h-8 shrink-0" rounded="rounded-full" />
        <Bone className="w-8 h-8 shrink-0" rounded="rounded-full" />
      </div>
    </div>

    {/* ── Message area ── */}
    <div className="flex-1 px-4 py-4 overflow-hidden relative bg-bg-chat-canvas">
      {/* Date separator */}
      <div className="flex items-center justify-center mb-4">
        <Bone className="h-[22px] w-[100px]" rounded="rounded-full" />
      </div>

      <div className="flex flex-col gap-3 max-w-[800px] mx-auto">
        {BUBBLES.map((b, i) => (
          <div key={i} className={`flex flex-col gap-1 ${b.mine ? 'items-end' : 'items-start'}`}>
            {b.showSender && !b.mine && (
              <Bone className="h-[10px] w-[70px] ml-1 mb-0.5" />
            )}
            {b.isVoice ? (
              /* Voice message — pill with waveform hint */
              <div className={`flex items-center gap-2 px-3 py-2 ${b.mine ? 'rounded-xl rounded-tr-none' : 'rounded-xl rounded-tl-none'}`}
                style={{ width: b.w }}>
                <Bone className="w-8 h-8 shrink-0" rounded="rounded-full" />
                <Bone className="flex-1 h-[10px]" rounded="rounded-full" />
                <Bone className="h-[10px] w-[28px]" />
              </div>
            ) : b.isImage ? (
              /* Image message */
              <Bone
                className={`${b.mine ? 'rounded-xl rounded-tr-none' : 'rounded-xl rounded-tl-none'}`}
                style={{ height: b.h, width: b.w }}
              />
            ) : (
              /* Text bubble */
              <Bone
                className={`${b.mine ? 'rounded-xl rounded-tr-none' : 'rounded-xl rounded-tl-none'}`}
                style={{ height: b.h, width: b.w }}
              />
            )}
          </div>
        ))}
      </div>
    </div>

    {/* ── Input area ── */}
    <div className="px-3 py-2 bg-bg-surface border-t border-border-main/30 flex items-center gap-2 shrink-0 h-[62px]">
      <Bone className="w-9 h-9 shrink-0" rounded="rounded-full" />
      <Bone className="flex-1 h-[42px]" rounded="rounded-full" />
      <Bone className="w-9 h-9 shrink-0" rounded="rounded-full" />
    </div>
  </div>
);

export default SkeletonChatDetail;
