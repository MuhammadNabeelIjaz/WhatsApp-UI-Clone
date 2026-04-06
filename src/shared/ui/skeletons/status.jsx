/**
 * skeletons/status.jsx — Status-domain skeletons.
 * Covers: status list item, my-status row, status screen.
 */
import React from 'react';
import { Bone } from './base';

// ─── Status Screen ────────────────────────────────────────────────────────────
export const StatusItemSkeleton = () => (
  <div className="flex items-center px-4 py-3 gap-3">
    <div className="relative shrink-0">
      <Bone className="w-[52px] h-[52px]" rounded="rounded-full" />
      {/* Ring hint */}
      <div className="absolute inset-[-3px] rounded-full border-2 border-bg-skeleton opacity-40" />
    </div>
    <div className="flex-1 space-y-1.5">
      <Bone className="h-[14px] w-[45%]" />
      <Bone className="h-[12px] w-[30%]" />
    </div>
  </div>
);

export const MyStatusSkeleton = () => (
  <div className="flex items-center px-4 py-3 gap-3">
    <div className="relative shrink-0">
      <Bone className="w-[52px] h-[52px]" rounded="rounded-full" />
      <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-bg-skeleton border-2 border-bg-surface" />
    </div>
    <div className="flex-1 space-y-1.5">
      <Bone className="h-[14px] w-[80px]" />
      <Bone className="h-[12px] w-[120px]" />
    </div>
  </div>
);

export const StatusScreenSkeleton = () => (
  <div className="flex flex-col h-full bg-bg-surface">
    {/* Header: title + camera + pencil + menu */}
    <div className="px-4 py-4 flex items-center gap-3 bg-bg-surface h-[64px] shrink-0">
      <Bone className="h-[22px] w-[90px]" rounded="rounded-md" />
      <div className="flex-1" />
      <Bone className="w-8 h-8" rounded="rounded-full" />
      <Bone className="w-8 h-8" rounded="rounded-full" />
      <Bone className="w-8 h-8" rounded="rounded-full" />
    </div>
    {/* Search bar */}
    <div className="px-4 pb-3 shrink-0">
      <Bone className="h-[38px] w-full" rounded="rounded-full" />
    </div>
    <div className="flex-1 overflow-hidden">
      <MyStatusSkeleton />
      <div className="px-5 py-2"><Bone className="h-[11px] w-[120px]" /></div>
      {Array.from({ length: 4 }, (_, i) => <StatusItemSkeleton key={i} />)}
      <div className="px-5 py-2 mt-1"><Bone className="h-[11px] w-[100px]" /></div>
      {Array.from({ length: 3 }, (_, i) => <StatusItemSkeleton key={i + 10} />)}
    </div>
  </div>
);

