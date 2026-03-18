/**
 * SidebarSearch
 * The "Ask Meta AI or Search" bar at the top of the chat list.
 */
import React from 'react';
import MetaAIIcon from '@shared/ui/display/MetaAIIcon';

const SidebarSearch = ({ value, onChange }) => (
    <div className="px-4 pb-4 flex shrink-0">
        <div className="bg-bg-input rounded-full flex-1 flex items-center px-4 py-2.5 gap-3 border border-border-main/20 shadow-sm focus-within:border-accent/40 transition-all">
            <MetaAIIcon size={20} />
            <input
                type="text"
                placeholder="Ask Meta AI or Search"
                className="bg-transparent border-none outline-none text-[15px] w-full text-text-primary placeholder:text-text-secondary"
                value={value}
                onChange={onChange}
            />
        </div>
    </div>
);

export default SidebarSearch;
