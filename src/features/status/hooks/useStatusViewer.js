// src/features/status/hooks/useStatusViewer.js
// Manages status viewer state: current user index, slide index, auto-advance, pause.
// Backend ready: connect to statusService.markStatusSeen() when backend is ready.

import { useState, useCallback } from 'react';

/**
 * @param {Array}    statusUsers  - List of status user objects
 * @param {Function} onClose      - Called when viewer is dismissed
 * @returns {{ currentIndex, slideIndex, paused, openViewer, nextUser, prevUser, nextSlide, setSlideIndex, setPaused }}
 */
export function useStatusViewer(statusUsers = [], onClose) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [slideIndex,   setSlideIndex]   = useState(0);
    const [paused,       setPaused]       = useState(false);

    const openViewer = useCallback((index) => {
        setCurrentIndex(index);
        setSlideIndex(0);
        setPaused(false);
    }, []);

    const nextUser = useCallback(() => {
        if (currentIndex < statusUsers.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSlideIndex(0);
        } else {
            onClose?.();
        }
    }, [currentIndex, statusUsers.length, onClose]);

    const prevUser = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setSlideIndex(0);
        }
    }, [currentIndex]);

    const nextSlide = useCallback((totalSlides) => {
        if (slideIndex < totalSlides - 1) {
            setSlideIndex(prev => prev + 1);
        } else {
            nextUser();
        }
    }, [slideIndex, nextUser]);

    return { currentIndex, slideIndex, paused, openViewer, nextUser, prevUser, nextSlide, setSlideIndex, setPaused };
}

export default useStatusViewer;
