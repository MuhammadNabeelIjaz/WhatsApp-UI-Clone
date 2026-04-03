import React from 'react';
import { Icons } from '@constants/icons';
/**
 * RemoveAccount: Pixel-perfect clone based on user screenshot
 */
const RemoveAccount = ({ onBack }) => {
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
                    Remove account
                </h1>
            </header>

            {/* --- Content Area --- */}
            <div className="flex-1 overflow-y-auto px-6 py-6">

                {/* Warning Section */}
                <div className="flex gap-4 mb-8">
                    <Icons.AlertTriangle size={20} className="text-text-secondary opacity-70 mt-1 shrink-0" />
                    <div>
                        <h2 className="text-text-primary text-[16px] font-medium mb-3">
                            If you remove this account:
                        </h2>
                        <ul className="space-y-3 text-[14.5px] text-text-secondary list-disc ml-4 leading-relaxed">
                            <li>The account will be removed only from this device</li>
                            <li>If you have linked devices, the account will be removed in 14 days</li>
                            <li>Your WhatsApp groups and channels will not be affected</li>
                            <li>You will lose any messages or other data that aren't backed up</li>
                        </ul>
                    </div>
                </div>

                {/* Last Backup Section */}
                <div className="flex gap-4 mb-10">
                    <Icons.Cloud size={22} className="text-text-secondary opacity-70 shrink-0" />
                    <div className="flex flex-col gap-3 flex-1">
                        <div>
                            <h3 className="text-[16px] text-text-primary font-medium">Last Backup</h3>
                            <p className="text-[14px] text-text-secondary mt-1">Last Backup: 5 January, 7:27 am</p>
                            <p className="text-[14px] text-text-secondary">Size: 1.0 GB</p>
                        </div>
                        <button className="bg-[#00a884] text-white px-5 py-2 rounded-full font-medium text-[14px] w-fit active:scale-95 transition-transform shadow-sm">
                            Go to chat backup
                        </button>
                    </div>
                </div>

                <div className="h-[1px] w-full bg-border-main/5 mb-8" />

                {/* Remove Action Section */}
                <div className="flex gap-4">
                    <Icons.UserMinus size={22} className="text-text-secondary opacity-70 shrink-0" />
                    <div className="flex flex-col gap-5 flex-1">
                        <div>
                            <h3 className="text-[16px] text-text-primary">Remove from this device:</h3>
                            <p className="text-[16px] text-text-primary font-medium mt-1">+92 304 7662828</p>
                        </div>
                        <button className="bg-[#ef5350] text-white px-6 py-2.5 rounded-full font-medium text-[14px] w-fit shadow-md active:scale-95 transition-transform">
                            Remove account
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default RemoveAccount;