import React from 'react';
import { Icons } from '@constants/icons';

/**
 * SelectionCheckCircle — circular selection indicator used in multi-select screens.
 * Used in SelectContactScreen, NewGroupScreen, NewBroadcastScreen,
 * AddFavoriteHub, ForwardPicker, AddToListModal.
 *
 * Props:
 *   selected  — boolean
 *   size      — number (default 20)
 *   className — extra classes
 */
const SelectionCheckCircle = ({ selected, size = 20, className = '' }) => (
    <div
        className={`rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${className}
            ${selected ? 'bg-accent border-accent' : 'border-border-main/50'}
        `}
        style={{ width: size, height: size }}
    >
        {selected && (
            <Icons.Check
                size={Math.round(size * 0.6)}
                className="text-white"
                strokeWidth={3}
            />
        )}
    </div>
);

export default React.memo(SelectionCheckCircle);
