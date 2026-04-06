/**
 * skeletons/base.jsx — Bone primitive + shimmer CSS injection.
 * All domain skeleton files import Bone from here.
 */
import React from 'react';

// ─── Base shimmer block ───────────────────────────────────────────────────────
// Reusable primitive. All skeletons compose from this.
export const Bone = ({ className = '', rounded = 'rounded', style }) => (
  <div
    className={`skeleton-bone ${rounded} ${className}`}
    style={style}
  />
);

// Inject shimmer keyframe once
if (typeof document !== 'undefined' && !document.getElementById('sk-style')) {
  const s = document.createElement('style');
  s.id = 'sk-style';
  s.textContent = `
    @keyframes sk-shimmer {
      0%   { background-position: -600px 0; }
      100% { background-position: 600px 0; }
    }
    .skeleton-bone {
      background: linear-gradient(
        90deg,
        var(--bg-skeleton, #2a3942) 0%,
        var(--bg-skeleton, #2a3942) 30%,
        color-mix(in srgb, var(--bg-skeleton, #2a3942) 55%, var(--bg-hover, #3a4a52)) 50%,
        var(--bg-skeleton, #2a3942) 70%,
        var(--bg-skeleton, #2a3942) 100%
      );
      background-size: 1200px 100%;
      animation: sk-shimmer 1.6s cubic-bezier(0.4, 0.0, 0.6, 1) infinite;
    }
  `;
  document.head.appendChild(s);
}
