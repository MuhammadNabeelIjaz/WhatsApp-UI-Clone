import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Icons } from '@constants/icons';
import SectionLabel from '@shared/ui/list/SectionLabel';
import { selectChatSettings } from '@core/store/slices/settingsSlice';
import { setChatWallpaper } from '@core/store/slices/settingsSlice';
import { showToast } from '@core/store/slices/uiSlice';

// Solid colour wallpapers — tailwind bg class + actual hex for inline style
const SOLID_WALLPAPERS = [
    { id: 'w1', label: 'Teal',        color: '#0d3d34' },
    { id: 'w2', label: 'Accent',      color: '#00a884' },
    { id: 'w3', label: 'Slate',       color: '#2a3942' },
    { id: 'w4', label: 'Dark',        color: '#111b21' },
    { id: 'w5', label: 'Navy',        color: '#1e3a5f' },
    { id: 'w6', label: 'Forest',      color: '#1a3c34' },
    { id: 'w7', label: 'Plum',        color: '#3b1f3b' },
    { id: 'w8', label: 'Rust',        color: '#3d1a0e' },
    { id: 'w9', label: 'Midnight',    color: '#0f172a' },
];

const WallpaperGrid = ({ onBack }) => {
    const dispatch         = useDispatch();
    const chatSettings     = useSelector(selectChatSettings);
    const currentWallpaper = chatSettings?.chatWallpaper;
    const fileRef = useRef(null);

    const handleSelect = (wallpaper) => {
        dispatch(setChatWallpaper(wallpaper));
        dispatch(showToast('Wallpaper updated', 'success', 1500));
    };

    const handleRemove = () => {
        dispatch(setChatWallpaper(null));
        dispatch(showToast('Wallpaper removed', 'info', 1500));
    };

    const handleGalleryPick = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            handleSelect({ type: 'image', src: ev.target.result });
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="flex flex-col h-full w-full bg-bg-surface animate-fade-in">
            <header className="px-4 py-3 flex items-center gap-4 border-b border-border-main/20 bg-bg-surface shrink-0">
                <button onClick={onBack} className="p-2 hover:bg-bg-hover rounded-full text-text-secondary transition-all active:scale-90">
                    <Icons.ArrowLeft size={24} />
                </button>
                <h1 className="text-[20px] font-medium text-text-primary">Wallpaper</h1>
                {currentWallpaper && (
                    <div className="ml-auto w-7 h-7 rounded-lg overflow-hidden border border-accent/40">
                        {currentWallpaper.type === 'image'
                            ? <img src={currentWallpaper.src} className="w-full h-full object-cover" alt="" />
                            : <div className="w-full h-full" style={{ backgroundColor: currentWallpaper.color }} />
                        }
                    </div>
                )}
            </header>

            <div className="flex-1 overflow-y-auto px-4 pt-4 custom-scrollbar">

                {/* Gallery Option */}
                <div className="mb-6">
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleGalleryPick} />
                    <div
                        onClick={() => fileRef.current?.click()}
                        className="flex items-center gap-5 p-4 hover:bg-bg-hover cursor-pointer rounded-2xl transition-all group border border-border-main/20 hover:border-accent/30"
                    >
                        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                            <Icons.Image size={22} />
                        </div>
                        <div>
                            <p className="text-[15px] font-medium text-text-primary">My Photos</p>
                            <p className="text-[12px] text-text-secondary">Choose from gallery</p>
                        </div>
                    </div>
                </div>

                <SectionLabel label="Solid Colours" className="mb-4 px-0 py-0" />
                <div className="grid grid-cols-3 gap-3 mb-8">
                    {SOLID_WALLPAPERS.map(wp => {
                        const isActive = currentWallpaper?.type === 'solid' && currentWallpaper?.id === wp.id;
                        return (
                            <div
                                key={wp.id}
                                onClick={() => handleSelect({ type: 'solid', id: wp.id, color: wp.color })}
                                className={`aspect-[3/4] rounded-2xl relative cursor-pointer transition-all hover:scale-[1.02] border-2
                                    ${isActive ? 'border-accent shadow-lg shadow-accent/20' : 'border-border-main/20 hover:border-accent/50'}`}
                                style={{ backgroundColor: wp.color }}
                            >
                                {isActive && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-white rounded-full p-1.5 shadow-md">
                                            <Icons.Check size={14} className="text-bg-main" strokeWidth={4} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <SectionLabel label="No Wallpaper" className="mb-4 px-0 py-0" />
                <div
                    onClick={handleRemove}
                    className={`flex items-center gap-4 p-4 hover:bg-bg-hover rounded-xl cursor-pointer transition-colors border
                        ${!currentWallpaper ? 'border-accent' : 'border-border-main/20'}`}
                >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border
                        ${!currentWallpaper ? 'bg-accent/10 border-accent/30' : 'bg-bg-hover border-border-main/30'}`}>
                        {!currentWallpaper
                            ? <Icons.Check size={20} className="text-accent" />
                            : <Icons.X size={20} className="text-text-secondary" />
                        }
                    </div>
                    <p className={`text-[15px] ${!currentWallpaper ? 'text-accent font-medium' : 'text-text-primary'}`}>
                        {!currentWallpaper ? 'No wallpaper (active)' : 'None'}
                    </p>
                </div>

                <div className="h-10" />
            </div>
        </div>
    );
};

export default WallpaperGrid;
