import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import EmptyState from '@shared/ui/display/EmptyState';
import SearchInput from '@shared/ui/inputs/SearchInput';
import SectionLabel from '@shared/ui/list/SectionLabel';
import { Icons } from '@constants/icons';
import { selectContacts } from '@core/store/slices/contactSlice';
import { addContact, toggleFavoriteContact } from '@core/store/slices/contactSlice';
import { addCommunityThunk } from '@core/store/slices/communitySlice';
import { showToast } from '@core/store/slices/uiSlice';
import NewContactScreen from '@shared/ui/contact/NewContactScreen';

const AddFavoriteHub = ({ onBack, NewCommunityModalComponent }) => {
    const dispatch = useDispatch();
    const contacts = useSelector(selectContacts);
    const [view, setView] = useState('main');
    const [search, setSearch] = useState('');
    const [savedContact, setSavedContact] = useState(null);

    const findStoreContact = useCallback((contact) =>
        contacts.find(c => c.phone === contact.phone || c.name === contact.name),
    [contacts]);

    const handleToggleFavorite = useCallback((contact) => {
        const stored = findStoreContact(contact);
        if (stored) {
            dispatch(toggleFavoriteContact(stored.id));
            dispatch(showToast(stored.isFavorite ? `${stored.name} removed from favourites` : `${stored.name} added to favourites`));
            return;
        }
        const newContact = {
            id: `c-${Date.now()}`,
            name: contact.name,
            phone: contact.phone,
            initials: contact.initials,
            avatarColor: contact.color,
            isFavorite: true,
        };
        dispatch(addContact(newContact));
        dispatch(showToast(`${newContact.name} added to favourites`));
    }, [dispatch, findStoreContact]);

    const filtered = contacts.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search)
    );

    if (view === 'new-contact') {
        return (
            <NewContactScreen
                onBack={() => setView('main')}
                onSave={(contact) => {
                    const contactToSave = {
                        id: `c-${Date.now()}`,
                        name: contact.name,
                        phone: contact.phone,
                        initials: contact.initials,
                        avatarColor: '#3b82f6',
                        isFavorite: false,
                    };
                    dispatch(addContact(contactToSave));
                    setSavedContact(contactToSave);
                    setView('contact-added');
                    dispatch(showToast(`${contactToSave.name} saved to contacts`));
                }}
            />
        );
    }

    const handleAddCommunity = (data) => {
        dispatch(addCommunityThunk(data));
        dispatch(showToast(`"${data.name}" community created!`));
        setView('main');
    };

    if (view === 'new-community') {
        if (!NewCommunityModalComponent) { setView('main'); return null; }
        return (
            <NewCommunityModalComponent
                isOpen={true}
                onClose={() => setView('main')}
                onCreateCommunity={handleAddCommunity}
            />
        );
    }

    if (view === 'contact-added') {
        return (
            <div className="absolute inset-0 bg-bg-surface z-1000 flex flex-col items-center justify-center animate-fade-in px-8 text-center">
                <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                    <Icons.UserRound size={36} className="text-accent" />
                </div>
                <h2 className="text-[20px] font-semibold text-text-primary mb-2">Contact Saved!</h2>
                <p className="text-[14px] text-text-secondary mb-2">
                    <span className="text-text-primary font-medium">{savedContact?.name}</span> has been added to your contacts.
                </p>
                <p className="text-[13px] text-text-secondary mb-8">{savedContact?.phone}</p>
                <button
                    onClick={() => { setSavedContact(null); setView('main'); }}
                    className="px-8 py-2.5 bg-accent text-white rounded-full text-[15px] font-medium hover:opacity-90 transition-opacity"
                >
                    Done
                </button>
            </div>
        );
    }

    return (
        <div className="absolute inset-0 bg-bg-surface z-1000 flex flex-col animate-fade-in">
            <header className="px-4 py-4 flex items-center gap-3 bg-bg-surface shrink-0 border-b border-border-main/20">
                <button onClick={onBack} className="p-2 hover:bg-bg-hover rounded-full text-text-secondary active:scale-90 transition-all">
                    <Icons.ArrowLeft size={24} />
                </button>
                <div>
                    <p className="text-[17px] font-semibold text-text-primary">Add Favorite</p>
                    <p className="text-[12px] text-text-secondary">{contacts.length} contacts</p>
                </div>
            </header>
            <div className="px-4 py-3 shrink-0">
                <SearchInput value={search} onChange={e => setSearch(e.target.value)} onClear={() => setSearch("")} placeholder="Search name or number..." />
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {!search && (
                    <div className="flex flex-col mb-2">
                        <button onClick={() => setView('new-contact')} className="flex items-center gap-4 px-4 py-3.5 hover:bg-bg-hover cursor-pointer transition-colors w-full text-left border-b border-border-main/10">
                            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                                <Icons.UserPlus size={22} className="text-accent" />
                            </div>
                            <div>
                                <p className="text-[16px] font-medium text-text-primary">New Contact</p>
                                <p className="text-[13px] text-text-secondary">Add someone new to WhatsApp</p>
                            </div>
                        </button>
                        <button onClick={() => setView('new-community')} className="flex items-center gap-4 px-4 py-3.5 hover:bg-bg-hover cursor-pointer transition-colors w-full text-left border-b border-border-main/10">
                            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                                <Icons.Users2 size={22} className="text-accent" />
                            </div>
                            <div>
                                <p className="text-[16px] font-medium text-text-primary">New Community</p>
                                <p className="text-[13px] text-text-secondary">Create a community with groups</p>
                            </div>
                        </button>
                    </div>
                )}
                {!search && <SectionLabel label="Contacts on WhatsApp" />}
                {filtered.length === 0 ? (
                    <EmptyState icon={<Icons.Search size={40} />} title={`No contacts found for "${search}"`} />
                ) : (
                    filtered.map(contact => {
                        const storedContact = findStoreContact(contact);
                        const isFavorited = !!storedContact?.isFavorite;
                        return (
                            <div key={contact.id} className="flex items-center gap-4 px-4 py-3 hover:bg-bg-hover cursor-pointer transition-colors border-b border-border-main/10 last:border-0">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-[15px] shrink-0" style={{ background: contact.color }}>
                                    {contact.initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[15.5px] text-text-primary font-medium truncate">{contact.name}</p>
                                    <p className="text-[13px] text-text-secondary truncate">{contact.phone}</p>
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); handleToggleFavorite(contact); }} className="p-2 hover:bg-bg-hover rounded-full transition-colors" aria-label={isFavorited ? 'Remove from favourites' : 'Add to favourites'}>
                                    <Icons.Heart size={20} className={isFavorited ? 'text-red-500 fill-red-500' : 'text-accent'} fill={isFavorited ? 'currentColor' : 'none'} />
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default AddFavoriteHub;
