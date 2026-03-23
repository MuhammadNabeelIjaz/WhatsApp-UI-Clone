// ContactPickerSheet — WhatsApp-style multi-select contact picker
// Same modal pattern as LocationPreviewSheet (fixed inset-0 overlay)
import React, { useState, useMemo } from 'react';
import EmptyState from '@shared/ui/display/EmptyState';
import { useFakeLoading } from '@shared/hooks';
import { Icons } from '@constants/icons';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { selectContacts } from '@core/store/slices/contactSlice';
import { ContactPickerSkeleton } from '@shared/ui/display/Skeletons';

const ContactPickerSheet = ({ onSend, onClose }) => {
  const contacts = useSelector(selectContacts);
  const isLoading = useFakeLoading(380);
  const [query, setQuery]       = useState('');
  const [selected, setSelected] = useState([]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return contacts;
    return contacts.filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.phone && c.phone.includes(q))
    );
  }, [contacts, query]);

  const toggle = (contact) => {
    setSelected(prev =>
      prev.some(c => c.id === contact.id)
        ? prev.filter(c => c.id !== contact.id)
        : [...prev, contact]
    );
  };

  const isSelected = (id) => selected.some(c => c.id === id);

  const handleSend = () => {
    if (!selected.length) return;
    selected.forEach(c => onSend?.({ name: c.name, phone: c.phone, initials: c.initials, avatarColor: c.avatarColor }));
    onClose?.();
  };

  if (isLoading) return <ContactPickerSkeleton />;

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
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-bg-hover rounded-full text-text-secondary transition-colors"
          >
            <Icons.ArrowLeft size={22} />
          </button>
          <div className="flex-1">
            <h1 className="text-[18px] font-semibold text-text-primary leading-tight">Send contact</h1>
            {selected.length > 0 && (
              <p className="text-[12px] text-accent leading-tight">
                {selected.length} selected
              </p>
            )}
          </div>
        </header>

        {/* Search */}
        <div className="px-4 py-2 shrink-0 border-b border-border-main/10">
          <div className="flex items-center gap-2 bg-bg-hover rounded-xl px-3 py-2">
            <Icons.Search size={16} className="text-text-secondary shrink-0" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search contacts…"
              className="flex-1 bg-transparent text-[14px] text-text-primary placeholder:text-text-secondary outline-none"
              autoFocus
            />
            {query.length > 0 && (
              <button onClick={() => setQuery('')} className="text-text-secondary hover:text-text-primary">
                <Icons.X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Selected chips */}
        {selected.length > 0 && (
          <div className="px-4 py-2 flex gap-2 overflow-x-auto shrink-0 border-b border-border-main/10 custom-scrollbar">
            {selected.map(c => (
              <div
                key={c.id}
                className="flex flex-col items-center gap-1 shrink-0 cursor-pointer"
                onClick={() => toggle(c)}
              >
                <div className="relative">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white text-[14px] font-bold"
                    style={{ backgroundColor: c.avatarColor || '#6b7280' }}
                  >
                    {c.initials}
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                    <Icons.X size={9} className="text-white" />
                  </div>
                </div>
                <span className="text-[10px] text-text-secondary max-w-[48px] truncate text-center">{c.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        )}

        {/* Contact list */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filtered.length === 0 ? (
            <EmptyState icon={<Icons.UserX size={28} />} title="No contacts found" className="py-4" />
          ) : (
            filtered.map(contact => {
              const checked = isSelected(contact.id);
              return (
                <div
                  key={contact.id}
                  onClick={() => toggle(contact)}
                  className={`px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors ${
                    checked ? 'bg-accent/10' : 'hover:bg-bg-hover'
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white text-[15px] font-bold shrink-0"
                    style={{ backgroundColor: contact.avatarColor || '#6b7280' }}
                  >
                    {contact.initials}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-medium text-text-primary truncate">{contact.name}</p>
                    <p className="text-[12px] text-text-secondary truncate">{contact.phone || 'No number'}</p>
                  </div>

                  {/* Checkbox */}
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                      checked
                        ? 'bg-accent border-accent'
                        : 'border-border-main/40 bg-transparent'
                    }`}
                  >
                    {checked && <Icons.Check size={13} className="text-white" strokeWidth={3} />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Send button */}
        <div className="px-5 py-4 shrink-0 border-t border-border-main/10">
          <button
            onClick={handleSend}
            disabled={selected.length === 0}
            className="w-full bg-accent hover:opacity-90 text-white py-3 rounded-full font-semibold text-[15px] shadow-md active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {selected.length === 0
              ? 'Select a contact'
              : selected.length === 1
              ? `Send contact`
              : `Send ${selected.length} contacts`}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactPickerSheet;
