/**
 * skeletons/calls.jsx — Calls-domain skeletons.
 * Covers: call list item, favorites, calls screen,
 *         call info screen, scheduled calls.
 */
import React from 'react';
import { Bone } from './base';

// ─── Calls Screen ─────────────────────────────────────────────────────────────
export const CallItemSkeleton = () => (
  <div className="flex items-center px-4 py-3 gap-3 border-b border-border-main/10">
    <Bone className="w-12 h-12 shrink-0" rounded="rounded-full" />
    <div className="flex-1 space-y-1.5">
      <Bone className="h-[15px] w-[42%]" />
      <div className="flex items-center gap-2">
        <Bone className="w-3.5 h-3.5" rounded="rounded-sm" />
        <Bone className="h-[12px] w-[55%]" />
      </div>
    </div>
    <Bone className="w-9 h-9" rounded="rounded-full" />
  </div>
);

export const FavoriteItemSkeleton = () => (
  <div className="flex flex-col items-center gap-1.5 w-16 shrink-0">
    <Bone className="w-14 h-14" rounded="rounded-full" />
    <Bone className="h-[11px] w-12" />
  </div>
);

export const CallsScreenSkeleton = () => (
  <div className="absolute inset-0 flex flex-col bg-bg-surface z-10">
    {/* Header: title + search + new call */}
    <div className="px-4 py-4 flex items-center h-[64px] shrink-0">
      <Bone className="h-[22px] w-[55px]" rounded="rounded-md" />
      <div className="flex-1" />
      <Bone className="w-8 h-8 mr-1" rounded="rounded-full" />
      <Bone className="w-8 h-8" rounded="rounded-full" />
    </div>
    {/* Search bar */}
    <div className="px-4 pb-3 shrink-0">
      <Bone className="h-[38px] w-full" rounded="rounded-full" />
    </div>
    {/* Favorites row */}
    <div className="px-4 py-3 flex gap-4 overflow-hidden border-b border-border-main/10">
      {Array.from({ length: 5 }, (_, i) => <FavoriteItemSkeleton key={i} />)}
    </div>
    {/* Section label */}
    <div className="px-4 py-2 mt-1"><Bone className="h-[11px] w-[90px]" /></div>
    {/* Call history */}
    {Array.from({ length: 6 }, (_, i) => <CallItemSkeleton key={i} />)}
  </div>
);

// ─── Call Info Screen ─────────────────────────────────────────────────────────
// Mirrors: absolute inset-0, header (back + "Call info" + more-vert),
// profile section (w-24 avatar + name), 3 action buttons (flex-1 rounded-xl border),
// divider, call history section (date label + call entry row with icon + status + time)
export const CallInfoSkeleton = () => (
  <div className="absolute inset-0 bg-bg-surface z-[1000] flex flex-col">
    {/* Header: back + "Call info" title + more-vert */}
    <div className="px-4 py-3 flex items-center justify-between shrink-0 border-b border-border-main/20 h-[56px]">
      <div className="flex items-center gap-3">
        <Bone className="w-8 h-8 shrink-0" rounded="rounded-full" />
        <Bone className="h-[18px] w-[80px]" />
      </div>
      <Bone className="w-8 h-8 shrink-0" rounded="rounded-full" />
    </div>

    {/* Profile: w-24 h-24 avatar (overflow-hidden rounded-full) + name */}
    <div className="flex flex-col items-center pt-8 pb-6 px-4">
      <Bone className="w-24 h-24 mb-4" rounded="rounded-full" />
      <Bone className="h-[22px] w-[150px]" />
    </div>

    {/* 3 Action buttons: Message / Audio / Video — flex-1 rounded-xl border */}
    <div className="flex justify-center gap-4 px-6 mb-6">
      {[{ w: 59 }, { w: 40 }, { w: 38 }].map((btn, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2 py-3 rounded-xl bg-bg-surface border border-border-main/20">
          <Bone className="w-6 h-6" rounded="rounded-md" />
          <Bone className="h-[13px]" style={{ width: `${btn.w}px` }} />
        </div>
      ))}
    </div>

    {/* Divider */}
    <div className="h-px bg-border-main/20" />

    {/* Call history section */}
    <div className="px-4 pt-4">
      {/* Date label */}
      <Bone className="h-[13px] w-[60px] mb-4" />
      {/* Call entry row: icon circle + status/time + duration */}
      <div className="flex items-center gap-3 py-2">
        <Bone className="w-9 h-9 shrink-0" rounded="rounded-full" />
        <div className="flex-1 space-y-1.5">
          <Bone className="h-[15px] w-[45%]" />
          <Bone className="h-[12px] w-[35%]" />
        </div>
        <Bone className="h-[13px] w-[70px]" />
      </div>
    </div>
  </div>
);

// ─── Scheduled Calls Screen ────────────────────────────────────────────────────
// Mirrors: header (back + "Scheduled calls"), empty-state illustration area, CTA button
export const ScheduledCallsSkeleton = () => (
  <div className="absolute inset-0 bg-bg-surface z-[1000] flex flex-col">
    {/* Header */}
    <div className="px-4 py-3 flex items-center gap-3 h-[56px] shrink-0 border-b border-border-main/10">
      <Bone className="w-8 h-8 shrink-0" rounded="rounded-full" />
      <Bone className="h-[18px] w-[140px]" />
    </div>
    {/* Empty state: illustration block + headline + sub */}
    <div className="flex-1 flex flex-col items-center justify-center px-8 pb-20 gap-5">
      <Bone className="w-28 h-28" rounded="rounded-3xl" />
      <div className="space-y-2 flex flex-col items-center">
        <Bone className="h-[20px] w-[150px]" />
        <Bone className="h-[14px] w-[200px]" />
        <Bone className="h-[14px] w-[170px]" />
      </div>
    </div>
    {/* CTA button at bottom */}
    <div className="px-6 pb-8">
      <Bone className="h-[48px] w-full" rounded="rounded-full" />
    </div>
  </div>
);
