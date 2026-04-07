import React from 'react';
import { Icons } from '@constants/icons';
/**
 * WhatsApp Premium Clone - Location Bubble
 * Displays a map preview with a custom pin and address info.
 * Matches the "Salman Block" location UI from your video.
 */
const LocationBubble = ({ address, time, isMine, status, coordinates }) => {
    // Default coordinates if none provided (e.g., Lahore center)
    const lat = coordinates?.lat || "31.4504";
    const lng = coordinates?.lng || "74.3464";

    return (
        <div
            className={`max-w-[280px] rounded-2xl overflow-hidden shadow-lg border border-white/5 transition-all
                ${isMine ? 'self-end bg-bg-bubble-out' : 'self-start bg-bg-bubble-in'}
            `}
        >
            {/* --- Map Preview Area --- */}
            <div className="relative h-[160px] w-full cursor-pointer group overflow-hidden">
                {/* Static Map Image */}
                <img
                    src={`https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=16&size=300x200&scale=2&maptype=roadmap&key=YOUR_API_KEY&style=feature:all|element:labels|visibility:on`}
                    className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-110"
                    alt="Map Preview"
                />

                {/* Center Pin Overlay (WhatsApp Red Style) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="relative mb-8">
                        {/* Shadow underneath pin */}
                        <div className="w-2 h-1 bg-black/40 rounded-full blur-[1px] absolute -bottom-1 left-1/2 -translate-x-1/2" />
                        {/* Red Pin */}
                        <div className="w-8 h-8 bg-[#ff5252] rounded-full rounded-bl-none rotate-45 border-2 border-white shadow-md animate-bounce" />
                    </div>
                </div>

                {/* Bottom Navigation Button Overlay */}
                <div className="absolute bottom-2 left-2 bg-white/10 backdrop-blur-md p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icons.Navigation size={16} fill="currentColor" />
                </div>
            </div>

            {/* --- Address Info Area --- */}
            <div className="p-3">
                <h4 className="text-[14.5px] font-semibold text-white leading-tight truncate">
                    Shared Location
                </h4>
                <p className="text-[12.5px] text-[#8696a0] mt-0.5 truncate leading-relaxed">
                    {address || 'Salman Block, Lahore'}
                </p>

                {/* Info Footer: Time & Status */}
                <div className="flex justify-end items-center gap-1 mt-1.5">
                    <span className="text-[10px] font-medium opacity-60 text-white/70">
                        {time}
                    </span>

                    {isMine && (
                        <div className="flex items-center">
                            {status === 'read' ? (
                                <Icons.CheckCheck size={15} className="text-[#53bdeb]" strokeWidth={2.5} />
                            ) : (
                                <Icons.Check size={15} className="opacity-60 text-white/70" strokeWidth={2.5} />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LocationBubble;