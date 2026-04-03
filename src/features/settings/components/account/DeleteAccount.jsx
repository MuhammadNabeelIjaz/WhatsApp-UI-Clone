import React, { useState } from 'react';
import { Icons } from '@constants/icons';
import CountryPicker from '@shared/ui/inputs/CountryPicker';
const DeleteAccount = ({ onBack }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedCountry, setSelectedCountry] = useState({ code: '+92', flag: '🇵🇰', name: 'Pakistan' });
    const [showCountryPicker, setShowCountryPicker] = useState(false);

    if (showCountryPicker) {
        return (
            <CountryPicker
                selectedCountry={selectedCountry}
                onSelect={(country) => {
                    setSelectedCountry(country);
                    setShowCountryPicker(false);
                }}
                onClose={() => setShowCountryPicker(false)}
                title="Select country"
            />
        );
    }

    return (
        <div className="flex flex-col h-full w-full animate-fade-in bg-bg-surface">
            {/* --- Header --- */}
            <header className="px-4 py-5 flex items-center gap-6 sticky top-0 z-50 shadow-sm bg-bg-surface">
                <button
                    onClick={onBack}
                    className="p-1 hover:bg-bg-hover rounded-full transition-colors active:scale-95 text-text-primary"
                >
                    <Icons.ArrowLeft size={24} />
                </button>
                <h1 className="text-[20px] font-medium text-text-primary">
                    Delete this account
                </h1>
            </header>

            {/* --- Scrollable Content --- */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-6">

                {/* Warning Section */}
                <div className="flex gap-4 mb-6">
                    <Icons.AlertTriangle size={20} className="text-[#ef5350] mt-1 shrink-0" />
                    <div>
                        <h2 className="text-[#ef5350] text-[16px] font-medium mb-3">
                            If you delete this account:
                        </h2>
                        <ul className="space-y-2 text-[14.5px] text-text-secondary list-disc ml-4">
                            <li>The account will be deleted from WhatsApp and all your devices</li>
                            <li>Your chat history will be erased</li>
                            <li>You will be removed from all your WhatsApp groups</li>
                            <li>Your Google storage backup will be deleted</li>
                            <li>Any channels you created will be deleted</li>
                        </ul>
                    </div>
                </div>

                <div className="h-px w-full bg-border-main/5 my-6" />

                {/* Change Number Instead Section */}
                <div className="flex items-start gap-5 mb-8">
                    <Icons.Smartphone size={22} className="text-text-secondary opacity-70 mt-1" />
                    <div className="flex flex-col gap-4">
                        <span className="text-[16px] text-text-primary">Change number instead?</span>
                        <button className="bg-[#00a884] text-white px-6 py-2 rounded-full font-medium text-[14px] w-fit active:scale-95 transition-transform">
                            Change phone number
                        </button>
                    </div>
                </div>

                <div className="h-px w-full bg-border-main/5 my-6" />

                {/* Deletion Confirmation Form */}
                <div className="flex flex-col gap-6">
                    <p className="text-[14.5px] text-text-primary">
                        To delete your account, confirm your country code and enter your phone number.
                    </p>

                    {/* Country Selector */}
                    <button
                        onClick={() => setShowCountryPicker(true)}
                        className="w-full flex flex-col items-start border-b border-[#00a884] pb-1 cursor-pointer group"
                    >
                        <label className="text-[13px] text-text-secondary">Country</label>
                        <div className="flex justify-between items-center pt-1 w-full">
                            <div className="flex items-center gap-2">
                                <span className="text-[18px]">{selectedCountry.flag}</span>
                                <span className="text-[16px] text-text-primary">{selectedCountry.name}</span>
                            </div>
                            <Icons.ChevronDown size={20} className="text-text-secondary" />
                        </div>
                    </button>

                    {/* Phone Input */}
                    <div className="flex gap-4">
                        <div className="w-28 border-b border-[#00a884] pb-1">
                            <label className="text-[13px] text-text-secondary">Phone</label>
                            <div className="flex items-center pt-1">
                                <span className="text-text-secondary mr-1">{selectedCountry.code}</span>
                                <input
                                    type="text"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="bg-transparent text-[16px] text-text-primary outline-none w-full"
                                />
                            </div>
                        </div>
                        <div className="flex-1 border-b border-border-main/20 focus-within:border-[#00a884] pb-1 transition-colors">
                            <label className="text-[13px] text-text-secondary invisible">Number</label>
                            <input
                                type="tel"
                                placeholder="Phone number"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="bg-transparent text-[16px] text-text-primary outline-none w-full pt-1"
                            />
                        </div>
                    </div>

                    {/* Final Delete Button */}
                    <div className="pt-4">
                        <button className="bg-[#ef5350] text-white px-8 py-2.5 rounded-full font-medium text-[14px] shadow-md active:scale-95 transition-transform">
                            Delete account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteAccount;