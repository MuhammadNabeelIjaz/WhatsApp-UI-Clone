/**
 * skeletons/settings.jsx — Settings-domain skeletons.
 * Covers: settings row, settings screen, settings sub-screen,
 *         lists settings, choose list sheet, new list screen.
 */
import React from 'react';
import { Bone } from './base';

// ─── Settings Screen ──────────────────────────────────────────────────────────
// Real SettingsRow: px-5 py-4, w-6 icon with mr-6, title 16.5px, subtitle 14px, chevron/toggle right
export const SettingsRowSkeleton = ({ hasSubtitle = true, hasToggle = false }) => (
  <div className="flex items-center px-5 py-4">
    {/* icon w-6, mr-6 matching real left icon spacing */}
    <Bone className="w-6 h-6 shrink-0 mr-6" rounded="rounded-md" />
    <div className="flex-1 min-w-0 space-y-1.5">
      <Bone className="h-[16px] w-[42%]" />
      {hasSubtitle && <Bone className="h-[13px] w-[65%]" />}
    </div>
    {hasToggle
      ? <Bone className="w-11 h-6 shrink-0 ml-4" rounded="rounded-full" />
      : <Bone className="w-[18px] h-[18px] shrink-0 ml-2" rounded="rounded-sm" />
    }
  </div>
);

export const SettingsScreenSkeleton = () => (
  <div className="flex flex-col h-full bg-bg-surface">
    {/* Header: back btn + ml-4 "Settings" title + search icon — matching real */}
    <div className="px-4 py-3 flex items-center shrink-0 border-b border-border-main/5 bg-bg-surface gap-2">
      <Bone className="w-8 h-8 shrink-0" rounded="rounded-full" />
      <Bone className="h-[20px] w-[90px] ml-4" />
      <div className="flex-1" />
      <Bone className="w-8 h-8 shrink-0" rounded="rounded-full" />
    </div>
    {/* Profile card — px-4 py-5, w-16 h-16 avatar, name 19px, phone 14px, about badge, QR + chevron */}
    <div className="flex items-center px-4 py-5 gap-4">
      <Bone className="w-16 h-16 shrink-0" rounded="rounded-full" />
      <div className="flex-1 min-w-0 space-y-2">
        <Bone className="h-[19px] w-[55%]" />
        <Bone className="h-[14px] w-[70%]" />
        {/* Arabic about badge */}
        <Bone className="h-[22px] w-[80%]" rounded="rounded-lg" />
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Bone className="w-8 h-8" rounded="rounded-full" />
        <Bone className="w-5 h-5" rounded="rounded-sm" />
      </div>
    </div>
    {/* 8px divider stripe */}
    <div className="h-[8px] bg-bg-hover/30" />
    {/* Settings rows: Lists, Account, Privacy, Avatar, Chats, Notifications, Storage, Language, Help, Invite */}
    {[
      { w: '30%', sub: '52%' },
      { w: '38%', sub: '65%' },
      { w: '34%', sub: '62%' },
      { w: '28%', sub: '48%' },
      { w: '26%', sub: '55%' },
      { w: '40%', sub: '58%' },
      { w: '48%', sub: '52%' },
      { w: '38%', sub: '28%' },
      { w: '22%', sub: '62%' },
      { w: '44%', sub: null },
    ].map((row, i) => (
      <div key={i} className="flex items-center px-5 py-4">
        <Bone className="w-6 h-6 shrink-0 mr-6" rounded="rounded-md" />
        <div className="flex-1 min-w-0 space-y-1.5">
          <Bone className="h-[16px]" style={{ width: row.w }} />
          {row.sub && <Bone className="h-[13px]" style={{ width: row.sub }} />}
        </div>
        <Bone className="w-[18px] h-[18px] shrink-0 ml-2" rounded="rounded-sm" />
      </div>
    ))}
  </div>
);

// ─── SettingsSubScreen Skeleton (Privacy, Notifications, Chats, Storage, Help, Account) ──
// Real header: px-4 py-3, back btn, ml-4 text-[20px] font-bold title (no separate border height)
// Content: pt-2, mix of section labels + SettingsRows with icons, subtitles, toggles, chevrons
export const SettingsSubScreenSkeleton = ({ rowCount = 8 }) => (
  <div className="flex flex-col h-full w-full bg-bg-surface">
    {/* Header: back btn + ml-4 bold title */}
    <div className="px-4 py-3 flex items-center shrink-0 border-b border-border-main/5 bg-bg-surface">
      <Bone className="w-8 h-8 shrink-0" rounded="rounded-full" />
      <Bone className="h-[20px] w-[130px] ml-4" />
    </div>
    {/* Content rows — section label every ~4 rows, toggles on some rows */}
    <div className="flex-1 overflow-hidden pt-2">
      {/* First section label */}
      <div className="px-5 pt-4 pb-2">
        <Bone className="h-[12px] w-[160px]" />
      </div>
      {Array.from({ length: Math.min(rowCount, 4) }, (_, i) => (
        <SettingsRowSkeleton key={i} hasSubtitle={i % 2 === 0} hasToggle={i === 2} />
      ))}
      {rowCount > 4 && (
        <>
          {/* Thin divider */}
          <div className="h-px w-[90%] mx-auto bg-border-main/5 my-2" />
          {/* Second section label */}
          <div className="px-5 pt-3 pb-2">
            <Bone className="h-[12px] w-[120px]" />
          </div>
          {Array.from({ length: rowCount - 4 }, (_, i) => (
            <SettingsRowSkeleton key={i + 4} hasSubtitle={i % 2 !== 1} hasToggle={i === 1} />
          ))}
        </>
      )}
    </div>
  </div>
);

export const ListsSettingsSkeleton = () => (
  <div className="flex flex-col h-full bg-bg-surface">
    {/* Header: back btn + "Lists" bold title + pencil icon (no border-b, matches real) */}
    <div className="px-4 py-3 flex items-center justify-between shrink-0 border-b border-border-main/5">
      <div className="flex items-center gap-4">
        <Bone className="w-8 h-8 shrink-0" rounded="rounded-full" />
        {/* "Lists" — text-[20px] font-bold */}
        <Bone className="h-[20px] w-[46px]" rounded="rounded-md" />
      </div>
      {/* Pencil icon button (top right) */}
      <Bone className="w-8 h-8 shrink-0" rounded="rounded-full" />
    </div>

    <div className="flex-1 overflow-hidden">
      {/* Centered description paragraph — text-[14px] text-center */}
      <div className="px-6 py-4 flex flex-col items-center gap-1.5">
        <Bone className="h-[13px] w-[85%]" />
        <Bone className="h-[13px] w-[65%]" />
      </div>

      {/* "New list" row: 44px accent circle + Plus, then "New list" label — px-4 py-3 */}
      <div className="px-4 py-3 flex items-center gap-4">
        <Bone className="w-[44px] h-[44px] shrink-0" rounded="rounded-full" />
        <Bone className="h-[17px] w-[72px]" rounded="rounded-md" />
      </div>

      {/* "Your lists" section label — SectionHeader: px-5 pt-4 pb-1 uppercase small */}
      <div className="px-5 pt-4 pb-1">
        <Bone className="h-[11px] w-[72px]" />
      </div>

      {/* List rows: name (16.5px) + subtitle (13px) + faint delete icon on right */}
      {[
        { nameW: '28%', subW: '52%' },
        { nameW: '38%', subW: '60%' },
        { nameW: '32%', subW: '45%' },
        { nameW: '44%', subW: '58%' },
        { nameW: '36%', subW: '50%' },
      ].map((row, i) => (
        <div key={i} className="flex items-center px-5 py-4">
          <div className="flex-1 min-w-0 space-y-1.5">
            <Bone className="h-[16px]" style={{ width: row.nameW }} />
            <Bone className="h-[12px]" style={{ width: row.subW }} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Choose List Sheet ────────────────────────────────────────────────────────
export const ChooseListSkeleton = () => (
  <div className="fixed inset-0 z-[600] flex items-end sm:items-center justify-center bg-black/50">
    <div className="w-full sm:max-w-[480px] bg-bg-surface rounded-t-2xl sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl" style={{ maxHeight: '90vh' }}>
      <div className="flex justify-center pt-2 pb-1 shrink-0">
        <div className="w-10 h-1 rounded-full bg-border-main/30" />
      </div>
      {/* Search */}
      <div className="px-4 py-3 shrink-0">
        <Bone className="h-10 w-full" rounded="rounded-full" />
      </div>
      {/* Title */}
      <div className="flex justify-center py-3 shrink-0">
        <Bone className="h-[22px] w-[110px]" />
      </div>
      {/* + New list */}
      <div className="flex items-center gap-4 px-5 py-4 shrink-0">
        <Bone className="w-10 h-10 shrink-0" rounded="rounded-full" />
        <Bone className="h-[15px] w-[70px]" />
      </div>
      {/* List items */}
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4">
          <Bone className="w-10 h-10 shrink-0" rounded="rounded-lg" />
          <Bone className="h-[15px] flex-1 max-w-[55%]" />
          <div className="flex-1" />
          <Bone className="w-7 h-7 shrink-0" rounded="rounded-full" />
        </div>
      ))}
      {/* Done button */}
      <div className="px-4 pb-8 pt-4 shrink-0">
        <Bone className="h-[52px] w-full" rounded="rounded-full" />
      </div>
    </div>
  </div>
);

// ─── New List Screen ──────────────────────────────────────────────────────────
export const NewListSkeleton = () => (
  <div className="flex flex-col h-full bg-bg-surface">
    <div className="px-4 py-3 flex items-center gap-3 h-[59px] shrink-0 border-b border-border-main/10">
      <Bone className="w-8 h-8 shrink-0" rounded="rounded-full" />
      <Bone className="h-[18px] w-[100px]" />
    </div>
    <div className="px-5 py-4 space-y-4">
      {/* Name input area */}
      <div className="space-y-2">
        <Bone className="h-[12px] w-[80px]" />
        <Bone className="h-[48px] w-full" rounded="rounded-xl" />
      </div>
      <div className="border-t border-border-main/10 pt-4">
        <Bone className="h-[13px] w-[120px] mb-3" />
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="flex items-center gap-3 py-3">
            <Bone className="w-10 h-10 shrink-0" rounded="rounded-full" />
            <Bone className="h-[14px] w-[45%]" />
          </div>
        ))}
      </div>
    </div>
  </div>
);
