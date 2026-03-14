import React from 'react';

/**
 * Divider — section separator / section label.
 * Used between settings groups, contact sections, etc.
 *
 * Props:
 *   label     — optional text above the line
 *   className
 */
const Divider = ({ label, className = '' }) => {
    if (label) {
        return (
            <div className={`px-5 pt-5 pb-2 ${className}`}>
                <p className="text-[12.5px] font-semibold text-text-secondary/70 uppercase tracking-wider">
                    {label}
                </p>
            </div>
        );
    }
    return (
        <div className={`mx-5 border-t border-border-main/5 ${className}`} />
    );
};

export default Divider;
