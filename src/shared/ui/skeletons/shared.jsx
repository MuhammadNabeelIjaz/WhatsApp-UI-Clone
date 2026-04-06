/**
 * skeletons/shared.jsx — Shared/cross-domain skeletons.
 * Covers: profile screen, user info panel, media gallery,
 *         search results, poll card, contact list, group list,
 *         sidebar skeleton.
 */
import React from 'react';
import { Bone } from './base';
import { ChatListSkeleton } from './chat';

// ─── Profile Screen ───────────────────────────────────────────────────────────
// Real: sticky header (back + ml-4 title), avatar section (180px + camera badge),
// Edit Profile text-accent button, then 4 ProfileRow items (icon + label + value)
// ProfileRow: px-6 py-4 flex items-start, icon mt-1 mr-8, border-b div with
// SectionLabel (small caps) + value (16px) + optional description (13px on Name row)
export const ProfileScreenSkeleton = () => (
  <div className="flex flex-col h-full bg-bg-surface">
    {/* Sticky header */}
    <div className="px-4 py-3 flex items-center shrink-0 bg-bg-surface">
      <Bone className="w-8 h-8" rounded="rounded-full" />
      <Bone className="h-[20px] w-[70px] ml-4" />
    </div>
    {/* Scrollable body */}
    <div className="flex-1 overflow-hidden">
      {/* Avatar section */}
      <div className="flex flex-col items-center py-8">
        <div className="relative">
          <Bone className="w-[180px] h-[180px]" rounded="rounded-full" />
          {/* Camera badge — w-12 h-12, bg-accent, border-bg-surface */}
          <div className="absolute bottom-1 right-1 w-12 h-12 rounded-full bg-bg-skeleton border-4 border-bg-surface" />
        </div>
        {/* "Edit Profile" text button */}
        <Bone className="h-[20px] w-[100px] mt-6" rounded="rounded-md" />
      </div>

      {/* ProfileRow: Name — has description text below value */}
      <div className="flex items-start px-6 py-4">
        <Bone className="w-[22px] h-[22px] shrink-0 mt-1 mr-8" rounded="rounded-md" />
        <div className="flex-1 border-b border-border-main/5 pb-4 space-y-1.5">
          <Bone className="h-[11px] w-[36px]" />
          <Bone className="h-[16px] w-[58%]" />
          {/* Description text below Name (real UI shows it) */}
          <Bone className="h-[12px] w-[92%] mt-1" />
          <Bone className="h-[12px] w-[72%]" />
        </div>
      </div>

      {/* ProfileRow: About */}
      <div className="flex items-start px-6 py-4">
        <Bone className="w-[22px] h-[22px] shrink-0 mt-1 mr-8" rounded="rounded-md" />
        <div className="flex-1 border-b border-border-main/5 pb-4 space-y-1.5">
          <Bone className="h-[11px] w-[42px]" />
          <Bone className="h-[16px] w-[78%]" />
        </div>
      </div>

      {/* ProfileRow: Phone */}
      <div className="flex items-start px-6 py-4">
        <Bone className="w-[22px] h-[22px] shrink-0 mt-1 mr-8" rounded="rounded-md" />
        <div className="flex-1 border-b border-border-main/5 pb-4 space-y-1.5">
          <Bone className="h-[11px] w-[44px]" />
          <Bone className="h-[16px] w-[52%]" />
        </div>
      </div>

      {/* ProfileRow: Links */}
      <div className="flex items-start px-6 py-4">
        <Bone className="w-[22px] h-[22px] shrink-0 mt-1 mr-8" rounded="rounded-md" />
        <div className="flex-1 pb-4 space-y-1.5">
          <Bone className="h-[11px] w-[34px]" />
          <Bone className="h-[16px] w-[38%]" />
        </div>
      </div>
    </div>
  </div>
);

// ─── UserInfo Panel (Contact Info) ────────────────────────────────────────────
// Mirrors: absolute inset-0, header (back + "Contact info" + more-vert),
// bg-bg-surface hero (w-28 avatar, name 22px, phone 14px, 3 action btns),
// About section, Media section (grid-cols-3 × 3 thumbs),
// Groups in common rows, Privacy RowItems, encryption row, danger zone rows.
export const UserInfoSkeleton = () => (
  <div className="absolute inset-0 flex flex-col bg-bg-surface overflow-hidden z-[1000]">
    {/* Header — bg-bg-surface, border-b, justify-between */}
    <div className="px-4 py-3 flex items-center justify-between shrink-0 border-b border-border-main bg-bg-surface h-[56px]">
      <div className="flex items-center gap-3">
        <Bone className="w-8 h-8 shrink-0" rounded="rounded-full" />
        <Bone className="h-[17px] w-[100px]" />
      </div>
      <Bone className="w-8 h-8 shrink-0" rounded="rounded-full" />
    </div>

    {/* Scrollable body */}
    <div className="flex-1 overflow-y-auto">

      {/* Profile Hero — bg-bg-surface, pt-8 pb-6, centered */}
      <div className="flex flex-col items-center pt-8 pb-6 px-4 bg-bg-surface">
        {/* Avatar w-28 h-28 with ring */}
        <Bone className="w-[112px] h-[112px] mb-4" rounded="rounded-full" />
        {/* Name — text-[22px] font-bold */}
        <Bone className="h-[20px] w-[160px] mb-2" />
        {/* Phone — text-[14px] */}
        <Bone className="h-[13px] w-[110px]" />
        {/* 3 action buttons: Message / Audio / Video */}
        <div className="flex items-center gap-6 mt-5">
          {[52, 40, 38].map((w, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <Bone className="w-12 h-12" rounded="rounded-full" />
              <Bone className="h-[11px]" style={{ width: `${w}px` }} />
            </div>
          ))}
        </div>
      </div>

      {/* About section — mt-2 px-5 py-4 bg-bg-surface */}
      <div className="mt-2 px-5 py-4 bg-bg-surface">
        <Bone className="h-[11px] w-[40px] mb-2" />
        <Bone className="h-[15px] w-[75%]" />
      </div>

      {/* Media, links and docs — mt-2 bg-bg-surface */}
      <div className="mt-2 bg-bg-surface px-5 pt-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <Bone className="h-[14px] w-[160px]" />
          <div className="flex items-center gap-1">
            <Bone className="h-[12px] w-[55px]" />
            <Bone className="w-4 h-4 shrink-0" rounded="rounded-full" />
          </div>
        </div>
        {/* 3-column media grid */}
        <div className="grid grid-cols-3 gap-1.5">
          {Array.from({ length: 3 }, (_, i) => (
            <Bone key={i} className="aspect-square w-full" rounded="rounded-lg" />
          ))}
        </div>
      </div>

      {/* Groups in common — mt-2 bg-bg-surface */}
      <div className="mt-2 bg-bg-surface">
        <div className="px-5 pt-5 pb-2">
          <Bone className="h-[11px] w-[120px]" />
        </div>
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-3">
            <Bone className="w-11 h-11 shrink-0" rounded="rounded-full" />
            <div className="flex-1 space-y-1.5 border-b border-border-main/10 pb-3">
              <Bone className="h-[15px] w-[55%]" />
              <Bone className="h-[12px] w-[40%]" />
            </div>
          </div>
        ))}
        {/* Create group with... button */}
        <div className="flex items-center gap-4 px-5 py-3.5 border-t border-border-main/10">
          <Bone className="w-11 h-11 shrink-0" rounded="rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Bone className="h-[15px] w-[65%]" />
            <Bone className="h-[12px] w-[50%]" />
          </div>
          <Bone className="w-4 h-4 shrink-0" rounded="rounded-full" />
        </div>
      </div>

      {/* Privacy section — mt-2 bg-bg-surface */}
      <div className="mt-2 bg-bg-surface">
        {/* Section label: "PRIVACY" */}
        <div className="px-5 pt-5 pb-1">
          <Bone className="h-[11px] w-[55px]" />
        </div>
        {/* RowItems: Mute (toggle), Disappearing, Lock chat, Favourite */}
        {[
          { labelW: '45%', valueW: '30%', hasToggle: true },
          { labelW: '55%', valueW: '20%', hasToggle: false },
          { labelW: '40%', valueW: '35%', hasToggle: false },
          { labelW: '52%', valueW: '60%', hasToggle: false },
        ].map((row, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-3.5 border-b border-border-main/10">
            <Bone className="w-9 h-9 shrink-0" rounded="rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Bone className="h-[14px]" style={{ width: row.labelW }} />
              <Bone className="h-[12px]" style={{ width: row.valueW }} />
            </div>
            {row.hasToggle
              ? <Bone className="w-11 h-6 shrink-0" rounded="rounded-full" />
              : <Bone className="w-4 h-4 shrink-0" rounded="rounded-sm" />
            }
          </div>
        ))}
      </div>

      {/* Encryption notice row */}
      <div className="mt-2 px-5 py-4 flex items-start gap-3 bg-bg-surface">
        <Bone className="w-9 h-9 shrink-0" rounded="rounded-full" />
        <div className="space-y-1.5">
          <Bone className="h-[13px] w-[200px]" />
          <Bone className="h-[12px] w-[80px]" />
        </div>
      </div>

      {/* Danger zone — mt-2 bg-bg-surface */}
      <div className="mt-2 bg-bg-surface">
        <div className="px-5 pt-5 pb-1">
          <Bone className="h-[11px] w-[55px]" />
        </div>
        {['Clear chat', 'Block contact', 'Report contact'].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-3.5 border-b border-border-main/10">
            <Bone className="w-9 h-9 shrink-0" rounded="rounded-full" />
            <Bone className="h-[14px] w-[48%]" />
          </div>
        ))}
      </div>

      <div className="h-10" />
    </div>
  </div>
);

// ─── Media Gallery ────────────────────────────────────────────────────────────
export const MediaGridSkeleton = ({ count = 18 }) => (
  <div className="grid grid-cols-3 gap-0.5">
    {Array.from({ length: count }, (_, i) => (
      <Bone key={i} className="aspect-square w-full" rounded="rounded-none" />
    ))}
  </div>
);

export const MediaGallerySkeleton = () => (
  <div className="flex flex-col h-full bg-bg-surface">
    {/* Header: back + contact name + subtitle (item count + type) */}
    <div className="px-4 py-3 flex items-center h-[59px] shrink-0 border-b border-border-main/10 bg-bg-surface">
      <Bone className="w-8 h-8 shrink-0" rounded="rounded-full" />
      <div className="ml-3 space-y-1.5">
        <Bone className="h-[15px] w-[100px]" />
        <Bone className="h-[11px] w-[55px]" />
      </div>
      <div className="flex-1" />
    </div>
    {/* Tab bar: Media / Links / Docs */}
    <div className="flex border-b border-border-main/10 shrink-0">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="flex-1 py-3 flex justify-center">
          <Bone className="h-[13px] w-[50px]" />
        </div>
      ))}
    </div>
    <MediaGridSkeleton />
  </div>
);

// ─── Search Results ───────────────────────────────────────────────────────────
export const SearchResultSkeleton = () => (
  <div className="flex items-center px-4 py-3 gap-3">
    <Bone className="w-10 h-10 shrink-0" rounded="rounded-full" />
    <div className="flex-1 space-y-1.5">
      <Bone className="h-[14px] w-[45%]" />
      <Bone className="h-[12px] w-[70%]" />
    </div>
  </div>
);

export const SearchResultsSkeleton = ({ count = 6 }) => (
  <div>
    <div className="px-4 py-2"><Bone className="h-[11px] w-[80px]" /></div>
    {Array.from({ length: count }, (_, i) => <SearchResultSkeleton key={i} />)}
  </div>
);

// ─── Poll Card ────────────────────────────────────────────────────────────────
export const PollSkeleton = () => (
  <div className="max-w-[280px] rounded-xl p-4 bg-bg-surface space-y-3">
    <Bone className="h-[16px] w-[80%]" />
    {[40, 55, 70].map((pct, i) => (
      <div key={i} className="flex items-center gap-3">
        <Bone className="w-4 h-4 shrink-0" rounded="rounded-full" />
        <div className="flex-1">
          <Bone className="h-[13px]" style={{ width: `${pct}%` }} />
        </div>
      </div>
    ))}
    <Bone className="h-[11px] w-[60px] mt-1" />
  </div>
);

// ─── Contact / Select Contact List ───────────────────────────────────────────
export const ContactItemSkeleton = () => (
  <div className="flex items-center px-4 py-3 gap-3">
    <Bone className="w-11 h-11 shrink-0" rounded="rounded-full" />
    <div className="flex-1 space-y-1.5">
      <Bone className="h-[14px] w-[44%]" />
      <Bone className="h-[12px] w-[30%]" />
    </div>
  </div>
);

export const ContactListSkeleton = ({ count = 8 }) => (
  <div>
    <div className="px-4 py-2"><Bone className="h-[11px] w-[24px]" /></div>
    {Array.from({ length: count }, (_, i) => <ContactItemSkeleton key={i} />)}
  </div>
);

// ─── Group list ───────────────────────────────────────────────────────────────
export const GroupListSkeleton = ({ count = 5 }) => (
  <div>
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="flex items-center px-4 py-3 gap-3">
        <Bone className="w-[52px] h-[52px] shrink-0" rounded="rounded-xl" />
        <div className="flex-1 space-y-1.5">
          <Bone className="h-[14px] w-[50%]" />
          <Bone className="h-[12px] w-[65%]" />
        </div>
      </div>
    ))}
  </div>
);

// ─── Sidebar (right-panel) skeleton ──────────────────────────────────────────
export const SidebarSkeleton = () => (
  <div className="flex flex-col h-full bg-bg-surface">
    <ChatListSkeleton count={9} />
  </div>
);
