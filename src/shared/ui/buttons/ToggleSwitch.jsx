import React from 'react';

const ToggleSwitch = ({ checked, onChange, isOn, onToggle }) => {
    // Support both API styles
    const isChecked = checked !== undefined ? checked : (isOn || false);
    const handleChange = onChange || onToggle || (() => {});

    return (
        <button
            type="button"
            role="switch"
            aria-checked={isChecked}
            onClick={(e) => {
                e.stopPropagation();
                handleChange();
            }}
            className={`
                relative inline-flex h-[14px] w-[34px] flex-shrink-0 cursor-pointer 
                items-center rounded-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                focus:outline-none
                ${isChecked ? 'bg-accent/40' : 'bg-text-secondary/30'}
            `}
        >
            <span
                className={`
                    pointer-events-none inline-block h-5 w-5 transform rounded-full 
                    shadow-md ring-0 transition-all duration-300 
                    ${isChecked
                        ? 'translate-x-[14px] bg-accent'
                        : 'translate-x-[-2px] bg-[#f1f1f1]'
                    }
                `}
            />
        </button>
    );
};

export default ToggleSwitch;
