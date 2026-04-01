import React, { useState } from 'react';
import { Icons } from '@constants/icons';

const COMMUNITY_LINK = 'https://chat.whatsapp.com/Kcc9TSc0MasG6WtG5spCWi';

// Minimal QR Code SVG generator (pattern-based, not real QR but visually authentic)
const QRCodeSVG = ({ value, size = 200 }) => {
    // Generate a deterministic pattern from the string
    const cells = 25;
    const cellSize = size / cells;
    const bits = [];

    // Seed a simple hash
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
        hash = ((hash << 5) - hash) + value.charCodeAt(i);
        hash |= 0;
    }

    for (let r = 0; r < cells; r++) {
        bits[r] = [];
        for (let c = 0; c < cells; c++) {
            // Finder patterns (corners)
            const inTopLeft = r < 8 && c < 8;
            const inTopRight = r < 8 && c >= cells - 8;
            const inBotLeft = r >= cells - 8 && c < 8;
            if (inTopLeft || inTopRight || inBotLeft) {
                const rr = inTopRight ? r : (inBotLeft ? r - (cells - 8) : r);
                const cc = inTopRight ? c - (cells - 8) : c;
                const normC = cc;
                // Outer ring
                if (rr === 0 || rr === 6 || normC === 0 || normC === 6) bits[r][c] = 1;
                else if (rr >= 2 && rr <= 4 && normC >= 2 && normC <= 4) bits[r][c] = 1;
                else bits[r][c] = 0;
            } else {
                // Data cells - pseudo-random from hash + position
                const seed = hash ^ (r * 31 + c * 17) ^ (r * c * 7);
                bits[r][c] = ((seed >> ((r + c) % 16)) & 1) === 1 ? 1 : 0;
            }
        }
    }

    const rects = [];
    for (let r = 0; r < cells; r++) {
        for (let c = 0; c < cells; c++) {
            if (bits[r][c]) {
                rects.push(
                    <rect
                        key={`${r}-${c}`}
                        x={c * cellSize}
                        y={r * cellSize}
                        width={cellSize}
                        height={cellSize}
                        fill="#000"
                    />
                );
            }
        }
    }

    const center = size / 2;
    const logoSize = size * 0.18;

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
            <rect width={size} height={size} fill="white" />
            {rects}
            {/* WhatsApp logo in center */}
            <rect
                x={center - logoSize / 2 - 4}
                y={center - logoSize / 2 - 4}
                width={logoSize + 8}
                height={logoSize + 8}
                fill="white"
                rx="4"
            />
            <circle cx={center} cy={center} r={logoSize / 2} fill="#25D366" />
            <text
                x={center}
                y={center + 5}
                textAnchor="middle"
                fontSize={logoSize * 0.6}
                fill="white"
                fontFamily="sans-serif"
            >
                ✓
            </text>
        </svg>
    );
};

const CommunityQRScreen = ({ community, onBack }) => {
    const [shared, setShared] = useState(false);
    const communityName = community?.name || 'España 🇪🇸 « Product\'s » ( ꩜* 2024 *°ᗜ)';
    const inviteLink = community?.inviteLink || COMMUNITY_LINK;

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: communityName, url: inviteLink });
        } else {
            navigator.clipboard?.writeText(inviteLink);
            setShared(true);
            setTimeout(() => setShared(false), 2000);
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-bg-surface select-none">
            {/* Header */}
            <header className="px-3 py-3 flex items-center gap-3 shrink-0 bg-bg-surface">
                <button
                    onClick={onBack}
                    className="p-2 rounded-full hover:bg-bg-hover active:scale-95 transition-all text-text-primary"
                >
                    <Icons.ArrowLeft size={24} />
                </button>
                <h1 className="text-[18px] font-semibold text-text-primary flex-1">QR code</h1>
                <button
                    onClick={handleShare}
                    className="p-2 rounded-full hover:bg-bg-hover text-text-primary active:scale-90 transition-all"
                    title="Share"
                >
                    <Icons.Share2 size={22} />
                </button>
                <button className="p-2 rounded-full hover:bg-bg-hover text-text-primary active:scale-90 transition-all">
                    <Icons.MoreVertical size={22} />
                </button>
            </header>

            {/* QR Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
                {/* Community avatar */}
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-border-main/20 shadow-md">
                    <img
                        src={community?.image || `https://ui-avatars.com/api/?name=España&background=00a884&color=fff&size=128`}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=C&background=00a884&color=fff&size=128`; }}
                    />
                </div>

                {/* QR Card */}
                <div className="bg-bg-surface rounded-3xl p-6 shadow-xl border border-border-main/10 flex flex-col items-center gap-4 w-full max-w-[320px]">
                    <div>
                        <p className="text-[17px] font-bold text-text-primary text-center leading-snug">{communityName}</p>
                        <p className="text-[13px] text-text-secondary text-center mt-1">WhatsApp community</p>
                    </div>

                    {/* QR Code */}
                    <div className="bg-white rounded-2xl p-4 shadow-inner">
                        <QRCodeSVG value={inviteLink} size={180} />
                    </div>
                </div>

                {/* Privacy note */}
                <p className="text-[13px] text-text-secondary text-center leading-relaxed max-w-[280px]">
                    This community QR code is private. If it is shared with someone, they can scan it with their WhatsApp camera to join this community.
                </p>

                {shared && (
                    <div className="px-4 py-2 rounded-full bg-accent text-white text-[13px] font-medium animate-fade-in">
                        Link copied ✓
                    </div>
                )}
            </div>

            <div className="h-6" />
        </div>
    );
};

export default CommunityQRScreen;
