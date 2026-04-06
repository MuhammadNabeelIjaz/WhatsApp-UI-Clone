/**
 * skeletons/channels.jsx — Channels-domain skeletons.
 * Covers: channel item, channel info screen, explore channels screen.
 */
import React from 'react';
import { Bone } from './base';

// ─── Channel Item (Status/Channels) ──────────────────────────────────────────
export const ChannelItemSkeleton = () => (
  <div className="flex items-center justify-between px-4 py-3">
    <div className="flex items-center gap-3">
      <Bone className="w-12 h-12 shrink-0" rounded="rounded-full" />
      <div className="space-y-1.5">
        <Bone className="h-[14px] w-[110px]" />
        <Bone className="h-[12px] w-[70px]" />
      </div>
    </div>
    <Bone className="h-[30px] w-[64px]" rounded="rounded-full" />
  </div>
);

// ─── Channel Info Screen ──────────────────────────────────────────────────────
// Mirrors: header (back+title+search+more), hero (avatar+name+followers),
// 4 action buttons (flex-1 rounded-xl border), description, post bubbles
export const ChannelInfoSkeleton = () => (
  <div className="flex flex-col h-full bg-bg-surface">
    {/* Header: back + title + search + more */}
    <div className="px-4 py-3 flex items-center gap-3 h-[59px] shrink-0 border-b border-border-main/10">
      <Bone className="w-8 h-8 shrink-0" rounded="rounded-full" />
      <Bone className="h-[17px] w-[120px]" />
      <div className="flex-1" />
      <Bone className="w-8 h-8 shrink-0" rounded="rounded-full" />
      <Bone className="w-8 h-8 shrink-0" rounded="rounded-full" />
    </div>
    {/* Channel hero: avatar + name + follower count */}
    <div className="flex flex-col items-center px-4 py-6 border-b border-border-main/10 gap-3 bg-bg-surface shrink-0">
      <Bone className="w-20 h-20 shrink-0" rounded="rounded-full" />
      <Bone className="h-[18px] w-[140px]" />
      <Bone className="h-[13px] w-[80px]" />
    </div>
    {/* 4 action buttons: Notify / Search / Share / More — flex-1 rounded-xl border */}
    <div className="flex px-4 py-4 gap-3 border-b border-border-main/10 shrink-0">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="flex flex-col items-center gap-2 flex-1 rounded-xl py-3 border border-border-main/20 bg-bg-surface">
          <Bone className="w-6 h-6" rounded="rounded-md" />
          <Bone className="h-[11px] w-[44px]" />
        </div>
      ))}
    </div>
    {/* Channel description */}
    <div className="px-5 py-4 border-b border-border-main/10 space-y-1.5 shrink-0">
      <Bone className="h-[13px] w-full" />
      <Bone className="h-[13px] w-[80%]" />
    </div>
    {/* Channel post bubbles (incoming only — channel posts are always "incoming") */}
    <div className="flex-1 px-4 py-3 space-y-3 overflow-hidden">
      {[
        { w: '68%', h: '52px' },
        { w: '55%', h: '36px' },
        { w: '72%', h: '68px' },
      ].map((b, i) => (
        <div key={i} className="flex justify-start">
          <Bone className="rounded-xl rounded-tl-none" style={{ height: b.h, width: b.w }} />
        </div>
      ))}
    </div>
  </div>
);

// ─── Explore Channels Screen ──────────────────────────────────────────────────
export const ExploreChannelsSkeleton = () => (
  <div className="absolute inset-0 bg-bg-surface z-[1000] flex flex-col">
    {/* Header */}
    <div className="px-4 py-4 flex items-center gap-3 bg-bg-surface shrink-0 border-b border-border-main h-[64px]">
      <Bone className="w-9 h-9 shrink-0" rounded="rounded-full" />
      <Bone className="h-[18px] w-[140px]" />
      <div className="flex-1" />
      <Bone className="w-8 h-8 shrink-0" rounded="rounded-full" />
    </div>
    {/* Search bar */}
    <div className="px-4 py-3 shrink-0">
      <Bone className="h-[38px] w-full" rounded="rounded-full" />
    </div>
    {/* Category chips */}
    <div className="flex gap-2 px-4 pb-3 overflow-hidden shrink-0">
      {[50, 80, 60, 70, 65].map((w, i) => (
        <Bone key={i} className="h-8 shrink-0" rounded="rounded-full" style={{ width: `${w}px` }} />
      ))}
    </div>
    {/* Channel items */}
    <div className="flex-1 overflow-hidden px-1 py-2">
      {Array.from({ length: 6 }, (_, i) => <ChannelItemSkeleton key={i} />)}
    </div>
  </div>
);
