// src/features/status/components/ChannelPostList.jsx
// Channel posts display + owner compose box + inline search.

import React, { useState, useMemo } from 'react';
import { Icons } from '@constants/icons';

// ─── Inline search ─────────────────────────────────────────────────────────

export const ChannelSearchBar = ({ posts, onClose }) => {
    const [q, setQ] = useState('');
    const results = useMemo(() =>
        q.trim() ? (posts || []).filter(p => p.text?.toLowerCase().includes(q.toLowerCase())) : [],
        [q, posts]
    );

    return (
        <div className="flex flex-col h-full bg-bg-surface">
            <div className="flex items-center gap-3 px-3 py-2 border-b border-border-main/20 bg-bg-surface shrink-0">
                <div className="flex-1 flex items-center gap-2 bg-bg-hover rounded-full px-4 py-2">
                    <Icons.Search size={16} className="text-text-secondary shrink-0" />
                    <input autoFocus type="text" placeholder="Search in channel…" value={q}
                        onChange={e => setQ(e.target.value)}
                        className="flex-1 bg-transparent text-[14px] text-text-primary outline-none placeholder:text-text-secondary" />
                    {q && <button onClick={() => setQ('')} className="text-text-secondary hover:text-text-primary"><Icons.X size={15} /></button>}
                </div>
                <button onClick={onClose} className="text-accent text-[14px] font-semibold px-1 whitespace-nowrap">Cancel</button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {q.trim() === '' && (
                    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
                        <Icons.Search size={40} className="text-text-secondary/30 mb-3" />
                        <p className="text-[14px] text-text-secondary">Type to search posts in this channel</p>
                    </div>
                )}
                {q.trim() !== '' && results.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
                        <Icons.SearchX size={40} className="text-text-secondary/30 mb-3" />
                        <p className="text-[14px] text-text-secondary">No posts matching "{q}"</p>
                    </div>
                )}
                {results.map((post, i) => (
                    <div key={post.id || i} className="px-5 py-4 border-b border-border-main/10 hover:bg-bg-hover transition-colors">
                        <p className="text-[14px] text-text-primary leading-relaxed">
                            {post.text.split(new RegExp(`(${q})`, 'gi')).map((part, j) =>
                                part.toLowerCase() === q.toLowerCase()
                                    ? <mark key={j} className="bg-accent/20 text-accent rounded px-0.5">{part}</mark>
                                    : part
                            )}
                        </p>
                        {post.time && (
                            <p className="text-[11px] text-text-secondary mt-1">
                                {new Date(post.time).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── Post list ──────────────────────────────────────────────────────────────

const ChannelPostList = ({ posts, isOwner, onPost }) => {
    const [draftPost, setDraftPost] = useState('');

    const handleSend = () => {
        if (!draftPost.trim()) return;
        onPost?.(draftPost.trim());
        setDraftPost('');
    };

    return (
        <div className="px-5 py-4 border-b border-border-main/20">
            {/* Owner compose */}
            {isOwner && (
                <div className="mb-5">
                    <p className="text-[14px] text-text-primary font-medium mb-3">Post to your channel</p>
                    <div className="flex flex-col gap-3">
                        <textarea
                            value={draftPost}
                            onChange={e => setDraftPost(e.target.value)}
                            placeholder="Write an update..."
                            rows={3}
                            className="w-full bg-bg-input rounded-2xl border border-border-main/20 p-4 text-text-primary text-[14px] outline-none resize-none focus:border-accent transition-colors"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!draftPost.trim()}
                            className={`w-full py-3 rounded-full text-[15px] font-semibold transition-all ${draftPost.trim() ? 'bg-accent text-white hover:opacity-90' : 'bg-bg-hover text-text-secondary cursor-not-allowed'}`}
                        >
                            Post
                        </button>
                    </div>
                </div>
            )}

            {/* Post list header */}
            <div className="flex items-center justify-between mb-3">
                <p className="text-[15px] font-semibold text-text-primary">Channel posts</p>
                <span className="text-[12px] text-text-secondary">{posts.length} {posts.length === 1 ? 'post' : 'posts'}</span>
            </div>

            {posts.length === 0 ? (
                <p className="text-[14px] text-text-secondary">
                    No posts yet. {isOwner ? 'Write the first update above.' : 'Follow the channel to see new posts.'}
                </p>
            ) : posts.map(post => (
                <div key={post.id} className="mb-4 rounded-3xl border border-border-main/20 bg-bg-surface p-4 shadow-sm">
                    <p className="text-[14px] text-text-primary leading-relaxed mb-3">{post.text}</p>
                    <p className="text-[11px] text-text-secondary">{new Date(post.time).toLocaleString()}</p>
                </div>
            ))}
        </div>
    );
};

export default ChannelPostList;
