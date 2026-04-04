import React, { useState } from 'react';
import { useFakeLoading } from '@shared/hooks';
import { SettingsSubScreenSkeleton } from '@shared/ui/display/Skeletons';
import { Icons } from '@constants/icons';
import SettingsRow from '@shared/ui/settings/SettingsRow';
import SecuritySettings from './account/SecuritySettings';
import PasskeysSettings from './account/PasskeysSettings';
import EmailAddressSettings from './account/EmailAddressSettings';
import TwoStepVerification from './account/TwoStepVerification';
import ChangeNumber from './account/ChangeNumber';
import RequestAccountInfo from './account/RequestAccountInfo';
import RemoveAccount from './account/RemoveAccount';
import DeleteAccountSettings from './account/DeleteAccount';
import AdPreferences from './privacy/AdPreferences';

const AccountSettingsScreen = ({ onBack }) => {

    const [activeSubScreen, setActiveSubScreen] = useState('list');
    const isLoading = useFakeLoading(430);

    if (isLoading) return <SettingsSubScreenSkeleton rowCount={8} />;

    // --- Navigation Logic ---
    if (activeSubScreen === 'security') { return <SecuritySettings onBack={() => setActiveSubScreen('list')} />; }
    if (activeSubScreen === 'passkeys') { return <PasskeysSettings onBack={() => setActiveSubScreen('list')} />; }
    if (activeSubScreen === 'email') { return <EmailAddressSettings onBack={() => setActiveSubScreen('list')} />; }
    if (activeSubScreen === 'two-step') { return <TwoStepVerification onBack={() => setActiveSubScreen('list')} />; }
    if (activeSubScreen === 'change-number') { return <ChangeNumber onBack={() => setActiveSubScreen('list')} />; }
    if (activeSubScreen === 'request-info') { return <RequestAccountInfo onBack={() => setActiveSubScreen('list')} />; }
    if (activeSubScreen === 'delete-account') { return <DeleteAccountSettings onBack={() => setActiveSubScreen('list')} />; }
    if (activeSubScreen === 'ad-preferences') { return <AdPreferences onBack={() => setActiveSubScreen('list')} />; }
    if (activeSubScreen === 'remove-account') {
        return <RemoveAccount onBack={() => setActiveSubScreen('list')} />;
    }

    return (
        <div className="flex flex-col h-full w-full overflow-hidden bg-bg-surface">

            {/* --- Header Area --- */}
            <header className="px-4 py-3 flex items-center shrink-0 border-b border-border-main/5 bg-bg-surface">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-bg-hover rounded-full transition-all active:scale-90 text-text-primary"
                >
                    <Icons.ArrowLeft size={24} />
                </button>
                <h1 className="ml-4 text-[20px] font-bold text-text-primary">
                    Account
                </h1>
            </header>

            {/* --- Content List --- */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pt-2">

                <SettingsRow
                    icon={<Icons.ShieldCheck size={22} />}
                    title="Security notifications"
                    onClick={() => setActiveSubScreen('security')}
                />

                <SettingsRow
                    icon={<Icons.KeyRound size={22} />}
                    title="Passkeys"
                    onClick={() => setActiveSubScreen('passkeys')}
                />

                <SettingsRow
                    icon={<Icons.Mail size={22} />}
                    title="Email address"
                    onClick={() => setActiveSubScreen('email')}
                />

                <SettingsRow
                    icon={<Icons.Fingerprint size={22} />}
                    title="Two-step verification"
                    onClick={() => setActiveSubScreen('two-step')}
                />

                <SettingsRow
                    icon={<Icons.Smartphone size={22} />}
                    title="Change phone number"
                    onClick={() => setActiveSubScreen('change-number')}
                />

                <div className="h-[1px] w-[90%] mx-auto bg-border-main/5 my-2" />

                <SettingsRow
                    icon={<Icons.FileText size={22} />}
                    title="Request account info"
                    onClick={() => setActiveSubScreen('request-info')}
                />

                <SettingsRow
                    icon={<Icons.Settings2 size={22} />}
                    title="Ad preferences for Status & Channels"
                    onClick={() => setActiveSubScreen('ad-preferences')}
                />

                <SettingsRow
                    icon={<Icons.UserMinus size={22} />}
                    title="Remove account" onClick={() => setActiveSubScreen('remove-account')}

                />

                <SettingsRow
                    icon={<Icons.Trash2 size={22} className="text-red-500" />}
                    title={<span className="text-red-500">Delete account</span>}
                    onClick={() => setActiveSubScreen('delete-account')}
                />

                {/* Bottom Spacer */}
                <div className="h-12" />
            </div>
        </div>
    );
};

export default AccountSettingsScreen;