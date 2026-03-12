import React from 'react';

/**
 * EmptyState — centered placeholder for empty lists/screens.
 * Used in chat list, starred messages, calls, search results.
 *
 * Props:
 *   icon      — React node (large icon)
 *   title     — string
 *   subtitle  — string
 *   action    — React node (optional CTA button)
 *   className
 */
const EmptyState = ({ icon, title, subtitle, action, className = '' }) => (
    <div className={`flex flex-col items-center justify-center text-center px-8 py-16 ${className}`}>
        {icon && (
            <div className="text-text-secondary/30 mb-5">
                {icon}
            </div>
        )}
        {title && (
            <p className="text-[17px] font-semibold text-text-primary mb-1.5">{title}</p>
        )}
        {subtitle && (
            <p className="text-[13.5px] text-text-secondary leading-relaxed max-w-[260px]">{subtitle}</p>
        )}
        {action && (
            <div className="mt-5">{action}</div>
        )}
    </div>
);

export default EmptyState;
