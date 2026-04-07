/**
 * shared/ui/contact/NewContactScreen.jsx — Canonical location.
 *
 * Generic add/edit contact form. Used by:
 *   - features/calls  (add new contact from keypad/FAB)
 *   - features/chat   (edit contact via UserInfoPanel)
 *
 * Supports two modes:
 *   create  — stand-alone add contact. Saves directly to store.
 *   edit    — called from UserInfoPanel with initialData + onSave callback.
 *
 * Props:
 *   onBack       — () => void
 *   onSave       — (data) => void  (edit mode only)
 *   mode         — 'create' | 'edit'  (default: 'create')
 *   initialData  — { firstName, lastName, phone, email, about }  (edit mode)
 *   prefillPhone — string  (create mode, pre-populates phone field)
 */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Icons } from '@constants/icons';
import CountryPicker from '@shared/ui/inputs/CountryPicker';
import { addContact } from '@core/store/slices/contactSlice';
import { showToast } from '@core/store/slices/uiSlice';

const AVATAR_COLORS = ['#128c7e','#6b7280','#10b981','#3d3470','#5c6bc0','#c0392b','#7d6608','#884ea0','#2e86c1','#e67e22'];

const NewContactScreen = ({ onBack, onSave, mode = 'create', initialData = {}, prefillPhone = '' }) => {
    const dispatch = useDispatch();
    const [selectedCountry, setSelectedCountry] = useState({ code: '+92', flag: '🇵🇰', name: 'Pakistan' });
    const [showCountryPicker, setShowCountryPicker]   = useState(false);
    const [firstName, setFirstName] = useState(initialData.firstName || '');
    const [lastName,  setLastName]  = useState(initialData.lastName  || '');
    const [phone,     setPhone]     = useState(initialData.phone || prefillPhone || '');
    const [email,     setEmail]     = useState(initialData.email     || '');

    const isEdit  = mode === 'edit';
    const title   = isEdit ? 'Edit Contact' : 'New Contact';
    const canSave = firstName.trim().length > 0;

    const handleSave = () => {
        if (!canSave) return;
        const name = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ');
        const fullPhone = phone.trim().startsWith('+') ? phone.trim() : `${selectedCountry.code} ${phone.trim()}`;

        if (isEdit) {
            onSave?.({
                name,
                firstName: firstName.trim(),
                lastName:  lastName.trim(),
                phone:     fullPhone,
                email:     email.trim(),
                initials:  `${firstName.trim()[0] || ''}${lastName.trim()[0] || ''}`.toUpperCase(),
            });
        } else {
            const initials    = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
            const avatarColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
            dispatch(addContact({
                name, initials,
                phone: fullPhone,
                email: email.trim(),
                avatarColor,
                about: 'Hey there! I am using WhatsApp',
                isOnline: false, isFavorite: false, isBlocked: false, isMuted: false,
            }));
            dispatch(showToast(`Contact "${name}" saved`, 'success'));
            setTimeout(() => onBack(), 200);
        }
    };

    if (showCountryPicker) {
        return (
            <CountryPicker
                selectedCountry={selectedCountry}
                onSelect={(country) => { setSelectedCountry(country); setShowCountryPicker(false); }}
                onClose={() => setShowCountryPicker(false)}
            />
        );
    }

    return (
        <div className="absolute inset-0 bg-bg-surface z-[1100] flex flex-col animate-fade-in">
            <header className="px-4 py-4 flex items-center justify-between bg-bg-surface shadow-sm shrink-0">
                <button onClick={onBack} className="text-accent text-[15px] font-medium px-1 py-1">Cancel</button>
                <h1 className="text-[17px] font-semibold text-text-primary">{title}</h1>
                <button
                    onClick={handleSave}
                    className={`text-[15px] font-semibold px-1 py-1 transition-opacity ${canSave ? 'text-accent' : 'text-accent/30'}`}
                    disabled={!canSave}
                >
                    Save
                </button>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {/* Avatar picker */}
                <div className="flex flex-col items-center py-8">
                    <div className="w-24 h-24 rounded-full bg-bg-input flex items-center justify-center border-2 border-border-main/20 cursor-pointer hover:bg-bg-hover transition-colors relative">
                        <Icons.Camera size={30} className="text-accent" />
                        <div className="absolute bottom-0 right-0 w-7 h-7 bg-accent rounded-full flex items-center justify-center">
                            <Icons.Plus size={14} className="text-white" />
                        </div>
                    </div>
                    <p className="text-[13px] text-text-secondary mt-3">Add photo</p>
                </div>

                {/* Name fields */}
                <div className="mx-4 rounded-2xl bg-bg-surface overflow-hidden border border-border-main/10 divide-y divide-border-main/10">
                    <div className="flex items-center px-4 py-3.5">
                        <Icons.User size={18} className="text-accent mr-4 shrink-0" />
                        <input
                            type="text"
                            placeholder="First name"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            autoFocus
                            className="flex-1 bg-transparent text-[15px] text-text-primary outline-none placeholder:text-text-secondary/60"
                        />
                    </div>
                    <div className="flex items-center px-4 py-3.5">
                        <Icons.UserRound size={18} className="text-accent mr-4 shrink-0" />
                        <input
                            type="text"
                            placeholder="Last name"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            className="flex-1 bg-transparent text-[15px] text-text-primary outline-none placeholder:text-text-secondary/60"
                        />
                    </div>
                </div>

                {/* Phone */}
                <div className="mx-4 mt-3 rounded-2xl bg-bg-surface overflow-hidden border border-border-main/10">
                    <div className="flex items-center px-4 py-3.5">
                        <Icons.Phone size={18} className="text-accent mr-4 shrink-0" />
                        <button
                            onClick={() => setShowCountryPicker(true)}
                            className="flex items-center gap-2 mr-3 pl-1 pr-2 py-1 rounded-lg hover:bg-bg-hover transition-colors border border-border-main/20"
                        >
                            <span className="text-[18px]">{selectedCountry.flag}</span>
                            <span className="text-[13px] text-text-secondary font-medium">{selectedCountry.code}</span>
                            <Icons.ChevronDown size={14} className="text-text-secondary" />
                        </button>
                        <input
                            type="tel"
                            placeholder="Phone number"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
                            className="flex-1 bg-transparent text-[15px] text-text-primary outline-none placeholder:text-text-secondary/60"
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="mx-4 mt-3 rounded-2xl bg-bg-surface overflow-hidden border border-border-main/10">
                    <div className="flex items-center px-4 py-3.5">
                        <Icons.Mail size={18} className="text-accent mr-4 shrink-0" />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="flex-1 bg-transparent text-[15px] text-text-primary outline-none placeholder:text-text-secondary/60"
                        />
                    </div>
                </div>

                {/* Note */}
                <div className="mx-4 mt-6 mb-8 flex items-start gap-3 px-2">
                    <Icons.MessageCircle size={14} className="text-accent mt-0.5 shrink-0" />
                    <p className="text-[12.5px] text-text-secondary leading-snug">
                        This contact will be saved to your phone. If they have WhatsApp, they'll appear in your chats automatically.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NewContactScreen;
