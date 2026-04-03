import React, { useState } from 'react';
import { Icons } from '@constants/icons';
import ToggleSwitch from '@shared/ui/buttons/ToggleSwitch';

const RequestAccountInfo = ({ onBack }) => {
    const [autoAccountReport, setAutoAccountReport] = useState(true);
    const [autoChannelsReport, setAutoChannelsReport] = useState(true);
    const [autoAdsReport, setAutoAdsReport] = useState(false);

    return (
        <div className="flex flex-col h-full w-full bg-bg-surface">
            <header className="px-4 py-3 flex items-center gap-4 sticky top-0 z-50 bg-bg-surface border-b border-border-main/5">
                <button onClick={onBack} className="p-2 hover:bg-bg-hover rounded-full transition-all active:scale-90 text-text-primary">
                    <Icons.ArrowLeft size={24} />
                </button>
                <h1 className="text-[20px] font-bold text-text-primary">Request account info</h1>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">

                {/* Section 1 */}
                <div className="pt-6">
                    <h3 className="px-6 text-[15px] font-medium mb-4 text-accent">Account information</h3>

                    <div className="px-6 py-2 flex items-start gap-5 hover:bg-bg-hover cursor-pointer transition-colors">
                        <Icons.FileText size={20} className="mt-1 text-text-secondary opacity-70" />
                        <div className="flex flex-col border-b border-border-main/5 pb-4 flex-1">
                            <span className="text-[16.5px] text-text-primary">Request account report</span>
                        </div>
                    </div>

                    <div className="px-6 py-4">
                        <p className="text-[14px] leading-relaxed text-text-secondary">
                            Create a report of your WhatsApp account information and settings. <span className="text-accent cursor-pointer">Learn more</span>
                        </p>
                    </div>

                    <div className="px-6 py-4 flex justify-between items-center">
                        <div className="flex items-center gap-5 flex-1 mr-4">
                            <Icons.History size={20} className="text-text-secondary opacity-70 shrink-0" />
                            <div className="flex flex-col">
                                <span className="text-[16.5px] text-text-primary">Create reports automatically</span>
                                <p className="text-[13px] text-text-secondary mt-0.5">A new report will be created every month.</p>
                            </div>
                        </div>
                        <ToggleSwitch checked={autoAccountReport} onChange={() => setAutoAccountReport(!autoAccountReport)} />
                    </div>
                </div>

                <div className="h-[1px] w-full bg-border-main/5 my-2" />

                {/* Section 2 */}
                <div className="pt-4">
                    <h3 className="px-6 text-[15px] font-medium mb-4 text-accent">Channels activity</h3>

                    <div className="px-6 py-3 flex items-start gap-5 bg-bg-hover/30">
                        <Icons.Clock size={20} className="mt-1 text-text-secondary opacity-70" />
                        <div className="flex flex-col flex-1">
                            <span className="text-[16.5px] text-text-primary">Request sent</span>
                            <p className="text-[14px] text-text-secondary">Ready by 12 March 2026</p>
                        </div>
                    </div>

                    <div className="px-6 py-4 flex justify-between items-center">
                        <div className="flex items-center gap-5 flex-1 mr-4">
                            <Icons.History size={20} className="text-text-secondary opacity-70 shrink-0" />
                            <div className="flex flex-col">
                                <span className="text-[16.5px] text-text-primary">Create reports automatically</span>
                                <p className="text-[13px] text-text-secondary mt-0.5">A new report will be created every month.</p>
                            </div>
                        </div>
                        <ToggleSwitch checked={autoChannelsReport} onChange={() => setAutoChannelsReport(!autoChannelsReport)} />
                    </div>
                </div>

                <div className="h-[1px] w-full bg-border-main/5 my-2" />

                {/* Section 3 */}
                <div className="pt-4">
                    <h3 className="px-6 text-[15px] font-medium mb-4 text-accent">Ads information</h3>

                    <div className="px-6 py-2 flex items-start gap-5 hover:bg-bg-hover cursor-pointer transition-colors">
                        <Icons.FileText size={20} className="mt-1 text-text-secondary opacity-70" />
                        <div className="flex flex-col border-b border-border-main/5 pb-4 flex-1">
                            <span className="text-[16.5px] text-text-primary">Request ads report</span>
                        </div>
                    </div>

                    <div className="px-6 py-4 flex justify-between items-center">
                        <div className="flex items-center gap-5 flex-1 mr-4">
                            <Icons.History size={20} className="text-text-secondary opacity-70 shrink-0" />
                            <div className="flex flex-col">
                                <span className="text-[16.5px] text-text-primary">Create reports automatically</span>
                                <p className="text-[13px] text-text-secondary mt-0.5">A new report will be created every month.</p>
                            </div>
                        </div>
                        <ToggleSwitch checked={autoAdsReport} onChange={() => setAutoAdsReport(!autoAdsReport)} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestAccountInfo;
