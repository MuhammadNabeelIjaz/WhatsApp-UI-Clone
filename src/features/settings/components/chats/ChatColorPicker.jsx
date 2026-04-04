import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Icons } from '@constants/icons';
import { selectChatSettings } from '@core/store/slices/settingsSlice';
import { setChatColor } from '@core/store/slices/settingsSlice';
import { showToast } from '@core/store/slices/uiSlice';

const COLORS = [
    '#00a884', '#075e54', '#5352ed', '#3742fa', '#2f3542', '#1e272e',
    '#7d5fff', '#6d214f', '#ff4757', '#e056fd', '#ffa502', '#ffda79',
    '#006266', '#1B1464', '#0652DD', '#1289A7', '#009432', '#A3CB38',
    '#833471', '#6F1E51', '#EA2027', '#EE5A24', '#F79F1F', '#FFC312',
    '#12cbc4', '#1289a7', '#0652dd', '#1b1464', '#5758bb', '#9980fa',
];

const ChatColorPicker = ({ onBack }) => {
    const dispatch      = useDispatch();
    const chatSettings  = useSelector(selectChatSettings);
    const selectedColor = chatSettings?.chatColor || '#00a884';

    const handleSelect = (color) => {
        dispatch(setChatColor(color));
        // Apply to CSS variable immediately for live preview
        document.documentElement.style.setProperty('--accent', color);
        dispatch(showToast('Chat colour updated', 'success', 1500));
    };

    return (
        <div className="flex flex-col h-full w-full bg-bg-surface animate-fade-in">
            {/* Header */}
            <header className="px-4 py-3 flex items-center gap-4 shrink-0 z-20">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-bg-hover rounded-full text-text-secondary active:scale-75 transition-all"
                >
                    <Icons.ArrowLeft size={24} />
                </button>
                <h1 className="text-[20px] font-medium text-text-primary">Chat colour</h1>
                <div
                    className="ml-auto w-7 h-7 rounded-full border-2 border-white/20 shadow-md transition-all duration-300"
                    style={{ backgroundColor: selectedColor }}
                />
            </header>

            {/* Live preview strip */}
            <div
                className="mx-4 mb-4 rounded-2xl px-4 py-3 flex items-center gap-3 transition-all duration-300"
                style={{ backgroundColor: selectedColor + '22', borderLeft: `3px solid ${selectedColor}` }}
            >
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-[12px]"
                    style={{ backgroundColor: selectedColor }}>
                    A
                </div>
                <div>
                    <p className="text-[13px] font-medium text-text-primary">Preview</p>
                    <p className="text-[12px] text-text-secondary">This is how your chat will look</p>
                </div>
            </div>

            {/* Colour Grid */}
            <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(64px,1fr))] gap-x-4 gap-y-10 justify-items-center content-start pb-10">
                    {COLORS.map((color, idx) => {
                        const isActive = selectedColor === color;
                        return (
                            <div
                                key={idx}
                                onClick={() => handleSelect(color)}
                                className="relative cursor-pointer group w-[64px] h-[64px] flex items-center justify-center"
                            >
                                <div
                                    style={{ backgroundColor: color }}
                                    className={`
                                        w-[56px] h-[56px] rounded-full relative z-10
                                        transition-all duration-300
                                        group-active:scale-90 shadow-lg
                                        ${isActive ? 'scale-105 shadow-xl' : 'hover:scale-105'}
                                    `}
                                />
                                {isActive && (
                                    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none animate-zoom-in duration-200">
                                        <div className="rounded-full border-[2.5px] border-white w-[62px] h-[62px] flex items-center justify-center">
                                            <div className="bg-white rounded-full p-1.5 shadow-md">
                                                <Icons.Check size={14} className="text-bg-main" strokeWidth={4} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ChatColorPicker;
