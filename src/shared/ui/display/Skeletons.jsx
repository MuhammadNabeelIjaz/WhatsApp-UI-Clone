/**
 * display/Skeletons.jsx — BARREL RE-EXPORT (backward-compatible).
 *
 * All skeleton components have been extracted into domain files under
 * src/shared/ui/skeletons/. This file re-exports everything so that
 * existing imports continue to work without any changes at call sites.
 *
 * New code should import directly from the domain files or from
 * '@/shared/ui/skeletons' via the barrel index.
 */

export * from '../skeletons/base';
export * from '../skeletons/chat';
export * from '../skeletons/calls';
export * from '../skeletons/status';
export * from '../skeletons/community';
export * from '../skeletons/settings';
export * from '../skeletons/channels';
export * from '../skeletons/shared';

// ─── Route-level fallback aliases ────────────────────────────────────────────
export { SettingsScreenSkeleton  as RouteFallbackSettings }    from '../skeletons/settings';
export { StatusScreenSkeleton    as RouteFallbackStatus }      from '../skeletons/status';
export { CallsScreenSkeleton     as RouteFallbackCalls }       from '../skeletons/calls';
export { CommunitiesScreenSkeleton as RouteFallbackCommunities } from '../skeletons/community';
export { ChatDetailSkeleton      as RouteFallbackChatDetail }  from '../skeletons/chat';
