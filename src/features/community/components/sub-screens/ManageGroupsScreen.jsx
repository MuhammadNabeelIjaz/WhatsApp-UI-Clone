import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFakeLoading } from '@shared/hooks';
import { Icons } from '@constants/icons';
import { addCommunityGroup } from '@core/store/slices/communitySlice';
import { showToast } from '@core/store/slices/uiSlice';
import { NewGroupScreen } from '@features/chat';
import { ManageGroupsSkeleton } from '@shared/ui/display/Skeletons';
// ── Add Existing Groups Modal ─────────────────────────────────────────────
const SAMPLE_EXISTING_GROUPS = [
    { id: 'eg1', name: 'Study Group Alpha',    initials: 'SG', avatarColor: '#7c3aed' },
    { id: 'eg2', name: 'Project Team Beta',    initials: 'PT', avatarColor: '#0891b2' },
    { id: 'eg3', name: 'Lab Partners',         initials: 'LP', avatarColor: '#d97706' },
    { id: 'eg4', name: 'Class Notes Sharing',  initials: 'CN', avatarColor: '#059669' },
    { id: 'eg5', name: 'Final Year Projects',  initials: 'FY', avatarColor: '#dc2626' },
];

const AddExistingModal = ({ community, onClose, onAdd }) => {
    const [selected, setSelected] = useState([]);
    const existingIds = new Set((community.subGroups || []).map(g => g.id));
    const available = SAMPLE_EXISTING_GROUPS.filter(g => !existingIds.has(g.id));

    const toggle = id => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    return (
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-end sm:items-center justify-center" onClick={onClose}>
            <div className="bg-bg-surface rounded-t-2xl sm:rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="px-5 pt-5 pb-3 border-b border-border-main/10 flex items-center justify-between">
                    <div>
                        <p className="text-[17px] font-semibold text-text-primary">Add existing groups</p>
                        <p className="text-[13px] text-text-secondary mt-0.5">Select groups to add</p>
                    </div>
                    {selected.length > 0 && (
                        <span className="text-[13px] text-accent font-semibold">{selected.length} selected</span>
                    )}
                </div>
                <div className="max-h-72 overflow-y-auto custom-scrollbar">
                    {available.length === 0 ? (
                        <p className="px-5 py-8 text-center text-[14px] text-text-secondary">No groups available to add</p>
                    ) : available.map(g => {
                        const isSelected = selected.includes(g.id);
                        return (
                            <div key={g.id} onClick={() => toggle(g.id)}
                                className="flex items-center gap-4 px-5 py-3 hover:bg-bg-hover cursor-pointer transition-colors border-b border-border-main/10 last:border-0">
                                <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-[14px] shrink-0"
                                    style={{ background: g.avatarColor }}>
                                    {g.initials}
                                </div>
                                <span className="flex-1 text-[15px] text-text-primary">{g.name}</span>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isSelected ? 'bg-accent border-accent' : 'border-border-main/50'}`}>
                                    {isSelected && <Icons.Check size={11} className="text-white" strokeWidth={3} />}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="flex border-t border-border-main/10">
                    <button onClick={onClose} className="flex-1 py-4 text-[15px] text-text-secondary hover:bg-bg-hover transition border-r border-border-main/10">
                        Cancel
                    </button>
                    <button
                        onClick={() => selected.length && onAdd(selected)}
                        disabled={!selected.length}
                        className="flex-1 py-4 text-[15px] font-semibold text-accent hover:bg-bg-hover transition disabled:opacity-30"
                    >
                        Add {selected.length > 0 ? `(${selected.length})` : ''}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Main Screen ───────────────────────────────────────────────────────────
const ManageGroupsScreen = ({ community, onBack, onGroupClick }) => {
    const dispatch = useDispatch();
    const [modal, setModal] = useState(null); // 'add' | null
    const [showNewGroup, setShowNewGroup] = useState(false);
    const isLoading = useFakeLoading(370);

    const allSubGroups      = community.subGroups || [];
    const announcementGroup = allSubGroups.find(sg => sg.type === 'announcement' || sg.name === 'Announcements');
    const otherGroups       = allSubGroups.filter(sg => sg !== announcementGroup);
    const total             = allSubGroups.length;

    const handleCreate = (name) => {
        dispatch(addCommunityGroup(community.id, { name }));
        dispatch(showToast(`Group "${name}" created`, 'success'));
        setModal(null);
    };

    const handleAddExisting = (ids) => {
        const added = SAMPLE_EXISTING_GROUPS.filter(g => ids.includes(g.id));
        added.forEach(g => dispatch(addCommunityGroup(community.id, { name: g.name, avatarColor: g.avatarColor })));
        dispatch(showToast(`${added.length} group${added.length > 1 ? 's' : ''} added`, 'success'));
        setModal(null);
    };

    if (isLoading) return <ManageGroupsSkeleton />;

    return (
        <div className="absolute inset-0 bg-bg-surface z-[700] flex flex-col animate-fade-in">
            <header className="flex items-center gap-3 px-3 py-3 shrink-0 border-b border-border-main/10">
                <button onClick={onBack} className="p-2 hover:bg-bg-hover rounded-full text-text-primary transition active:scale-90">
                    <Icons.ArrowLeft size={24} />
                </button>
                <div>
                    <h2 className="text-[18px] font-semibold text-text-primary">Manage groups</h2>
                    <p className="text-[12px] text-text-secondary">{total} of 101</p>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {/* Create new group — navigates to existing NewGroupScreen */}
                <button
                    className="flex items-center gap-4 w-full px-5 py-4 hover:bg-bg-hover transition-colors active:bg-bg-hover/70"
                    onClick={() => setShowNewGroup(true)}
                >
                    <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center shrink-0">
                        <Icons.Users size={22} className="text-white" />
                    </div>
                    <span className="text-[16px] text-text-primary">Create new group</span>
                </button>

                {/* Add existing groups */}
                <button
                    className="flex items-center gap-4 w-full px-5 py-4 hover:bg-bg-hover transition-colors active:bg-bg-hover/70"
                    onClick={() => setModal('add')}
                >
                    <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center shrink-0">
                        <Icons.Plus size={22} className="text-white" />
                    </div>
                    <span className="text-[16px] text-text-primary">Add existing groups</span>
                </button>

                <div className="px-5 pb-4 border-b border-border-main/20">
                    <p className="text-[13px] text-text-secondary leading-relaxed">
                        Members can suggest groups for admin approval. Admins can add groups directly. View in{' '}
                        <span className="text-accent cursor-pointer">Community settings</span>
                    </p>
                </div>

                <p className="px-5 py-3 text-[13px] text-text-secondary">Groups in this community</p>

                {announcementGroup && (
                    <div className="flex items-center gap-4 px-5 py-3 hover:bg-bg-hover cursor-pointer transition-colors"
                        onClick={() => onGroupClick?.(announcementGroup)}>
                        <div className="w-12 h-12 rounded-2xl bg-emerald-800 flex items-center justify-center shrink-0">
                            <Icons.Megaphone size={22} className="text-white" />
                        </div>
                        <span className="text-[16px] text-text-primary">Announcements</span>
                    </div>
                )}

                {otherGroups.map((sub) => (
                    <div key={sub.id}
                        className="flex items-center gap-4 px-5 py-3 hover:bg-bg-hover cursor-pointer transition-colors"
                        onClick={() => onGroupClick?.(sub)}>
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-bg-hover flex items-center justify-center shrink-0">
                            {sub.image
                                ? <img src={sub.image} alt="" className="w-full h-full object-cover" />
                                : <div className="w-full h-full flex items-center justify-center text-[16px] font-bold text-white"
                                    style={{ background: sub.avatarColor || '#e97220' }}>
                                    {sub.name?.slice(0, 2).toUpperCase()}
                                </div>
                            }
                        </div>
                        <div className="flex-1 border-b border-border-main/10 pb-3">
                            <p className="text-[16px] text-text-primary">{sub.name}</p>
                            <p className="text-[12px] text-text-secondary">You</p>
                        </div>
                        <button className="p-1 text-text-secondary hover:text-text-primary" onClick={e => e.stopPropagation()}>
                            <Icons.X size={18} />
                        </button>
                    </div>
                ))}

                <div className="h-10" />
            </div>

            {modal === 'add' && (
                <AddExistingModal community={community} onClose={() => setModal(null)} onAdd={handleAddExisting} />
            )}

            {showNewGroup && (
                <NewGroupScreen
                    onBack={() => setShowNewGroup(false)}
                    onCallGroup={(contacts, groupName) => {
                        handleCreate(groupName || 'New group');
                        setShowNewGroup(false);
                    }}
                />
            )}
        </div>
    );
};

export default ManageGroupsScreen;
