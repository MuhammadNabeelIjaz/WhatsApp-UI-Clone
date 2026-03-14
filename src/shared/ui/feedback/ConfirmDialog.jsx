import React from 'react';

const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmColor = 'red',   // 'red' | 'green'
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const confirmCls = confirmColor === 'red'
    ? 'bg-red-500 hover:bg-red-600 text-white'
    : 'bg-accent hover:opacity-90 text-white';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[2000] animate-fade-in"
        onClick={onCancel}
      />
      {/* Dialog card */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[2010] w-[320px] bg-bg-surface rounded-2xl shadow-2xl overflow-hidden animate-zoom-in">
        {/* Header */}
        <div className="px-6 pt-6 pb-2">
          <h2 className="text-[18px] font-semibold text-text-primary">{title}</h2>
          {message && (
            <p className="text-[14px] text-text-secondary mt-2 leading-relaxed">{message}</p>
          )}
        </div>
        {/* Actions */}
        <div className="flex gap-3 px-6 py-5">
          <button
            onClick={onCancel}
            className="flex-1 py-[10px] rounded-full border border-border-main text-text-primary text-[14px] font-medium hover:bg-bg-hover transition-all active:scale-[0.98]"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-[10px] rounded-full text-[14px] font-semibold transition-all active:scale-[0.98] ${confirmCls}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </>
  );
};

export default ConfirmDialog;
