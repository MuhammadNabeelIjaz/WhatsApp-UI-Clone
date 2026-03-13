import React from 'react';

/**
 * RadioOption — single radio option row used in privacy screens.
 * Appears identically in LastSeenPrivacy, GroupsPrivacy, AboutPrivacy,
 * ProfilePhotoPrivacy, LinksPrivacy, MessageTimer, AppLock.
 *
 * Props:
 *   label   — string
 *   value   — string
 *   current — currently selected value
 *   onChange — (value: string) => void
 *   name    — radio group name (optional)
 *   badge   — optional React node (right of label)
 */
const RadioOption = ({ label, value, current, onChange, name, badge }) => (
    <label className="flex items-center justify-between py-4 cursor-pointer active:bg-bg-hover transition-colors">
        <div className="flex items-center gap-2 flex-1">
            <span className="text-[16.5px] text-text-primary">{label}</span>
            {badge && <span className="text-[13px] text-accent">{badge}</span>}
        </div>
        <div className="relative flex items-center justify-center">
            <input
                type="radio"
                name={name}
                value={value}
                checked={current === value}
                onChange={() => onChange(value)}
                className="appearance-none w-5 h-5 border-2 rounded-full border-text-secondary checked:border-accent transition-all"
            />
            {current === value && (
                <div className="absolute w-2.5 h-2.5 bg-accent rounded-full animate-zoom-in" />
            )}
        </div>
    </label>
);

export default React.memo(RadioOption);
