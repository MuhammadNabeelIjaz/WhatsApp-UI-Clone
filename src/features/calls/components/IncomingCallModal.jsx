import React from 'react';
import { Icons } from '@constants/icons';
import { useDispatch } from 'react-redux';
import { acceptCall, declineCall } from '@core/store/slices/callsSlice';

const IncomingCallModal = ({ call }) => {
  const dispatch = useDispatch();

  if (!call) return null;

  return (
    <div className="fixed top-6 right-6 z-[6000] w-[340px] bg-bg-surface rounded-2xl shadow-2xl border border-border-main/50 overflow-hidden flex flex-col animate-zoom-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-bg-hover">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#25D366] flex items-center justify-center">
            <Icons.Phone size={15} className="text-white" />
          </div>
          <span className="text-text-primary text-[15px] font-medium tracking-wide">WhatsApp</span>
        </div>
        <button onClick={() => dispatch(declineCall())} className="p-1 hover:bg-bg-skeleton rounded-md transition-colors">
          <Icons.X size={20} className="text-text-secondary" />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-col items-center px-4 py-6">
        {/* Caller Info */}
        <div className="relative mb-3">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-bg-surface shrink-0 ring-2 ring-[#25D366]/20">
            {call.avatar ? (
              <img src={call.avatar} alt={call.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#3d3470] flex items-center justify-center">
                <span className="text-white font-bold text-xl">{call.name?.charAt(0)?.toUpperCase()}</span>
              </div>
            )}
          </div>
        </div>
        <h2 className="text-text-primary text-[22px] font-medium mb-1">{call.name}</h2>
        <p className="text-text-secondary text-[15px] mb-6 font-medium">
          {call.type === 'video' ? 'Video call' : 'Audio call'}
        </p>

        {/* Local Camera Preview (Simulated) */}
        {call.type === 'video' && (
          <div className="w-[280px] h-[210px] bg-bg-hover rounded-2xl overflow-hidden mb-6 relative shadow-inner">
            <img src="https://picsum.photos/seed/localuser/400/300" alt="Local preview" className="w-full h-full object-cover scale-105" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl" />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between w-full gap-3 mt-auto px-2">
          <button className="w-12 h-12 rounded-full bg-bg-input flex items-center justify-center hover:bg-bg-skeleton transition-colors shrink-0">
            <Icons.MoreHorizontal size={22} className="text-white" />
          </button>
          
          <button 
            onClick={() => dispatch(acceptCall())}
            className="flex-1 h-12 rounded-full bg-accent flex items-center justify-center gap-2 hover:bg-accent-soft transition-all shadow-lg shadow-accent/30 active:scale-95"
          >
            {call.type === 'video' ? (
              <Icons.Video size={20} className="text-white" />
            ) : (
              <Icons.Phone size={20} className="text-white" />
            )}
            <span className="text-white font-semibold text-[15px]">Accept</span>
          </button>

          <button 
            onClick={() => dispatch(declineCall())}
            className="w-12 h-12 rounded-full bg-[#f15c6d] flex items-center justify-center hover:bg-[#f67683] transition-all shrink-0 shadow-[0_4px_12px_rgba(241,92,109,0.3)] active:scale-95"
          >
            <Icons.Phone size={22} className="text-white rotate-[135deg]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
