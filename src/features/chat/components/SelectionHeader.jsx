import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '@constants/icons';
import { motion, AnimatePresence } from 'framer-motion';
import logger from '@core/utils/logger';

/**
 * SelectionHeader — Phase 2 Fix: Action Bar Overflow
 * Primary bar: Delete + Forward (always visible)
 * Overflow menu (3-dot): Star, Copy, Pin (single only), Reply (single only)
 */
const SelectionHeader = ({
    selectedCount,
    selectedMessages = [],
    messages: _messages = [],
    onClearSelection,
    onStar,
    onDelete,
    onCopy,
    onForward,
    onPin,
    onReply,
}) => {
    const isSingleSelection = selectedCount === 1;
    const [showOverflow, setShowOverflow] = useState(false);
    const menuRef = useRef(null);

    // Close overflow menu on outside click
    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target))
                setShowOverflow(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleStar = () => {
        logger.event('SelectionHeader', 'star', { count: selectedCount });
        onStar?.(selectedMessages);
        setShowOverflow(false);
    };

    const handleDelete = () => {
        logger.event('SelectionHeader', 'delete', { count: selectedCount });
        onDelete?.(selectedMessages);
    };

    const handleCopy = () => {
        logger.event('SelectionHeader', 'copy', { count: selectedCount });
        onCopy?.(selectedMessages);
        setShowOverflow(false);
    };

    const handleForward = () => {
        logger.event('SelectionHeader', 'forward', { count: selectedCount });
        onForward?.(selectedMessages);
    };

    const handlePin = () => {
        if (isSingleSelection) {
            logger.event('SelectionHeader', 'pin', { id: selectedMessages[0] });
            onPin?.(selectedMessages[0]);
            setShowOverflow(false);
        }
    };

    const handleReply = () => {
        logger.event('SelectionHeader', 'reply');
        onReply?.(selectedMessages[0]);
        onClearSelection?.();
        setShowOverflow(false);
    };

    return (
        <motion.header
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-bg-surface px-4 py-4 flex items-center shadow-lg z-[400] w-full h-[60px] border-b border-border-main/5"
        >
            {/* Left: Back + count */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
                <motion.button
                    whileHover={{ backgroundColor: 'var(--bg-hover)' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                        logger.event('SelectionHeader', 'clear_selection');
                        onClearSelection?.();
                    }}
                    className="p-2 -ml-2 text-text-secondary hover:text-text-primary rounded-full transition-colors shrink-0"
                    title="Clear selection"
                >
                    <Icons.ArrowLeft size={24} strokeWidth={2.5} />
                </motion.button>

                <AnimatePresence mode="popLayout">
                    <motion.span
                        key={selectedCount}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        className="text-text-primary font-medium text-[19px] tracking-wide"
                    >
                        {selectedCount}
                    </motion.span>
                </AnimatePresence>
            </div>

            {/* Right: Primary actions (always visible) + overflow menu */}
            <div className="flex items-center gap-1 text-text-secondary shrink-0">

                {/* PRIMARY: Delete — always visible, most destructive = most important */}
                <IconButton icon={Icons.Trash2} title="Delete" onClick={handleDelete} />

                {/* PRIMARY: Forward — always visible, most common action */}
                <IconButton icon={Icons.Forward} title="Forward" onClick={handleForward} />

                {/* OVERFLOW: 3-dot menu for Star, Copy, Pin, Reply */}
                <div className="relative" ref={menuRef}>
                    <IconButton
                        icon={Icons.MoreVertical}
                        title="More"
                        onClick={() => {
                            logger.event('SelectionHeader', 'more_menu');
                            setShowOverflow(v => !v);
                        }}
                        active={showOverflow}
                    />

                    <AnimatePresence>
                        {showOverflow && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.92, y: -6 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.92, y: -6 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 top-full mt-1 w-44 rounded-xl shadow-2xl z-[9999] overflow-hidden origin-top-right"
                                style={{
                                    backgroundColor: 'var(--bg-surface)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                }}
                            >
                                {/* Star */}
                                <OverflowMenuItem
                                    icon={Icons.Star}
                                    label="Star"
                                    onClick={handleStar}
                                />

                                {/* Copy */}
                                <OverflowMenuItem
                                    icon={Icons.Copy}
                                    label="Copy"
                                    onClick={handleCopy}
                                />

                                {/* Reply — single selection only */}
                                {isSingleSelection && (
                                    <OverflowMenuItem
                                        icon={Icons.Reply}
                                        label="Reply"
                                        onClick={handleReply}
                                    />
                                )}

                                {/* Pin — single selection only */}
                                {isSingleSelection && (
                                    <OverflowMenuItem
                                        icon={Icons.Pin}
                                        label="Pin message"
                                        onClick={handlePin}
                                    />
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.header>
    );
};

const IconButton = ({ icon: Icon, title, onClick, active }) => (
    <motion.button
        whileHover={{ scale: 1.05, backgroundColor: 'var(--bg-hover)' }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        title={title}
        className={`p-2.5 rounded-full transition-colors flex items-center justify-center group relative
            ${active ? 'bg-bg-hover text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
    >
        <Icon size={20} strokeWidth={2.2} className="transition-transform group-hover:scale-110" />
    </motion.button>
);

const OverflowMenuItem = ({ icon: Icon, label, onClick }) => (
    <button
        onClick={onClick}
        className="w-full flex items-center gap-3 px-4 py-3 text-[14px] text-text-primary hover:bg-bg-hover transition-colors text-left"
    >
        <Icon size={17} className="text-text-secondary shrink-0" strokeWidth={2} />
        <span>{label}</span>
    </button>
);

export default SelectionHeader;
