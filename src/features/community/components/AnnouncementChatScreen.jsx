import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@app/providers/ThemeContext';
import { Icons } from '@constants/icons'; // Standardized Icons

const AnnouncementChatScreen = ({ group, onBack }) => {
    const { isDarkMode } = useTheme();
    const [message, setMessage] = useState('');
    const scrollRef = useRef();

    const [messages] = useState([
        { id: 1, sender: 'Arman Adil Mangat', number: '+92 346 2287062', text: 'Online class link of principles of Marketing Ali bukhari C7??', time: '8:56 am', color: '#3498db' },
        {
            id: 2,
            sender: 'Not Your Type',
            number: '+92 316 6465028',
            text: 'ye to LMS k halat hain',
            time: '8:58 am',
            color: '#e67e22',
            image: 'https://i.ibb.co/vYf0YfV/lms-screenshot.png',
            reactions: '💀 2'
        },
        { id: 3, sender: 'Mustafa Hassan', number: '+92 317 4124920', text: 'Idr kesa mila ga apko apni mail dekho', time: '9:02 am', color: '#2ecc71', replyTo: 'Online class link of principles...' },
        { id: 4, sender: 'Gul Ali', number: '+92 305 6014521', text: 'Nope 👍', time: '9:15 am', color: '#9b59b6' }
    ]);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, []);

    return (
        <div className="flex flex-col h-full w-full select-none overflow-hidden bg-bg-chat transition-colors duration-300 relative">

            {/* WhatsApp Doodle Background Overlay */}
            <div className={`absolute inset-0 opacity-[0.06] pointer-events-none ${isDarkMode ? 'invert' : ''}`}
                style={{ backgroundImage: `url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')` }}>
            </div>

            {/* Header */}
            <header className="px-2 py-2 flex items-center justify-between shrink-0 shadow-sm z-50 bg-bg-surface border-b border-border-main/20">
                <div className="flex items-center gap-1 flex-1 min-w-0">
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-bg-hover text-text-primary">
                        <Icons.ArrowLeft size={22} />
                    </button>
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-border-main/10">
                        <img src={`https://ui-avatars.com/api/?name=${group?.name || 'User'}&background=random`} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col ml-2 truncate">
                        <h1 className="text-[15px] font-bold text-text-primary truncate">{group?.name || 'ACM Members'}</h1>
                        <p className="text-[11px] text-text-secondary opacity-80">tap here for group info</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 px-3 text-text-secondary">
                    <Icons.Video size={20} className="hover:text-accent cursor-pointer" />
                    <Icons.Phone size={19} className="hover:text-accent cursor-pointer" />
                    <Icons.MoreVertical size={20} className="hover:text-accent cursor-pointer" />
                </div>
            </header>

            {/* Chat Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar px-4 py-4 flex flex-col gap-3 z-10">
                {messages.map((msg) => (
                    <div key={msg.id}
                        className={`flex flex-col max-w-[85%] rounded-lg p-2 shadow-sm relative 
                        ${msg.sender === 'Me' ? 'self-end bg-bg-bubble-out text-text-primary rounded-tr-none' : 'self-start bg-bg-surface text-text-primary rounded-tl-none'}`}
                    >
                        {/* Bubble Corner Tail (Small Triangle) */}
                        <div className={`absolute top-0 w-2 h-2 ${msg.sender === 'Me' ? '-right-2 bg-bg-bubble-out [clip-path:polygon(0_0,0_100%,100%_0)]' : '-left-2 bg-bg-surface [clip-path:polygon(100%_0,0_0,100%_100%)]'}`} />

                        {/* Sender Info */}
                        <div className="flex justify-between items-center gap-4 mb-1 px-1">
                            <span className="text-[12px] font-bold" style={{ color: msg.color }}>~ {msg.sender}</span>
                            <span className="text-[10px] text-text-secondary opacity-60 font-mono">{msg.number}</span>
                        </div>

                        {/* Reply UI */}
                        {msg.replyTo && (
                            <div className="mb-2 border-l-[4px] rounded-md bg-black/5 dark:bg-white/5 p-2 text-[12px] flex flex-col border-l-accent/50">
                                <span className="font-bold mb-0.5 text-accent">Replying to message</span>
                                <span className="text-text-secondary truncate">{msg.replyTo}</span>
                            </div>
                        )}

                        {/* Image Content */}
                        {msg.image && (
                            <div className="rounded-md overflow-hidden mb-1.5 border border-border-main/10 shadow-inner">
                                <img src={msg.image} alt="" className="w-full h-auto max-h-[300px] object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                            </div>
                        )}

                        {/* Message Text & Time */}
                        <div className="px-1 flex flex-wrap items-end justify-between gap-2">
                            <p className="text-[14.5px] leading-[1.4] flex-1">{msg.text}</p>
                            <div className="flex items-center gap-1 mb-[-2px]">
                                <span className="text-[10px] text-text-secondary opacity-70 uppercase">{msg.time}</span>
                                {msg.sender === 'Me' && <Icons.CheckCheck size={14} className="text-blue-400" />}
                            </div>
                        </div>

                        {/* Reactions */}
                        {msg.reactions && (
                            <div className="absolute -bottom-3 left-2 bg-bg-surface border border-border-main rounded-full px-2 py-0.5 text-[11px] shadow-md z-20">
                                {msg.reactions}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <footer className="p-2 flex items-center gap-2 shrink-0 z-50 bg-bg-chat/95 backdrop-blur-sm">
                <div className="flex-1 flex items-center rounded-full px-4 py-1.5 gap-3 shadow-sm bg-bg-surface border border-border-main/10">
                    <Icons.Smile size={24} className="text-text-secondary hover:text-accent cursor-pointer transition-colors" />
                    <input
                        type="text"
                        placeholder="Message"
                        className="flex-1 bg-transparent outline-none text-[16px] py-1 text-text-primary placeholder:text-text-secondary/50"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <Icons.Paperclip size={22} className="-rotate-45 text-text-secondary hover:text-accent cursor-pointer" />
                    {!message && <Icons.Camera size={22} className="text-text-secondary hover:text-accent cursor-pointer" />}
                </div>

                <button className="w-[50px] h-[50px] rounded-full flex items-center justify-center bg-accent shadow-lg active:scale-90 transition-all hover:brightness-110">
                    {message ? <Icons.Send size={20} className="text-white ml-0.5" /> : <Icons.Mic size={22} className="text-white" />}
                </button>
            </footer>
        </div>
    );
};

export default AnnouncementChatScreen;