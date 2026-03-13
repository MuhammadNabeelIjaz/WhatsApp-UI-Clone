import React from 'react';
import { Icons } from '@constants/icons';

const ICONS = {
  success: <Icons.CheckCircle size={16} className="text-accent shrink-0" />,
  error: <Icons.AlertCircle size={16} className="text-red-400 shrink-0" />,
  info: <Icons.Info size={16} className="text-blue-400 shrink-0" />,
};

const Toast = ({ message, visible, type = 'info' }) => (
  <div
    className={`fixed bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#1f2937] text-white text-[13.5px] px-4 py-2.5 rounded-full z-[9999] shadow-xl transition-all duration-300 pointer-events-none whitespace-nowrap max-w-[90vw]
      ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
  >
    {ICONS[type] || ICONS.info}
    <span className="truncate">{message}</span>
  </div>
);

export default Toast;
