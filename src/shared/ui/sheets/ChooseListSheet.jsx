import React, { useState } from 'react';
import { useFakeLoading } from '@shared/hooks';
import { Icons } from '@constants/icons';
import { motion } from 'framer-motion';
import { ChooseListSkeleton } from '@shared/ui/display/Skeletons';

/**
 * ChooseListSheet — bottom sheet for selecting a label list.
 * Fully theme-aware via CSS vars (bg-bg-surface, text-text-primary, accent, etc.)
 * Works in both dark and light mode automatically.
 */

const DEFAULT_LISTS = [
    { id: 'favorites',       label: 'Favorites',       type: 'heart' },
    { id: 'new_customer',    label: 'New customer',    type: 'label' },
    { id: 'new_order',       label: 'New order',       type: 'label' },
    { id: 'pending_payment', label: 'Pending payment', type: 'label' },
    { id: 'paid',            label: 'Paid',            type: 'label' },
    { id: 'order_complete',  label: 'Order complete',  type: 'label' },
    { id: 'important',       label: 'Important',       type: 'label' },
    { id: 'follow_up',       label: 'Follow up',       type: 'label' },
    { id: 'lead',            label: 'Lead',            type: 'label' },
];

const ListIcon = ({ type }) => (
    <div className="w-9 h-9 rounded-lg bg-bg-hover flex items-center justify-center shrink-0">
        {type === 'heart'
            ? <Icons.Heart size={18} className="text-text-secondary" strokeWidth={1.5} />
            : <Icons.Tag   size={17} className="text-text-secondary" strokeWidth={1.5} />
        }
    </div>
);

const ChooseListSheet = ({
    lists = DEFAULT_LISTS,
    selected: initialSelected = ['favorites'],
    onToggle,
    onNewList,
    onDone,
    onClose,
}) => {
    const [selected, setSelected] = useState(new Set(initialSelected));
    const isLoading = useFakeLoading(320);

    const toggle = (id) => {
        setSelected(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
        onToggle?.(id);
    };

    const handleDone = () => {
        onDone?.([...selected]);
        onClose?.();
    };

    if (isLoading) return <ChooseListSkeleton />;

    return (
        <div
            className="fixed inset-0 z-[700] flex items-end justify-center bg-black/60"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 32, stiffness: 320 }}
                className="w-full sm:max-w-[480px] flex flex-col rounded-t-3xl overflow-hidden shadow-2xl bg-bg-surface"
                style={{ maxHeight: '85vh' }}
                onClick={e => e.stopPropagation()}
            >
                {/* Drag handle */}
                <div className="flex justify-center pt-3 pb-1 shrink-0">
                    <div className="w-10 h-1 rounded-full bg-border-main/40" />
                </div>

                {/* Title */}
                <h2 className="text-center text-[17px] font-bold text-text-primary pt-3 pb-4 shrink-0">
                    Choose list
                </h2>

                {/* Scrollable list */}
                <div className="flex-1 overflow-y-auto px-2 pb-2 custom-scrollbar">

                    {/* New list */}
                    <button
                        onClick={onNewList}
                        className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-bg-hover active:bg-bg-hover transition-colors"
                    >
                        <div className="w-9 h-9 flex items-center justify-center shrink-0">
                            <Icons.Plus size={22} className="text-accent" strokeWidth={2.5} />
                        </div>
                        <span className="text-[15px] font-medium text-accent">New list</span>
                    </button>

                    {/* List items */}
                    {lists.map((item) => {
                        const isSelected = selected.has(item.id);
                        return (
                            <button
                                key={item.id}
                                onClick={() => toggle(item.id)}
                                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-bg-hover active:bg-bg-hover transition-colors"
                            >
                                <ListIcon type={item.type} />
                                <span className="flex-1 text-left text-[15px] text-text-primary font-normal">
                                    {item.label}
                                </span>
                                {isSelected ? (
                                    <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center shrink-0">
                                        <Icons.Check size={14} className="text-white" strokeWidth={3} />
                                    </div>
                                ) : (
                                    <div className="w-6 h-6 rounded-full border-2 border-border-main shrink-0" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Fixed Done button */}
                <div className="px-4 py-4 bg-bg-surface shrink-0">
                    <button
                        onClick={handleDone}
                        className="w-full py-4 rounded-full bg-accent text-white text-[16px] font-semibold hover:opacity-90 active:opacity-80 transition-opacity"
                    >
                        Done
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default ChooseListSheet;
