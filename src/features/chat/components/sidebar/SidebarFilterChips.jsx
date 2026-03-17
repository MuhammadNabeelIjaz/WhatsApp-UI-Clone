/**
 * SidebarFilterChips
 * Horizontal draggable filter chips (All, Unread, Favourites, Groups…)
 * with an overflow dropdown and a "New list" button on desktop.
 */
import React, { useRef, useEffect } from 'react';
import { Icons } from '@constants/icons';

const SidebarFilterChips = ({
    chips,
    activeFilter,
    onFilterChange,
    unreadCount,
    isDesktop,
    visibleCount,
    // drag handlers
    draggedChipId,
    dragOverChipId,
    onDragStart,
    onDragOver,
    onDrop,
    onDragEnd,
    // list management
    onNewList,
}) => {
    const [isListMenuOpen, setIsListMenuOpen] = React.useState(false);
    const listMenuRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (listMenuRef.current && !listMenuRef.current.contains(e.target))
                setIsListMenuOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const visibleChips = isDesktop ? chips.slice(0, visibleCount) : chips;
    const hiddenChips  = isDesktop ? chips.slice(visibleCount) : [];

    return (
        <div className="px-4 pb-4 relative z-[140]">
            <div className="flex items-center gap-2">
                {/* Chip row */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-1">
                    {visibleChips.map(chip => (
                        <button
                            key={chip.id}
                            draggable
                            onDragStart={e => onDragStart(e, chip.id)}
                            onDragOver={e => onDragOver(e, chip.id)}
                            onDrop={e => onDrop(e, chip.id)}
                            onDragEnd={onDragEnd}
                            onClick={() => onFilterChange(chip.id)}
                            className={[
                                'px-3 py-1.5 rounded-full text-[13px] font-medium transition-all shrink-0 whitespace-nowrap cursor-grab active:cursor-grabbing select-none',
                                draggedChipId === chip.id  ? 'opacity-40 scale-95' : '',
                                dragOverChipId === chip.id ? 'ring-2 ring-accent scale-105' : '',
                                activeFilter === chip.id
                                    ? 'bg-accent-soft text-accent-active shadow-sm'
                                    : 'bg-bg-hover text-text-secondary border border-border-main hover:bg-bg-input',
                            ].join(' ')}
                        >
                            {chip.label}
                            {chip.id === 'unread' && unreadCount > 0 && (
                                <span className="ml-1.5 text-[11px]">{unreadCount}</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Overflow dropdown (desktop only) */}
                {isDesktop && (
                    <div className="relative" ref={listMenuRef}>
                        <button
                            onClick={() => setIsListMenuOpen(v => !v)}
                            className={`w-8 h-8 flex items-center justify-center rounded-full transition-all shrink-0 ${isListMenuOpen ? 'bg-bg-hover text-text-primary' : 'bg-bg-hover text-text-secondary hover:bg-bg-input'}`}
                        >
                            <Icons.ChevronDown
                                size={18}
                                className={`transition-transform duration-200 ${isListMenuOpen ? 'rotate-180' : ''}`}
                            />
                        </button>
                        {isListMenuOpen && (
                            <div className="absolute right-0 mt-2 w-[150px] bg-bg-surface border border-border-main rounded-xl shadow-2xl z-[9999] py-2 animate-zoom-in origin-top-right">
                                {hiddenChips.map(chip => (
                                    <button
                                        key={chip.id}
                                        onClick={() => { onFilterChange(chip.id); setIsListMenuOpen(false); }}
                                        className={`w-full flex items-center justify-between px-4 py-3 text-[14.5px] transition-colors ${activeFilter === chip.id ? 'bg-accent/10 text-accent font-medium' : 'text-text-primary hover:bg-bg-hover'}`}
                                    >
                                        <span>{chip.label}</span>
                                    </button>
                                ))}
                                <div className="h-[1px] bg-border-main/50 my-1 mx-2" />
                                <button
                                    onClick={() => { onNewList(); setIsListMenuOpen(false); }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-[14.5px] text-text-primary hover:bg-bg-hover transition-colors"
                                >
                                    <Icons.Plus size={18} className="text-text-secondary" />
                                    <span>New list</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SidebarFilterChips;
