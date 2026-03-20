import React from 'react';
import { motion } from 'framer-motion';

/**
 * WhatsApp Premium Clone - Reaction Popup
 * Design: Theme-aware colors, no hardcoded hex codes.
 * Features: Staggered animation & backdrop.
 */
const ReactionPopup = ({ isOpen, onReactionSelect, position, onClose }) => {
    const reactions = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

    if (!isOpen) return null;

    // Container animation variants
    const containerVariants = {
        hidden: { opacity: 0, scale: 0.8, y: 10 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                duration: 0.4,
                staggerChildren: 0.05
            }
        },
        exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
    };

    // Individual emoji variants
    const itemVariants = {
        hidden: { scale: 0, opacity: 0 },
        visible: { scale: 1, opacity: 1 }
    };

    return (
        <>
            {/* Backdrop to close when clicking outside */}
            <div className="fixed inset-0 z-[990]" onClick={onClose} />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="absolute z-[1000] bg-bg-hover shadow-2xl rounded-full px-2 py-1 flex items-center gap-0.5 border border-border-main/10 backdrop-blur-xl"
                style={{
                    top: position.y - 65,
                    left: position.x
                }}
            >
                {reactions.map((emoji, index) => (
                    <motion.button
                        key={index}
                        variants={itemVariants}
                        whileHover={{ scale: 1.4, y: -5 }}
                        whileTap={{ scale: 0.8 }}
                        onClick={() => onReactionSelect(emoji)}
                        className="text-[24px] p-1.5 rounded-full transition-all leading-none outline-none"
                    >
                        {emoji}
                    </motion.button>
                ))}

                {/* Plus Button - WhatsApp Style */}
                <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-text-primary bg-bg-surface/50 rounded-full ml-1 transition-colors border border-border-main/5"
                >
                    <span className="text-[20px] font-light">+</span>
                </motion.button>
            </motion.div>
        </>
    );
};

export default ReactionPopup;