import React, { useState } from 'react';
import { useFakeLoading } from '@shared/hooks';
import { Icons } from '@constants/icons';
import { MediaGallerySkeleton } from '@shared/ui/display/Skeletons';

const TABS = ['Media', 'Links', 'Docs'];

const MEDIA_ITEMS = Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    src: `https://picsum.photos/seed/${i + 10}/300/300`,
    type: 'image',
}));

const LINKS_ITEMS = [
    { id: 1, url: 'https://github.com', title: 'GitHub · Build and ship software', domain: 'github.com', time: 'Today, 3:05 PM' },
    { id: 2, url: 'https://youtube.com', title: 'YouTube - Broadcast Yourself', domain: 'youtube.com', time: 'Yesterday' },
    { id: 3, url: 'https://figma.com', title: 'Figma: The Collaborative Interface Design Tool', domain: 'figma.com', time: '2 Mar' },
    { id: 4, url: 'https://tailwindcss.com', title: 'Tailwind CSS - Rapidly build modern websites', domain: 'tailwindcss.com', time: '1 Mar' },
];

const DOCS_ITEMS = [
    { id: 1, name: 'Project_Plan_2026.pdf', size: '2.4 MB', time: 'Today, 1:12 PM', ext: 'PDF', url: 'https://example.com/Project_Plan_2026.pdf' },
    { id: 2, name: 'WhatsApp_Clone_Handover.docx', size: '128 KB', time: 'Yesterday', ext: 'DOC', url: 'https://example.com/WhatsApp_Clone_Handover.docx' },
    { id: 3, name: 'UI_Mockup_v3.zip', size: '14.2 MB', time: '3 Mar', ext: 'ZIP', url: 'https://example.com/UI_Mockup_v3.zip' },
    { id: 4, name: 'Prototype_Demo.mp4', size: '88.1 MB', time: '2 Mar', ext: 'MP4', url: 'https://example.com/Prototype_Demo.mp4' },
];

const MediaGalleryScreen = ({ chat, onBack }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [lightboxSrc, setLightboxSrc] = useState(null);
    const isLoading = useFakeLoading();

    const TAB_COUNTS = [MEDIA_ITEMS.length, LINKS_ITEMS.length, DOCS_ITEMS.length];

    if (isLoading) return <MediaGallerySkeleton />;

    return (
        <div className="absolute inset-0 z-[1100] flex flex-col animate-fade-in" style={{ backgroundColor: 'var(--bg-surface)' }}>

            {/* Header */}
            <header
                className="px-4 py-3 flex items-center gap-3 shrink-0 border-b"
                style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'rgba(255,255,255,0.06)' }}
            >
                <button
                    onClick={onBack}
                    className="p-2 rounded-full hover:bg-bg-hover transition-all active:scale-90"
                    style={{ color: 'var(--text-secondary)' }}
                >
                    <Icons.ArrowLeft size={22} />
                </button>
                <div>
                    <h2 className="text-[16px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {chat?.name || 'Contact'}
                    </h2>
                    <p className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>
                        {TAB_COUNTS[activeTab]} {TABS[activeTab].toLowerCase()}
                    </p>
                </div>
            </header>

            {/* Tabs */}
            <div
                className="flex border-b shrink-0"
                style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'rgba(255,255,255,0.06)' }}
            >
                {TABS.map((tab, idx) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(idx)}
                        className="flex-1 py-3 text-[13px] font-semibold tracking-wide transition-all relative"
                        style={{ color: activeTab === idx ? 'var(--accent)' : 'var(--text-secondary)' }}
                    >
                        {tab}
                        <span
                            className="ml-1.5 text-[11px] px-1.5 py-0.5 rounded-full"
                            style={{
                                backgroundColor: activeTab === idx ? 'var(--accent)' : 'var(--bg-hover)',
                                color: activeTab === idx ? '#fff' : 'var(--text-secondary)',
                            }}
                        >
                            {TAB_COUNTS[idx]}
                        </span>
                        {activeTab === idx && (
                            <span
                                className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t"
                                style={{ backgroundColor: 'var(--accent)' }}
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">

                {/* Media Grid */}
                {activeTab === 0 && (
                    <div className="grid grid-cols-3 gap-0.5 p-0.5">
                        {MEDIA_ITEMS.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setLightboxSrc(item.src)}
                                className="aspect-square overflow-hidden relative group"
                            >
                                <img
                                    src={item.src}
                                    alt=""
                                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                                />
                            </button>
                        ))}
                    </div>
                )}

                {/* Links List */}
                {activeTab === 1 && (
                    <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                        {LINKS_ITEMS.map(item => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => window.open(item.url, '_blank')}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bg-hover transition-all"
                            >
                                <div
                                    className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: 'var(--bg-hover)' }}
                                >
                                    <Icons.Link2 size={20} style={{ color: 'var(--accent)' }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[14px] font-medium truncate" style={{ color: 'var(--text-primary)' }}>{item.title}</p>
                                    <p className="text-[12px] truncate" style={{ color: 'var(--accent)' }}>{item.domain}</p>
                                    <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{item.time}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* Docs List */}
                {activeTab === 2 && (
                    <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                        {DOCS_ITEMS.map(item => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => window.open(item.url, '_blank')}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-bg-hover transition-all"
                            >
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold text-[11px]"
                                    style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--accent)' }}
                                >
                                    {item.ext}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[14px] font-medium truncate" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
                                    <p className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>{item.size} · {item.time}</p>
                                </div>
                                <Icons.MoreVertical size={18} className="text-text-secondary" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {lightboxSrc && (
                <div
                    className="absolute inset-0 z-[1200] flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(0,0,0,0.92)' }}
                    onClick={() => setLightboxSrc(null)}
                >
                    <button
                        className="absolute top-4 right-4 p-2 rounded-full"
                        style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                        onClick={() => setLightboxSrc(null)}
                    >
                        <Icons.X size={22} color="#fff" />
                    </button>
                    <img
                        src={lightboxSrc}
                        alt="preview"
                        className="max-w-full max-h-full rounded-lg shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
};

export default MediaGalleryScreen;
