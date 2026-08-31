import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Icons } from '@constants/icons';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * WhatsApp Premium Clone - Chat Input Bar with Voice Recording UI
 */
const ChatInputBar = ({ onAttachToggle, onSendMessage, replyingTo, onCancelReply, enterSend = false }) => {
    const [message, setMessage] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [recordSeconds, setRecordSeconds] = useState(0);
    const [waveformBars, setWaveformBars] = useState(Array(40).fill(0.15));
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const textareaRef = useRef(null);
    const timerRef = useRef(null);

    // Auto-expand textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [message]);

    // Timer + waveform animation while recording
    useEffect(() => {
        if (isRecording && !isPaused) {
            timerRef.current = setInterval(() => {
                setRecordSeconds(s => s + 1);
                // Animate waveform: scroll bars left, push new random bar
                setWaveformBars(prev => {
                    const next = [...prev.slice(1)];
                    next.push(0.2 + Math.random() * 0.8);
                    return next;
                });
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isRecording, isPaused]);

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${String(m).padStart(1, '0')}:${String(s).padStart(2, '0')}`;
    };

    const startRecording = useCallback(() => {
        setIsRecording(true);
        setIsPaused(false);
        setRecordSeconds(0);
        setWaveformBars(Array(40).fill(0.15));
    }, []);

    const EMOJI_LIST = ['😀','😂','😍','🥰','😎','🤔','😢','😡','👍','👎','❤️','🔥','🎉','🙏','😊','😘','🤣','😭','😅','😏','🥳','😇','🤩','😴','🤗','👋','✌️','🤙','💪','🫶','🌟','💯','🎯','🚀','💬','👀','💀','🤦','🙄','😤'];

    const insertEmoji = useCallback((emoji) => {
        const ta = textareaRef.current;
        if (!ta) return;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const newVal = message.slice(0, start) + emoji + message.slice(end);
        setMessage(newVal);
        setTimeout(() => {
            ta.selectionStart = ta.selectionEnd = start + emoji.length;
            ta.focus();
        }, 0);
    }, [message]);

    const stopRecording = useCallback((send = false) => {
        setIsRecording(false);
        setIsPaused(false);
        clearInterval(timerRef.current);
        if (send && recordSeconds > 0) {
            onSendMessage?.({ type: 'voice', duration: formatTime(recordSeconds) });
        }
        setRecordSeconds(0);
        setWaveformBars(Array(40).fill(0.15));
    }, [recordSeconds, onSendMessage]);

    const togglePause = useCallback(() => {
        setIsPaused(p => !p);
    }, []);

    // Recording UI
    if (isRecording) {
        return (
            <div className="px-3 py-3 bg-bg-mini-sidebar flex items-center gap-3 min-h-[62px] relative z-40 animate-fade-in">
                {/* Delete */}
                <button
                    onClick={() => stopRecording(false)}
                    className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all active:scale-90 shrink-0"
                    title="Delete recording"
                >
                    <Icons.Trash2 size={22} />
                </button>

                {/* Timer */}
                <span className="text-[16px] font-mono font-medium text-text-primary shrink-0 min-w-[36px]">
                    {formatTime(recordSeconds)}
                </span>

                {/* Waveform */}
                <div className="flex-1 flex items-center gap-[2px] h-10 overflow-hidden">
                    {waveformBars.map((h, i) => (
                        <div
                            key={i}
                            className={`rounded-full flex-shrink-0 transition-all duration-200 ${isPaused ? 'bg-text-secondary/40' : 'bg-accent'}`}
                            style={{
                                width: '3px',
                                height: `${Math.max(4, h * 32)}px`,
                                opacity: isPaused ? 0.5 : 0.7 + h * 0.3,
                            }}
                        />
                    ))}
                </div>

                {/* Pause / Resume */}
                <button
                    onClick={togglePause}
                    className="w-10 h-10 flex items-center justify-center text-text-secondary hover:bg-bg-hover rounded-full transition-all active:scale-90 shrink-0"
                    title={isPaused ? 'Resume' : 'Pause'}
                >
                    {isPaused
                        ? <Icons.Play size={22} className="text-accent ml-0.5" />
                        : (
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                                <rect x="6" y="4" width="4" height="16" rx="1" className="text-text-secondary" />
                                <rect x="14" y="4" width="4" height="16" rx="1" className="text-text-secondary" />
                            </svg>
                        )
                    }
                </button>

                {/* Send */}
                <button
                    onClick={() => stopRecording(true)}
                    className="w-12 h-12 bg-accent rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all shrink-0"
                    title="Send voice message"
                >
                    <Icons.Send size={22} className="text-white ml-0.5" />
                </button>
            </div>
        );
    }

    // Normal input UI
    return (
        <div className="px-3 py-2 bg-bg-mini-sidebar flex flex-col gap-1 transition-all duration-300 relative z-40">
            {replyingTo && (
                <div className="bg-bg-mini-sidebar border border-border-main/20 rounded-2xl p-3 flex items-start justify-between gap-3 mx-1">
                    <div className="min-w-0">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-text-secondary mb-1">Replying to</p>
                        <p className="text-[14px] text-text-primary truncate">
                            {replyingTo.props?.text || replyingTo.props?.caption || replyingTo.props?.message || replyingTo.props?.name || 'Message'}
                        </p>
                    </div>
                    <button
                        onClick={onCancelReply}
                        className="p-1 text-text-secondary hover:text-text-primary rounded-full"
                        title="Cancel reply"
                    >
                        <Icons.X size={18} />
                    </button>
                </div>
            )}
            <div className="flex items-end gap-2">
                {/* Input box with emoji + plus inside */}
                <div className="flex-1 bg-bg-bubble-in rounded-3xl flex flex-col shadow-inner transition-all border border-border-main/5 min-h-[46px]">
                    {/* Emoji picker panel */}
                    {showEmojiPicker && (
                        <div className="px-3 pt-3 pb-1 flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto custom-scrollbar">
                            {EMOJI_LIST.map((em) => (
                                <button key={em} onClick={() => insertEmoji(em)} className="text-[22px] hover:bg-bg-surface rounded p-0.5 transition-colors active:scale-90">
                                    {em}
                                </button>
                            ))}
                        </div>
                    )}
                    <div className="flex items-end">
                        {/* Emoji button */}
                        <button
                            onClick={() => setShowEmojiPicker(p => !p)}
                            className={`p-2.5 transition-all active:scale-90 shrink-0 self-end mb-0.5 ${showEmojiPicker ? 'text-accent' : 'text-text-secondary hover:text-text-primary'}`}
                            title="Emoji"
                        >
                            <Icons.Smile size={24} strokeWidth={1.5} />
                        </button>
                    {/* Textarea */}
                    <textarea
                        ref={textareaRef}
                        rows="1"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (enterSend && e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                if (message.trim()) { onSendMessage?.(message); setMessage(''); }
                            }
                        }}
                        placeholder="Type a message"
                        className="bg-transparent border-none outline-none text-text-primary flex-1 text-[16px] py-3 placeholder:text-text-secondary/40 resize-none max-h-32 custom-scrollbar overflow-y-auto"
                    />
                    {/* Plus / attach button */}
                    <button
                        onClick={onAttachToggle}
                        className="p-2.5 text-text-secondary hover:text-text-primary transition-all active:scale-90 shrink-0 group self-end mb-0.5"
                        title="Attach"
                    >
                        <Icons.Plus size={24} strokeWidth={1.5} className="transition-transform duration-300 group-active:rotate-45" />
                    </button>
                    </div>{/* end flex items-end inner */}
                </div>{/* end input box outer */}

                {/* Mic / Send */}
                <div className="flex items-center justify-center flex-shrink-0">
                <AnimatePresence mode="wait">
                    {message.trim() ? (
                        <motion.button
                            key="send"
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 45 }}
                            className="w-12 h-12 bg-accent text-bg-main rounded-full flex items-center justify-center shadow-lg active:scale-90"
                            title="Send message"
                            onClick={() => { onSendMessage?.(message); setMessage(''); }}
                        >
                            <Icons.Send size={22} fill="currentColor" className="ml-1" />
                        </motion.button>
                    ) : (
                        <motion.button
                            key="mic"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            onClick={startRecording}
                            className="w-12 h-12 text-text-secondary hover:bg-bg-hover rounded-full flex items-center justify-center active:scale-90"
                            title="Voice message"
                        >
                            <Icons.Mic size={26} strokeWidth={1.5} />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
            </div>
        </div>
    );
};

export default ChatInputBar;
