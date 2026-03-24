import React, { useState } from 'react';
import { useFakeLoading } from '@shared/hooks';
import { Icons } from '@constants/icons';
import { MediaLinkDocsSkeleton } from '@shared/ui/display/Skeletons';
// Sample media data
const SAMPLE_MEDIA = [
    { id: 'm1', type: 'image', src: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=200', time: '8:58 am' },
    { id: 'm2', type: 'image', src: 'https://images.unsplash.com/photo-1555992336-03a23c7b20ee?w=200', time: 'Yesterday' },
    { id: 'm3', type: 'image', src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200', time: 'Mon' },
    { id: 'm4', type: 'image', src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200', time: 'Sun' },
    { id: 'm5', type: 'video', src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=200', time: 'Sat' },
    { id: 'm6', type: 'image', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', time: 'Fri' },
    { id: 'm7', type: 'image', src: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=200', time: 'Thu' },
    { id: 'm8', type: 'video', src: 'https://images.unsplash.com/photo-1605602853970-2a4a39e2a0bc?w=200', time: 'Wed' },
    { id: 'm9', type: 'image', src: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=200', time: 'Tue' },
];

const SAMPLE_LINKS = [
    { id: 'l1', url: 'https://chat.whatsapp.com/Kcc9TSc0MasG6WtG5spCWi', title: 'WhatsApp Community', preview: 'España 🇪🇸 Product\'s Community Invite', time: '11/03/2026', sender: 'Amz - Admin' },
    { id: 'l2', url: 'https://lms.university.edu', title: 'LMS Portal', preview: 'Learning Management System - Student Login', time: '10/03/2026', sender: 'Arman Adil' },
    { id: 'l3', url: 'https://wa.me/923047662828', title: 'WhatsApp Contact', preview: 'Contact link for España Products owner', time: '09/03/2026', sender: 'Owner' },
    { id: 'l4', url: 'https://meet.google.com/abc-defg-hij', title: 'Google Meet - Online Class', preview: 'Marketing class meeting link - C7', time: '08/03/2026', sender: 'Ali Bukhari' },
];

const SAMPLE_DOCS = [
    { id: 'd1', name: 'AUD-20260310-WA0003.mp3', size: '16 KB', type: 'audio', time: '10/03/2026', icon: Icons.Headphones },
    { id: 'd2', name: 'Project_Proposal_España.pdf', size: '2.4 MB', type: 'pdf', time: '08/03/2026', icon: Icons.FileText },
    { id: 'd3', name: 'Products_Catalogue_2024.docx', size: '1.1 MB', type: 'doc', time: '05/03/2026', icon: Icons.FileText },
    { id: 'd4', name: 'Spain_Products_Sheet.xlsx', size: '340 KB', type: 'excel', time: '01/03/2026', icon: Icons.BarChart2 },
];

const TAB_LABELS = ['Media', 'Links', 'Docs'];

const MediaLinksDocsPanel = ({ chat, mediaCount = 24, onClose }) => {
    const [activeTab, setActiveTab] = useState(0);
    const isLoading = useFakeLoading();

    if (isLoading) return <MediaLinkDocsSkeleton />;

    return (
        <div className="flex flex-col h-full w-full bg-bg-surface select-none">
            {/* Header */}
            <header className="px-3 py-3 flex items-center gap-3 shrink-0 bg-bg-surface border-b border-border-main/10">
                <button onClick={onClose} className="p-2 rounded-full hover:bg-bg-hover active:scale-95 transition-all text-text-primary">
                    <Icons.ArrowLeft size={24} />
                </button>
                <div className="flex-1 min-w-0">
                    <h1 className="text-[17px] font-semibold text-text-primary truncate">{chat?.name || 'España Products'}</h1>
                    <p className="text-[12px] text-text-secondary">{mediaCount} media · {SAMPLE_LINKS.length} links · {SAMPLE_DOCS.length} docs</p>
                </div>
                <button className="p-2 rounded-full hover:bg-bg-hover text-text-primary">
                    <Icons.Search size={22} />
                </button>
            </header>

            {/* Tabs */}
            <div className="flex border-b border-border-main/10 bg-bg-surface">
                {TAB_LABELS.map((label, i) => (
                    <button
                        key={label}
                        onClick={() => setActiveTab(i)}
                        className={`flex-1 py-3 text-[14px] font-semibold transition-colors relative ${
                            activeTab === i ? 'text-accent' : 'text-text-secondary'
                        }`}
                    >
                        {label}
                        {activeTab === i && (
                            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-accent rounded-t-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {/* MEDIA TAB */}
                {activeTab === 0 && (
                    <div>
                        <div className="grid grid-cols-3 gap-[2px]">
                            {SAMPLE_MEDIA.map(item => (
                                <div key={item.id} className="relative aspect-square bg-bg-hover overflow-hidden cursor-pointer group">
                                    <img
                                        src={item.src}
                                        alt=""
                                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                    {item.type === 'video' && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                            <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center">
                                                <Icons.Play size={14} className="text-white ml-0.5" />
                                            </div>
                                        </div>
                                    )}
                                    <div className="absolute bottom-1 right-1 text-[10px] text-white bg-black/40 rounded px-1">{item.time}</div>
                                </div>
                            ))}
                        </div>
                        <p className="text-center text-[13px] text-text-secondary py-4 opacity-70">{mediaCount} media files</p>
                    </div>
                )}

                {/* LINKS TAB */}
                {activeTab === 1 && (
                    <div className="py-2">
                        {SAMPLE_LINKS.map(item => (
                            <div key={item.id} className="flex items-start gap-3 px-4 py-4 border-b border-border-main/10 hover:bg-bg-hover cursor-pointer transition-colors group">
                                {/* URL preview icon */}
                                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                                    <Icons.Link2 size={20} className="text-accent" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[15px] font-semibold text-text-primary truncate group-hover:text-accent transition-colors">{item.title}</p>
                                    <p className="text-[12px] text-text-secondary opacity-70 truncate mt-0.5">{item.preview}</p>
                                    <p className="text-[11px] text-accent truncate mt-1">{item.url}</p>
                                    <p className="text-[11px] text-text-secondary opacity-50 mt-0.5">{item.time} · {item.sender}</p>
                                </div>
                                <Icons.Link2 size={16} className="text-text-secondary shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        ))}
                    </div>
                )}

                {/* DOCS TAB */}
                {activeTab === 2 && (
                    <div className="py-2">
                        {SAMPLE_DOCS.map(item => {
                            const Ic = item.icon || Icons.FileText;
                            const colors = { pdf: '#e74c3c', doc: '#3498db', excel: '#27ae60', audio: '#9b59b6' };
                            const color = colors[item.type] || '#95a5a6';
                            return (
                                <div key={item.id} className="flex items-center gap-4 px-4 py-4 border-b border-border-main/10 hover:bg-bg-hover cursor-pointer transition-colors">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: color + '20' }}>
                                        <Ic size={22} style={{ color }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[15px] text-text-primary font-medium truncate">{item.name}</p>
                                        <p className="text-[12px] text-text-secondary opacity-70 mt-0.5">{item.size} · {item.time}</p>
                                    </div>
                                    <button className="p-2 rounded-full hover:bg-bg-hover text-text-secondary active:scale-90 transition-all">
                                        <Icons.Download size={18} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MediaLinksDocsPanel;
