import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFakeLoading } from '@shared/hooks';
import { Icons } from '@constants/icons';
import { selectLists } from '@core/store/slices/uiSlice';
import { setLists, addList, removeList } from '@core/store/slices/uiSlice';
import SectionHeader from '@shared/ui/settings/SectionHeader';
import { NewListScreen } from '@features/chat';
import { ListsSettingsSkeleton } from '@shared/ui/display/Skeletons';

const ListsSettingsScreen = ({ onBack }) => {
    const dispatch  = useDispatch();
    const lists     = useSelector(selectLists);
    const isLoading = useFakeLoading(350);
    const [showModal, setShowModal] = useState(false);
    const [reordering, setReordering] = useState(false);

    // Drag state
    const dragIdx = useRef(null);
    const dragOverIdx = useRef(null);
    const [dragging, setDragging] = useState(null);

    // Drag handlers
    const onDragStart = (e, idx) => {
        dragIdx.current = idx;
        setDragging(lists[idx].id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const onDragEnter = (idx) => {
        if (dragIdx.current === null || dragIdx.current === idx) return;
        const next = [...lists];
        const [moved] = next.splice(dragIdx.current, 1);
        next.splice(idx, 0, moved);
        dragIdx.current = idx;
        dispatch(setLists(next));
    };

    const onDragEnd = () => {
        setDragging(null);
        dragIdx.current = null;
        dragOverIdx.current = null;
    };

    // Touch drag state
    const touchStartY = useRef(null);
    const touchIdx = useRef(null);
    const listRef = useRef(null);

    const onTouchStart = (e, idx) => {
        touchIdx.current = idx;
        touchStartY.current = e.touches[0].clientY;
        setDragging(lists[idx].id);
    };

    const onTouchMove = (e) => {
        if (touchIdx.current === null) return;
        const y = e.touches[0].clientY;
        const container = listRef.current;
        if (!container) return;
        const items = container.querySelectorAll('[data-list-item]');
        let newIdx = touchIdx.current;
        items.forEach((el, i) => {
            const rect = el.getBoundingClientRect();
            if (y > rect.top && y < rect.bottom) newIdx = i;
        });
        if (newIdx !== touchIdx.current) {
            const next = [...lists];
            const [moved] = next.splice(touchIdx.current, 1);
            next.splice(newIdx, 0, moved);
            touchIdx.current = newIdx;
            dispatch(setLists(next));
        }
    };

    const onTouchEnd = () => {
        setDragging(null);
        touchIdx.current = null;
    };

    if (isLoading) return <ListsSettingsSkeleton />;

    return (
        <div className="flex flex-col h-full w-full overflow-hidden bg-bg-surface">
            <header className="px-4 py-3 flex items-center justify-between shrink-0 border-b border-border-main/5 bg-bg-surface">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-bg-hover rounded-full transition-all active:scale-90 text-text-primary">
                        <Icons.ArrowLeft size={24} />
                    </button>
                    <h1 className="text-[20px] font-bold text-text-primary">Lists</h1>
                </div>
                <button
                    onClick={() => setReordering(!reordering)}
                    className={`p-2 rounded-full transition-colors ${reordering ? 'bg-accent/20 text-accent' : 'hover:bg-bg-hover text-text-primary'}`}
                >
                    <Icons.Pencil size={20} />
                </button>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <p className="px-6 py-4 text-center text-[14px] leading-relaxed text-text-secondary opacity-70">
                    {reordering ? 'Drag to reorder your lists.' : 'Use the pencil to reorder how your lists appear in the Chats tab.'}
                </p>

                {/* New list button */}
                <div
                    onClick={() => setShowModal(true)}
                    className="px-4 py-3 flex items-center gap-4 hover:bg-bg-hover cursor-pointer active:bg-bg-hover/70 transition-all group"
                >
                    <div className="w-[44px] h-[44px] rounded-full flex items-center justify-center bg-accent/10 text-accent group-hover:bg-accent/20 transition-colors">
                        <Icons.Plus size={24} />
                    </div>
                    <span className="text-[17px] font-semibold text-text-primary">New list</span>
                </div>

                {/* Lists */}
                <div className="mt-2">
                    <SectionHeader label="Your lists" />
                    <div ref={listRef}>
                        {lists.map((l, idx) => {
                            const isDragged = dragging === l.id;
                            return (
                                <div
                                    key={l.id}
                                    data-list-item
                                    draggable={reordering}
                                    onDragStart={reordering ? (e) => onDragStart(e, idx) : undefined}
                                    onDragEnter={reordering ? () => onDragEnter(idx) : undefined}
                                    onDragEnd={reordering ? onDragEnd : undefined}
                                    onDragOver={reordering ? (e) => e.preventDefault() : undefined}
                                    onTouchStart={reordering ? (e) => onTouchStart(e, idx) : undefined}
                                    onTouchMove={reordering ? onTouchMove : undefined}
                                    onTouchEnd={reordering ? onTouchEnd : undefined}
                                    className={`flex items-center px-5 py-4 group transition-all
                                        ${reordering ? 'cursor-grab active:cursor-grabbing' : 'hover:bg-bg-hover cursor-pointer'}
                                        ${isDragged ? 'opacity-40 bg-accent/5 scale-[0.99]' : ''}
                                    `}
                                    style={{ userSelect: 'none' }}
                                >
                                    {reordering && (
                                        <Icons.GripVertical size={20} className="text-text-secondary opacity-50 mr-4 flex-shrink-0" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[16.5px] text-text-primary">{l.name}</p>
                                        <p className="text-[13px] text-text-secondary opacity-70 truncate">{l.subtitle}</p>
                                    </div>
                                    {!l.preset && !reordering && (
                                        <button
                                            onClick={() => dispatch(removeList(l.id))}
                                            className="p-2 rounded-full hover:bg-red-500/10 text-text-secondary hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Icons.X size={16} />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {reordering && (
                    <div className="mx-5 mt-4 p-3 bg-accent/5 rounded-xl border border-accent/20 flex items-center gap-3">
                        <Icons.Info size={16} className="text-accent shrink-0" />
                        <p className="text-[13px] text-text-secondary">Drag the <span className="text-text-primary font-medium">≡</span> handles to reorder. Tap <span className="text-accent font-medium">✎</span> again to finish.</p>
                    </div>
                )}

                <div className="mt-8 px-5">
                    <SectionHeader label="Available presets" />
                    <p className="py-4 text-center text-[13px] text-text-secondary opacity-60 italic leading-normal">
                        If you remove a preset list like Unread or Groups, it will appear here.
                    </p>
                </div>
                <div className="h-20" />
            </div>

            {/* New List Screen — reuses same component as chat sidebar */}
            <NewListScreen
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                chats={[]}
                onCreateList={(name) => {
                    dispatch(addList(name));
                    setShowModal(false);
                }}
            />
        </div>
    );
};

export default ListsSettingsScreen;
