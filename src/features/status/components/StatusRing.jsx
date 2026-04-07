import React from 'react';

const StatusRing = ({ total, seen }) => {
    const size = 64;
    const strokeWidth = 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const gapSize = total > 1 ? 4 : 0;
    const segment = (circumference / total) - gapSize;

    return (
        <svg width={size} height={size} className="absolute transform -rotate-90 pointer-events-none overflow-visible">
            {[...Array(total)].map((_, i) => (
                <circle
                    key={i}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={i < seen ? "#8696a0" : "#00a884"}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${segment} ${circumference - segment}`}
                    strokeDashoffset={-i * (circumference / total)}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                />
            ))}
        </svg>
    );
};

export default StatusRing;