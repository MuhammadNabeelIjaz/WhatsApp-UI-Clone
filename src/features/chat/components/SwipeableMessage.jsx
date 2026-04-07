import React from 'react';
import { Icons } from '@constants/icons';
import { motion, useAnimation } from 'framer-motion';
/**
 * WhatsApp Premium Clone - Swipeable Message Wrapper
 * Design: No hardcoded colors. Fully theme-aware.
 * Features: Swipe to reply, Selection mode, Long press context.
 */
const SwipeableMessage = ({
    children,
    id,
    align = 'left',
    isSelected,
    selectionModeActive,
    onToggleSelect,
    onSwipeToReply,
    onContextMenu
}) => {
    const controls = useAnimation();

    const handleDragEnd = (event, info) => {
        const offset = info.offset.x;
        // Swipe threshold (Right swipe for reply)
        if (offset > 45) {
            onSwipeToReply(id);
            if (window.navigator.vibrate) window.navigator.vibrate(40);
        }
        controls.start({ x: 0, transition: { type: "spring", stiffness: 400, damping: 35 } });
    };

    const justifyClass = align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start';

    return (
        <div
            className={`relative w-full py-0.5 transition-colors duration-200 overflow-visible group
                ${isSelected ? 'bg-accent/10' : 'hover:bg-bg-hover/30'}`}
            onClick={(e) => {
                if (selectionModeActive) {
                    e.stopPropagation();
                    onToggleSelect(id);
                }
            }}
            onContextMenu={(e) => {
                e.stopPropagation();
                onContextMenu(e, id);
            }}
        >
            {/* Selection Checkbox (Visible only in selection mode) */}
            {selectionModeActive && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, x: -20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20"
                >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 
                        ${isSelected ? 'bg-accent border-accent' : 'border-text-secondary/50'}`}>
                        {isSelected && <Icons.Check size={14} className="text-bg-main" strokeWidth={4} />}
                    </div>
                </motion.div>
            )}

            {/* Content Container with Dynamic Padding for Selection */}
            <div className={`w-full max-w-[1400px] mx-auto flex ${justifyClass} relative transition-all duration-300 
                ${selectionModeActive ? 'pl-14 pr-4 md:pl-16' : 'px-4 md:px-[6%] lg:px-[8%]'}`}>

                <div className="relative flex items-center max-w-[92%] md:max-w-[80%] lg:max-w-[70%]">

                    {/* Reply Arrow Button (hover) */}
                    {!selectionModeActive && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ opacity: 1, scale: 1 }}
                            className={`absolute opacity-0 group-hover:opacity-100 transition-all duration-150 text-text-secondary z-20 flex items-center justify-center
                                ${align === 'right' ? 'right-full mr-1.5' : 'left-full ml-1.5'}`}
                            style={{ top: '50%', transform: 'translateY(-50%)' }}
                            onClick={(e) => { e.stopPropagation(); onSwipeToReply(id); if (window.navigator.vibrate) window.navigator.vibrate(30); }}
                            title="Reply"
                        >
                            <div className="bg-bg-surface/90 hover:bg-bg-hover border border-border-main/20 p-1.5 rounded-full shadow-md backdrop-blur-sm transition-colors">
                                <Icons.Reply size={14} />
                            </div>
                        </motion.button>
                    )}

                    <motion.div
                        className="relative z-10 w-full"
                        drag={selectionModeActive ? false : "x"}
                        dragConstraints={{ left: 0, right: 70 }}
                        dragElastic={0.2}
                        onDragEnd={handleDragEnd}
                        animate={controls}
                    >
                        {children}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default SwipeableMessage;