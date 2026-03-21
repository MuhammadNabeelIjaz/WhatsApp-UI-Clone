import { useState, useEffect, useRef } from 'react';

const useLongPress = (callback, ms = 800) => {
    const [startLongPress, setStartLongPress] = useState(false);
    const timerRef = useRef();

    useEffect(() => {
        if (startLongPress && typeof callback === 'function') {
            timerRef.current = setTimeout(callback, ms);
        } else {
            clearTimeout(timerRef.current);
        }
        return () => clearTimeout(timerRef.current);
    }, [startLongPress, callback, ms]);

    return {
        onMouseDown: () => setStartLongPress(true),
        onMouseUp: () => setStartLongPress(false),
        onMouseLeave: () => setStartLongPress(false),
        onTouchStart: () => setStartLongPress(true),
        onTouchEnd: () => setStartLongPress(false),
    };
};

export default useLongPress;
