/**
 * skeletons/community.jsx — Community-domain skeletons.
 * Covers: community item, communities screen, community info,
 *         add members, manage groups, community detail.
 */
import React from 'react';
import { Bone } from './base';

// ─── Communities Screen ───────────────────────────────────────────────────────
export const CommunityItemSkeleton = () => (
  <div className="border-b border-border-main/10">
    {/* Community header row */}
    <div className="flex items-center p-4 gap-3">
      <div className="relative shrink-0">
        <Bone className="w-[48px] h-[48px]" rounded="rounded-xl" />
        {/* Member count badge */}
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-bg-surface" />
      </div>
      <div className="flex-1 space-y-1.5 min-w-0">
        <div className="flex items-center gap-2">
          <Bone className="h-[15px] w-[44%]" />
          <Bone className="h-[16px] w-[30px]" rounded="rounded-full" />
        </div>
        <Bone className="h-[12px] w-[68%]" />
      </div>
      <Bone className="w-5 h-5 shrink-0" rounded="rounded-full" />
    </div>
    {/* Group sub-rows */}
    {[0, 1].map(i => (
      <div key={i} className="flex items-center p-3 px-4 gap-3">
        <div className="w-[48px] flex justify-center shrink-0">
          <Bone className="w-[40px] h-[40px]" rounded="rounded-lg" />
        </div>
        <div className="flex-1 space-y-1.5 min-w-0">
          <Bone className="h-[14px] w-[48%]" />
          <Bone className="h-[11px] w-[32%]" />
        </div>
      </div>
    ))}
    {/* Add group link */}
    <div className="flex items-center py-3 px-4 pl-[68px] gap-2">
      <Bone className="w-4 h-4 shrink-0" rounded="rounded-full" />
      <Bone className="h-[12px] w-[90px]" />
    </div>
  </div>
);

export const CommunitiesScreenSkeleton = () => (
  <div className="flex flex-col h-full bg-bg-surface">
    {/* Header */}
    <div className="px-5 py-5 flex items-center justify-between shrink-0">
      <Bone className="h-[22px] w-[130px]" rounded="rounded-md" />
      <div className="flex items-center gap-1">
        <Bone className="w-8 h-8" rounded="rounded-full" />
        <Bone className="w-8 h-8" rounded="rounded-full" />
      </div>
    </div>
    {/* Create new community row */}
    <div className="flex items-center p-4 gap-3 border-b border-border-main/10">
      <Bone className="w-[48px] h-[48px] shrink-0" rounded="rounded-xl" />
      <Bone className="h-[14px] w-[165px]" />
    </div>
    {/* Community items */}
    {Array.from({ length: 2 }, (_, i) => <CommunityItemSkeleton key={i} />)}
  </div>
);

// ─── Community Info Screen (collapsing-header community detail) ───────────────
// Mirrors: absolute inset-0, transparent header (back + small avatar + title area),
// Hero block (112px rounded-2xl avatar + name + subtitle), description,
// 3 action buttons grid-cols-3, tabs (Community / Announcements),
// member count label, Add members row, member rows (12px rounded-full + name + role badge),
// settings rows (Edit, Manage groups, Community settings), leave row
export const CommunityInfoSkeleton = () => (
  <div className="absolute inset-0 bg-bg-surface z-[600] flex flex-col overflow-hidden">
    {/* Sticky header: back + (small avatar + name) fade-in area */}
    <div className="flex items-center gap-2 px-2 pt-3 pb-1 shrink-0 h-[52px]">
      <Bone className="w-9 h-9 shrink-0" rounded="rounded-full" />
      <div className="flex items-center gap-2 flex-1 overflow-hidden opacity-0">
        <Bone className="w-8 h-8 shrink-0" rounded="rounded-2xl" />
        <Bone className="h-[14px] w-[120px]" />
      </div>
    </div>

    <div className="flex-1 overflow-y-auto">
      {/* Hero block: 112px rounded-2xl avatar, name, subtitle */}
      <div className="flex flex-col items-center px-5 pt-3 pb-2">
        <Bone className="w-[112px] h-[112px] mb-3" rounded="rounded-2xl" />
        <Bone className="h-[20px] w-[170px] mb-2" />
        <Bone className="h-[13px] w-[110px]" />
      </div>

      {/* Description — centered */}
      <div className="px-5 pb-3 flex flex-col items-center gap-1.5">
        <Bone className="h-[14px] w-[85%]" />
        <Bone className="h-[14px] w-[65%]" />
      </div>

      {/* 3 Action buttons — grid-cols-3, rounded-2xl border */}
      <div className="grid grid-cols-3 gap-2 px-4 pb-4 border-b border-border-main/20">
        {['Invite', 'Add members', 'Add groups'].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2 rounded-2xl border border-border-main/30 bg-bg-surface py-4 px-3">
            <Bone className="w-12 h-12" rounded="rounded-2xl" />
            <Bone className="h-[13px] w-[60px]" />
          </div>
        ))}
      </div>

      {/* Tabs: Community / Announcements */}
      <div className="flex border-b border-border-main/30 bg-bg-surface sticky top-0 z-10">
        {['Community', 'Announcements'].map((_, i) => (
          <div key={i} className="flex-1 py-3 flex justify-center">
            <Bone className="h-[13px] w-[80px]" />
          </div>
        ))}
      </div>

      {/* Member count label */}
      <div className="px-5 py-3">
        <Bone className="h-[12px] w-[130px]" />
      </div>

      {/* Add members row */}
      <div className="flex items-center gap-4 px-5 py-3 border-b border-border-main/10">
        <Bone className="w-12 h-12 shrink-0" rounded="rounded-full" />
        <Bone className="h-[15px] w-[120px]" />
      </div>

      {/* Member rows with optional role badge */}
      {[
        { nameW: '44%', role: true, roleW: '100px' },
        { nameW: '38%', role: true, roleW: '95px' },
        { nameW: '52%', role: false },
        { nameW: '46%', role: false },
        { nameW: '58%', role: false },
      ].map((row, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-3 border-b border-border-main/10">
          <Bone className="w-12 h-12 shrink-0" rounded="rounded-full" />
          <div className="flex-1 min-w-0">
            <Bone className="h-[15px]" style={{ width: row.nameW }} />
          </div>
          {row.role && (
            <Bone className="h-[22px] shrink-0" rounded="rounded" style={{ width: row.roleW }} />
          )}
        </div>
      ))}

      {/* Divider stripe */}
      <div className="h-2 bg-bg-surface border-y border-border-main/20 mt-2" />

      {/* Settings rows: Edit / Manage groups / Community settings */}
      {[{ w: '55%' }, { w: '45%' }, { w: '60%' }].map((row, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-border-main/15">
          <Bone className="w-5 h-5 shrink-0" rounded="rounded-md" />
          <Bone className="h-[15px]" style={{ width: row.w }} />
        </div>
      ))}

      {/* Divider stripe */}
      <div className="h-2 bg-bg-surface border-y border-border-main/20 my-1" />

      {/* Mute + Leave rows */}
      {[{ w: '50%' }, { w: '40%' }].map((row, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-border-main/15">
          <Bone className="w-5 h-5 shrink-0" rounded="rounded-md" />
          <Bone className="h-[15px]" style={{ width: row.w }} />
        </div>
      ))}

      <div className="h-20" />
    </div>
  </div>
);


// ─── Add Community Members ────────────────────────────────────────────────────
// Mirrors: header (back + chip-input flex area + Done btn), search, contact rows
export const AddMembersSkeleton = () => (
  <div className="absolute inset-0 flex flex-col bg-bg-surface z-[700]">
    {/* Header: back + chip input area + Done pill button */}
    <div className="px-4 py-3 flex items-center gap-3 shrink-0 border-b border-border-main/20">
      <Bone className="w-9 h-9 shrink-0" rounded="rounded-full" />
      {/* Chip-input field */}
      <Bone className="flex-1 h-[44px]" rounded="rounded-xl" />
      <Bone className="h-[32px] w-[56px] shrink-0" rounded="rounded-full" />
    </div>
    {/* Search input */}
    <div className="px-4 py-2 shrink-0">
      <Bone className="h-[40px] w-full" rounded="rounded-xl" />
    </div>
    {/* Section label */}
    <div className="px-4 py-2"><Bone className="h-[11px] w-[60px]" /></div>
    {/* Contact rows with check circles */}
    {Array.from({ length: 9 }, (_, i) => (
      <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-border-main/10">
        <Bone className="w-12 h-12 shrink-0" rounded="rounded-full" />
        <div className="flex-1 space-y-1.5">
          <Bone className="h-[15px] w-[45%]" />
          <Bone className="h-[12px] w-[60%]" />
        </div>
        <Bone className="w-5 h-5 shrink-0" rounded="rounded-full" />
      </div>
    ))}
  </div>
);

// ─── Manage Groups ────────────────────────────────────────────────────────────
// Mirrors: header (back + title), two equal action btns, section label, group rows
export const ManageGroupsSkeleton = () => (
  <div className="absolute inset-0 flex flex-col bg-bg-surface z-[700]">
    {/* Header: back + title */}
    <div className="px-4 py-3 flex items-center gap-3 h-[59px] shrink-0 border-b border-border-main/10">
      <Bone className="w-8 h-8 shrink-0" rounded="rounded-full" />
      <Bone className="h-[18px] w-[140px]" />
    </div>
    {/* Two equal action buttons side by side */}
    <div className="flex gap-3 px-4 py-4 shrink-0">
      <Bone className="flex-1 h-[48px]" rounded="rounded-xl" />
      <Bone className="flex-1 h-[48px]" rounded="rounded-xl" />
    </div>
    {/* Section label */}
    <div className="px-4 py-2 shrink-0"><Bone className="h-[11px] w-[80px]" /></div>
    {/* Group rows: rounded-xl avatar + name/member count + more-vert */}
    {Array.from({ length: 5 }, (_, i) => (
      <div key={i} className="flex items-center px-4 py-3 gap-3 border-b border-border-main/10">
        <Bone className="w-[52px] h-[52px] shrink-0" rounded="rounded-xl" />
        <div className="flex-1 space-y-1.5">
          <Bone className="h-[15px] w-[50%]" />
          <Bone className="h-[12px] w-[65%]" />
        </div>
        <Bone className="w-8 h-8 shrink-0" rounded="rounded-full" />
      </div>
    ))}
  </div>
);

// ─── Community Detail Screen ──────────────────────────────────────────────────
export const CommunityDetailSkeleton = () => (
  <div className="flex flex-col h-full bg-bg-surface overflow-hidden">
    {/* Header: back (left) + more-vertical (right) — exactly like real UI */}
    <div className="px-3 py-3 flex items-center justify-between shrink-0 h-[56px]">
      <Bone className="w-9 h-9" rounded="rounded-full" />
      <Bone className="w-9 h-9" rounded="rounded-full" />
    </div>
    {/* Scrollable area */}
    <div className="flex-1 overflow-hidden">
      {/* Community Identity: 60px rounded-xl avatar + name + subtitle */}
      <div className="px-5 py-4 flex items-center gap-4">
        <Bone className="w-[60px] h-[60px] shrink-0" rounded="rounded-xl" />
        <div className="flex flex-col gap-2">
          <Bone className="h-[20px] w-[160px]" />
          <Bone className="h-[13px] w-[100px]" />
        </div>
      </div>
      {/* Description */}
      <div className="px-5 pb-4 space-y-1.5">
        <Bone className="h-[13px] w-full" />
        <Bone className="h-[13px] w-[70%]" />
      </div>
      {/* Announcements section label */}
      <div className="px-6 py-2"><Bone className="h-[11px] w-[110px]" /></div>
      {/* Announcement group row */}
      <div className="flex items-center px-6 py-4 gap-4">
        <Bone className="w-12 h-12 shrink-0" rounded="rounded-full" />
        <div className="flex-1 space-y-1.5">
          <Bone className="h-[15px] w-[44%]" />
          <Bone className="h-[12px] w-[65%]" />
        </div>
      </div>
      {/* Groups section label */}
      <div className="px-6 py-2"><Bone className="h-[11px] w-[80px]" /></div>
      {/* Group rows */}
      {Array.from({ length: 2 }, (_, i) => (
        <div key={i} className="flex items-center px-6 py-4 gap-4">
          <Bone className="w-12 h-12 shrink-0" rounded="rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Bone className="h-[14px] w-[50%]" />
            <Bone className="h-[12px] w-[65%]" />
          </div>
        </div>
      ))}
      {/* Add group dashed button */}
      <div className="mx-5 mt-4">
        <Bone className="h-[56px] w-full" rounded="rounded-xl" />
      </div>
    </div>
  </div>
);

