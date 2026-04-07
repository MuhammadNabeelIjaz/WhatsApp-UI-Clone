import React from 'react';
import { Icons } from '@constants/icons';

/**
 * EditContactModal — inline sheet for editing name/phone/about.
 * Props are lifted state from UserInfoPanel to keep the modal stateless.
 */
const EditContactModal = ({
    contactAvatar,
    editName, setEditName,
    editPhone, setEditPhone,
    editAbout, setEditAbout,
    onClose,
    onSave,
}) => (
    <div
        className="fixed inset-0 z-[3500] flex items-end sm:items-center justify-center bg-black/60 animate-fade-in"
        onClick={onClose}
    >
        <div
            className="w-full sm:max-w-[380px] bg-bg-surface rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-zoom-in"
            onClick={e => e.stopPropagation()}
        >
            <div className="px-5 pt-5 pb-4 border-b border-border-main/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                    <img src={contactAvatar} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                    <p className="text-[16px] font-semibold text-text-primary">Edit contact</p>
                    <p className="text-[12px] text-text-secondary">Update contact details</p>
                </div>
            </div>

            <div className="px-5 py-4 flex flex-col gap-4">
                {[
                    { label: 'Name',  value: editName,  setter: setEditName,  placeholder: 'Contact name',    icon: Icons.User  },
                    { label: 'Phone', value: editPhone, setter: setEditPhone, placeholder: '+1 234 567 8900', icon: Icons.Phone },
                    { label: 'About', value: editAbout, setter: setEditAbout, placeholder: 'About / status',  icon: Icons.Edit2 },
                ].map(({ label, value, setter, placeholder, icon: Icon }) => (
                    <div key={label} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                            <Icon size={15} className="text-accent" />
                        </div>
                        <div className="flex-1 border-b border-border-main/30 pb-1">
                            <p className="text-[10px] font-semibold text-accent uppercase tracking-wider mb-1">{label}</p>
                            <input
                                type="text"
                                value={value}
                                onChange={e => setter(e.target.value)}
                                placeholder={placeholder}
                                className="w-full bg-transparent text-[15px] text-text-primary outline-none placeholder:text-text-secondary/50"
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex border-t border-border-main/10">
                <button onClick={onClose}
                    className="flex-1 py-4 text-[15px] text-text-secondary hover:bg-bg-hover transition-colors border-r border-border-main/10">
                    Cancel
                </button>
                <button onClick={onSave}
                    className="flex-1 py-4 text-[15px] font-semibold transition-colors"
                    style={{ color: 'var(--accent)' }}>
                    Save
                </button>
            </div>
        </div>
    </div>
);

export default EditContactModal;
