import React from 'react';
import { useFakeLoading } from '@shared/hooks';
import { Icons } from '@constants/icons';
import { ContactItemSkeleton } from '@shared/ui/display/Skeletons';
const BlockedContacts = ({ onBack }) => {
    const blockedList = [
        { id: 1, phone: '+1 (623) 274-8405', img: null },
        { id: 2, phone: '+880 1309-477057', img: null },
        { id: 3, phone: '+880 1516-565889', img: 'https://placehold.co/100x100' },
        { id: 4, phone: '+92 301 9122724', img: null },
        { id: 5, phone: '+92 303 7775034', img: 'https://placehold.co/100x100' },
    ];

    const isLoading = useFakeLoading(380);

    if (isLoading) return (
        <div className="flex flex-col h-full w-full bg-bg-surface animate-fade-in">
            <header className="px-4 py-5 flex items-center justify-between bg-bg-surface shadow-sm sticky top-0 z-10 min-h-[64px]">
                <div className="flex items-center gap-6">
                    <div className="skeleton-bone w-8 h-8 rounded-full" />
                    <div className="skeleton-bone h-5 w-36 rounded" />
                </div>
            </header>
            <div className="px-4 py-2"><div className="skeleton-bone h-3 w-20 rounded" /></div>
            {Array.from({ length: 5 }, (_, i) => <ContactItemSkeleton key={i} />)}
        </div>
    );

    return (
        <div className="flex flex-col h-full w-full bg-bg-surface animate-fade-in">
            <header className="px-4 py-5 flex items-center justify-between bg-bg-surface shadow-sm sticky top-0 z-10">
                <div className="flex items-center gap-6">
                    <button onClick={onBack} className="text-text-primary"><Icons.ArrowLeft size={24} /></button>
                    <h1 className="text-[20px] font-medium text-text-primary">Blocked contacts</h1>
                </div>
                <button className="text-text-primary p-2 hover:bg-bg-hover rounded-full transition-colors">
                    <Icons.UserPlus size={22} />
                </button>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <p className="px-4 py-4 text-[14px] text-text-secondary font-medium">Contacts</p>
                {blockedList.map((contact) => (
                    <div key={contact.id} className="flex items-center gap-4 px-4 py-3 active:bg-bg-hover cursor-pointer transition-colors">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-bg-hover flex items-center justify-center border border-border-main/10">
                            {contact.img ? (
                                <img src={contact.img} alt="profile" className="w-full h-full object-cover" onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=User&background=555&size=100"; }} />
                            ) : (
                                <Icons.User size={24} className="text-text-secondary opacity-50" />
                            )}
                        </div>
                        <span className="text-[16.5px] text-text-primary flex-1">{contact.phone}</span>
                    </div>
                ))}
                <div className="p-6 text-center">
                    <p className="text-[14px] text-text-secondary leading-relaxed opacity-70">
                        Blocked contacts will no longer be able to call you or send you messages.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BlockedContacts;

BlockedContacts.defaultProps = {
    onBack: () => { },
};
//