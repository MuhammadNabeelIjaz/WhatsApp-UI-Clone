// LocationPreviewSheet — renders as centered modal (desktop) / bottom sheet (mobile)
// Same pattern as PollCreation — fixed inset-0 overlay, not absolute inside chat
import React, { useState, useEffect } from 'react';
import { Icons } from '@constants/icons';
import { motion } from 'framer-motion';

const LocationPreviewSheet = ({ onSend, onClose }) => {
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLive, setShareLive] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLoading(false);
        },
        () => {
          setCoords({ lat: 31.5204, lng: 74.3587 });
          setLoading(false);
        }
      );
    } else {
      setCoords({ lat: 31.5204, lng: 74.3587 });
      setLoading(false);
    }
  }, []);

  const handleSend = () => {
    onSend?.({ coords, isLive: shareLive });
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-[600] flex items-end sm:items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="w-full sm:max-w-[480px] bg-bg-surface rounded-t-2xl sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl"
        style={{ maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-2 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-border-main/30" />
        </div>

        {/* Header */}
        <header className="px-4 py-3 flex items-center gap-4 border-b border-border-main/10 shrink-0">
          <button onClick={onClose} className="p-1.5 hover:bg-bg-hover rounded-full text-text-secondary transition-colors">
            <Icons.ArrowLeft size={22} />
          </button>
          <h1 className="text-[18px] font-semibold text-text-primary flex-1">Send location</h1>
        </header>

        {/* Map Preview */}
        <div className="relative h-[200px] bg-bg-surface overflow-hidden shrink-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-text-secondary text-sm">
              <Icons.MapPin size={28} className="text-accent animate-bounce" />
              <span>Getting your location…</span>
            </div>
          ) : (
            <>
              <img
                src={`https://staticmap.openstreetmap.de/staticmap.php?center=${coords.lat},${coords.lng}&zoom=15&size=600x200&markers=${coords.lat},${coords.lng},red-pushpin`}
                alt="Map"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div style={{ display: 'none' }} className="w-full h-full items-center justify-center bg-bg-surface text-text-secondary flex-col gap-2">
                <Icons.MapPin size={32} className="text-accent" />
                <span className="text-sm">{coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</span>
              </div>
              {/* Center pin overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Icons.MapPin size={36} className="text-red-500 drop-shadow-lg" style={{ marginBottom: 18 }} />
              </div>
            </>
          )}
        </div>

        {/* Scrollable options */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Current location row */}
          {coords && (
            <div className="px-5 py-4 flex items-center gap-4 border-b border-border-main/10 hover:bg-bg-hover cursor-pointer transition-colors" onClick={handleSend}>
              <div className="w-11 h-11 rounded-full bg-accent flex items-center justify-center shrink-0 shadow-md">
                <Icons.MapPin size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-text-primary">Send your current location</p>
                <p className="text-[12px] text-text-secondary truncate">{coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}</p>
              </div>
            </div>
          )}

          {/* Live location row */}
          <div
            className="px-5 py-4 flex items-center gap-4 border-b border-border-main/10 hover:bg-bg-hover cursor-pointer transition-colors"
            onClick={() => setShareLive(v => !v)}
          >
            <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 shadow-md transition-colors ${shareLive ? 'bg-accent' : 'bg-accent/20'}`}>
              <Icons.Navigation size={20} className={shareLive ? 'text-white' : 'text-accent'} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-semibold text-text-primary">Share live location</p>
              <p className="text-[12px] text-text-secondary">Let contacts see your location in real time</p>
            </div>
            {/* Toggle */}
            <div className={`w-11 h-6 rounded-full transition-all shrink-0 ${shareLive ? 'bg-accent' : 'bg-bg-hover'} flex items-center px-0.5`}>
              <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${shareLive ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
          </div>
        </div>

        {/* Send button */}
        <div className="px-5 py-4 shrink-0 border-t border-border-main/10">
          <button
            onClick={handleSend}
            disabled={loading}
            className="w-full bg-accent hover:opacity-90 text-white py-3 rounded-full font-semibold text-[15px] shadow-md active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {shareLive ? 'Share live location' : 'Send location'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LocationPreviewSheet;
