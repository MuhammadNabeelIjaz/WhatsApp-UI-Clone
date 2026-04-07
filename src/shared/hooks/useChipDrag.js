import { useState, useRef, useCallback } from 'react';

/**
 * Drag-and-drop reorder for filter chips (SidebarFilterChips).
 * Extracted from MainSidebar where drag state + handlers were inlined.
 *
 * @param {Function} onReorder - (newOrder: array) called after a successful drop
 * @param {Function} getItems  - () => current ordered array of items (read-time)
 * @returns {{ draggedChipId, dragOverChipId, handlers }}
 */
const useChipDrag = (onReorder, getItems) => {
    const [draggedChipId, setDraggedChipId] = useState(null);
    const [dragOverChipId, setDragOverChipId] = useState(null);
    const dragChipRef = useRef(null);

    const handleDragStart = useCallback((e, chipId) => {
        setDraggedChipId(chipId);
        dragChipRef.current = chipId;
        e.dataTransfer.effectAllowed = 'move';
    }, []);

    const handleDragOver = useCallback((e, chipId) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (chipId !== dragChipRef.current) setDragOverChipId(chipId);
    }, []);

    const handleDrop = useCallback((e, targetId) => {
        e.preventDefault();
        const sourceId = dragChipRef.current;
        if (!sourceId || sourceId === targetId) {
            setDraggedChipId(null);
            setDragOverChipId(null);
            dragChipRef.current = null;
            return;
        }
        const items = getItems();
        const fromIdx = items.findIndex((l) => l.id === sourceId);
        const toIdx = items.findIndex((l) => l.id === targetId);
        if (fromIdx === -1 || toIdx === -1) {
            setDraggedChipId(null);
            setDragOverChipId(null);
            dragChipRef.current = null;
            return;
        }
        const next = [...items];
        const [moved] = next.splice(fromIdx, 1);
        next.splice(toIdx, 0, moved);
        dragChipRef.current = null;
        setDraggedChipId(null);
        setDragOverChipId(null);
        onReorder?.(next);
    }, [getItems, onReorder]);

    const handleDragEnd = useCallback(() => {
        setDraggedChipId(null);
        setDragOverChipId(null);
        dragChipRef.current = null;
    }, []);

    return {
        draggedChipId,
        dragOverChipId,
        handlers: {
            onDragStart: handleDragStart,
            onDragOver: handleDragOver,
            onDrop: handleDrop,
            onDragEnd: handleDragEnd,
        },
    };
};

export default useChipDrag;
