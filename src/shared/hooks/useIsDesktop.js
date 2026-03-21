/**
 * useIsDesktop — shared breakpoint hook
 * Canonical breakpoint: 768px — matches AppNavigator.jsx
 * [C-03] Fix: replaces the inline hook in ScheduleCallScreen (which used 1024px incorrectly)
 */
import { useState, useEffect } from 'react';

const useIsDesktop = (breakpoint = 768) => {
    const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= breakpoint);
    useEffect(() => {
        const handler = () => setIsDesktop(window.innerWidth >= breakpoint);
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, [breakpoint]);
    return isDesktop;
};

export default useIsDesktop;
