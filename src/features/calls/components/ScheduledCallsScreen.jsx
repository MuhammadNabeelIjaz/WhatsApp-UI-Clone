import React, { useState } from 'react';
import { Icons } from '@constants/icons';
import ScreenHeader from '@shared/ui/layout/ScreenHeader';
import ScheduleCallScreen from './ScheduleCallScreen';

const ScheduledCallsScreen = ({ onBack }) => {
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);

    if (isScheduleOpen) return <ScheduleCallScreen onBack={() => setIsScheduleOpen(false)} />;

    return (
        <div className="absolute inset-0 bg-bg-surface z-[1000] flex flex-col animate-fade-in">
            <ScreenHeader title="Scheduled calls" onBack={onBack} />

            <div className="flex-1 flex flex-col items-center justify-center px-8 pb-20">
                {/* Illustration */}
                <div className="relative mb-8">
                    <div className="w-28 h-28 bg-accent/10 rounded-3xl flex items-center justify-center">
                        <Icons.Calendar size={52} className="text-accent" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-lg">
                        <Icons.Phone size={18} className="text-white" />
                    </div>
                </div>

                <h3 className="text-[20px] font-semibold text-text-primary mb-2">Schedule a call</h3>
                <p className="text-[14px] text-text-secondary text-center leading-relaxed mb-10">
                    Invite people or groups to join a call.
                </p>
            </div>

            <div className="px-6 pb-8">
                <button
                    onClick={() => setIsScheduleOpen(true)}
                    className="w-full bg-accent hover:opacity-90 text-text-inverse py-[13px] rounded-full font-semibold text-[15px] shadow-md active:scale-[0.98] transition-all"
                >
                    Schedule a call
                </button>
            </div>
        </div>
    );
};

export default ScheduledCallsScreen;
