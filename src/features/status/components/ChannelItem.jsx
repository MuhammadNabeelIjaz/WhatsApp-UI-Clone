import React from 'react';

const ChannelItem = ({ name, followers, icon }) => (
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#2a3942] flex items-center justify-center">
                {icon}
            </div>
            <div>
                <p className="font-bold">{name}</p>
                <p className="text-xs text-[#8696a0]">{followers} followers</p>
            </div>
        </div>
        <button className="px-4 py-1.5 rounded-full border border-[#2a3942] text-[#00a884] text-sm font-bold">
            Follow
        </button>
    </div>
);

export default ChannelItem;