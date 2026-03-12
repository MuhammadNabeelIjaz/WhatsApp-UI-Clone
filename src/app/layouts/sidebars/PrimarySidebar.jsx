import React from 'react';
import { Icons } from '@core/constants/icons';
import { ROUTES } from '@core/constants/routes';
import NavButton from '@shared/ui/navigation/NavButton';
import MetaAIIcon from '@shared/ui/display/MetaAIIcon';
import SidebarTooltip from '@shared/ui/display/SidebarTooltip';

const PrimarySidebar = ({ activeTab, setActiveTab, isDesktop }) => {

    // --- Desktop Sidebar UI ---
    if (isDesktop) {
        return (
            <div className="flex w-[64px] h-full bg-bg-surface border-r border-border-main/30 flex-col items-center py-5 gap-4 z-[200] shrink-0 relative shadow-[2px_0_8px_rgba(0,0,0,0.06)]">
                {/* Subtle right-edge highlight for crisp visual separation */}
                <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-border-main/40 to-transparent pointer-events-none" />
                <div className="flex flex-col gap-1 flex-1 w-full items-center z-10">
                    <div className="relative group flex items-center">
                        <NavButton icon={<Icons.MessageCircle size={22} />} active={activeTab === ROUTES.CHATS} onClick={() => setActiveTab(ROUTES.CHATS)} />
                        <SidebarTooltip text="Chats" />
                    </div>
                    <div className="relative group flex items-center">
                        <NavButton icon={<Icons.History size={22} />} active={activeTab === ROUTES.STATUS} onClick={() => setActiveTab(ROUTES.STATUS)} />
                        <SidebarTooltip text="Updates" />
                    </div>
                    <div className="relative group flex items-center">
                        <NavButton icon={<Icons.Users size={22} />} active={activeTab === ROUTES.COMMUNITIES} onClick={() => setActiveTab(ROUTES.COMMUNITIES)} />
                        <SidebarTooltip text="Communities" />
                    </div>
                    <div className="relative group flex items-center">
                        <NavButton icon={<Icons.Phone size={22} />} active={activeTab === ROUTES.CALLS} onClick={() => setActiveTab(ROUTES.CALLS)} />
                        <SidebarTooltip text="Calls" />
                    </div>

                    <div className="h-[1px] bg-gradient-to-r from-transparent via-border-main to-transparent w-8 mx-auto my-2" />

                    <div className="relative group flex items-center">
                        <NavButton icon={<MetaAIIcon size={22} />} active={activeTab === ROUTES.AI} onClick={() => setActiveTab(ROUTES.AI)} />
                        <SidebarTooltip text="Meta AI" />
                    </div>
                </div>

                <div className="flex flex-col gap-3 mt-auto w-full items-center pb-4 z-10">
                    <div className="relative group flex items-center">
                        <NavButton icon={<Icons.Settings size={22} />} active={activeTab === ROUTES.SETTINGS} onClick={() => setActiveTab(ROUTES.SETTINGS)} />
                        <SidebarTooltip text="Settings" />
                    </div>
                    <div className="relative group flex items-center">
                        <button
                            className={`w-9 h-9 rounded-full p-[2px] transition-all hover:scale-110 active:scale-95 ${activeTab === ROUTES.PROFILE ? 'bg-accent' : 'bg-transparent hover:bg-bg-hover'}`}
                            onClick={() => setActiveTab(ROUTES.PROFILE)}
                        >
                            <div className="w-full h-full rounded-full border-2 border-bg-surface overflow-hidden bg-accent/20 flex items-center justify-center">
                                <img
                                    src="https://i.ibb.co/Sbdchp3/Screenshot-2026-01-26-014349-1-removebg-preview.png"
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                />
                                <div style={{ display: 'none' }} className="w-full h-full items-center justify-center text-accent">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                </div>
                            </div>
                        </button>
                        <SidebarTooltip text="Profile" />
                    </div>
                </div>
            </div>
        );
    }

    // --- Mobile Bottom Tab UI ---
    return (
        <nav className="flex h-[65px] w-full bg-bg-surface border-t border-border-main items-center justify-between px-1 pb-safe z-[200]">
            <NavButton isMobile label="Chats" icon={<Icons.MessageCircle size={20} />} active={activeTab === ROUTES.CHATS} onClick={() => setActiveTab(ROUTES.CHATS)} />
            <NavButton isMobile label="Updates" icon={<Icons.CircleDot size={20} />} active={activeTab === ROUTES.STATUS} onClick={() => setActiveTab(ROUTES.STATUS)} />
            <NavButton isMobile label="Communities" icon={<Icons.Users size={20} />} active={activeTab === ROUTES.COMMUNITIES} onClick={() => setActiveTab(ROUTES.COMMUNITIES)} />
            <NavButton isMobile label="Calls" icon={<Icons.Phone size={20} />} active={activeTab === ROUTES.CALLS} onClick={() => setActiveTab(ROUTES.CALLS)} />
            <NavButton isMobile label="Settings" icon={<Icons.Settings size={20} />} active={activeTab === ROUTES.SETTINGS} onClick={() => setActiveTab(ROUTES.SETTINGS)} />
        </nav>
    );
};

export default PrimarySidebar; 