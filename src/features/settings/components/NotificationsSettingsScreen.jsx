import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFakeLoading } from '@shared/hooks';
import { SettingsSubScreenSkeleton } from '@shared/ui/display/Skeletons';
import { Icons } from '@constants/icons';
import { selectNotificationSettings, toggleSetting, setSetting } from '@core/store/slices/settingsSlice';
import { showToast } from '@core/store/slices/uiSlice';
import SettingsRow from '@shared/ui/settings/SettingsRow';
import ToggleSwitch from '@shared/ui/buttons/ToggleSwitch';
import { PickerModal } from '@shared/ui/settings';
import SectionHeader from '@shared/ui/settings/SectionHeader';


const TONES = ["Default (Bubble)", "None", "Chime", "Echo", "Pulse", "Ring"];
const VIBRATE_OPTS = ["Default", "Always", "Only when silent", "Never"];
const POPUP_OPTS = ["Not available", "Only when screen on", "Always"];
const LIGHT_OPTS = ["White", "Red", "Green", "Blue", "Purple", "None"];
const RINGTONES = ["Default (Jovi Lifestyle)", "None", "Classic Ring", "Marimba"];

const NotificationsSettingsScreen = ({ onBack }) => {
    const dispatch       = useDispatch();
    const notifications  = useSelector(selectNotificationSettings);
    const toggles = notifications || {
        tones: true, reminders: true,
        msgPriority: true, msgReaction: true,
        grpPriority: true, grpReaction: true,
        statusPriority: true, statusReaction: true,
        clearCount: false,
    };
    const toggle = (key) => {
        dispatch(toggleSetting('notifications', key));
        if (key === 'msgPriority' && !toggles[key]) {
            import('@core/utils/notificationService').then(({ requestNotificationPermission }) => requestNotificationPermission());
        }
        dispatch(showToast(`${key.replace(/([A-Z])/g, ' $1')} ${!toggles[key] ? 'enabled' : 'disabled'}`, 'info'));
    };

    const [modal, setModal] = useState(null);
    const isLoading = useFakeLoading(470);

    // Read notification choices from Redux store; fall back to defaults for first load
    const notificationChoices = useSelector(s => s.settings.notificationChoices) || {};
    const selections = {
        msgTone: notificationChoices.msgTone ?? "Default (Bubble)",
        msgVibrate: notificationChoices.msgVibrate ?? "Default",
        msgPopup: notificationChoices.msgPopup ?? "Not available",
        msgLight: notificationChoices.msgLight ?? "White",
        grpTone: notificationChoices.grpTone ?? "Default (Bubble)",
        grpVibrate: notificationChoices.grpVibrate ?? "Default",
        grpLight: notificationChoices.grpLight ?? "White",
        callRingtone: notificationChoices.callRingtone ?? "Default (Jovi Lifestyle)",
        callVibrate: notificationChoices.callVibrate ?? "Default",
        statusTone: notificationChoices.statusTone ?? "Default (Bubble)",
        statusVibrate: notificationChoices.statusVibrate ?? "Default",
    };

    const openModal = (key, title, options) => setModal({ key, title, options });
    const closeModal = () => setModal(null);

    if (isLoading) return <SettingsSubScreenSkeleton rowCount={8} />;

    return (
        <div className="flex flex-col h-full w-full overflow-hidden bg-bg-surface">
            <header className="px-4 py-3 flex items-center justify-between shrink-0 border-b border-border-main/5 bg-bg-surface">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-bg-hover rounded-full transition-all active:scale-90 text-text-primary">
                        <Icons.ArrowLeft size={24} />
                    </button>
                    <h1 className="text-[20px] font-bold text-text-primary">Notifications</h1>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar">

                {/* Global */}
                <div className="mt-2">
                    <SettingsRow title="Conversation tones" subtitle="Play sounds for incoming and outgoing messages"
                        rightElement={<ToggleSwitch checked={toggles.tones} onChange={() => toggle('tones')} />} />
                    <SettingsRow title="Reminders" subtitle="Get occasional reminders about unread messages"
                        rightElement={<ToggleSwitch checked={toggles.reminders} onChange={() => toggle('reminders')} />} />
                </div>

                <div className="h-[1px] w-[90%] mx-auto bg-border-main/5 my-2" />

                {/* Messages */}
                <section>
                    <SectionHeader label="Messages" />
                    <SettingsRow title="Notification tone" subtitle={selections.msgTone} onClick={() => openModal('msgTone', 'Notification tone', TONES)} />
                    <SettingsRow title="Vibrate" subtitle={selections.msgVibrate} onClick={() => openModal('msgVibrate', 'Vibrate', VIBRATE_OPTS)} />
                    <SettingsRow title="Popup notification" subtitle={selections.msgPopup} onClick={() => openModal('msgPopup', 'Popup notification', POPUP_OPTS)} />
                    <SettingsRow title="Light" subtitle={selections.msgLight} onClick={() => openModal('msgLight', 'Notification light', LIGHT_OPTS)} />
                    <SettingsRow title="Use high priority notifications" subtitle="Show previews at the top of the screen"
                        rightElement={<ToggleSwitch checked={toggles.msgPriority} onChange={() => toggle('msgPriority')} />} />
                    <SettingsRow title="Reaction notifications" subtitle="Show notifications for reactions to your messages"
                        rightElement={<ToggleSwitch checked={toggles.msgReaction} onChange={() => toggle('msgReaction')} />} />
                </section>

                <div className="h-[1px] w-[90%] mx-auto bg-border-main/5 my-2" />

                {/* Groups */}
                <section>
                    <SectionHeader label="Groups" />
                    <SettingsRow title="Notification tone" subtitle={selections.grpTone} onClick={() => openModal('grpTone', 'Group notification tone', TONES)} />
                    <SettingsRow title="Vibrate" subtitle={selections.grpVibrate} onClick={() => openModal('grpVibrate', 'Vibrate', VIBRATE_OPTS)} />
                    <SettingsRow title="Light" subtitle={selections.grpLight} onClick={() => openModal('grpLight', 'Notification light', LIGHT_OPTS)} />
                    <SettingsRow title="Use high priority notifications" subtitle="Show previews at the top of the screen"
                        rightElement={<ToggleSwitch checked={toggles.grpPriority} onChange={() => toggle('grpPriority')} />} />
                    <SettingsRow title="Reaction notifications" subtitle="Show notifications for reactions"
                        rightElement={<ToggleSwitch checked={toggles.grpReaction} onChange={() => toggle('grpReaction')} />} />
                </section>

                <div className="h-[1px] w-[90%] mx-auto bg-border-main/5 my-2" />

                {/* Calls */}
                <section>
                    <SectionHeader label="Calls" />
                    <SettingsRow title="Ringtone" subtitle={selections.callRingtone} onClick={() => openModal('callRingtone', 'Ringtone', RINGTONES)} />
                    <SettingsRow title="Vibrate" subtitle={selections.callVibrate} onClick={() => openModal('callVibrate', 'Vibrate', VIBRATE_OPTS)} />
                </section>

                <div className="h-[1px] w-[90%] mx-auto bg-border-main/5 my-2" />

                {/* Status */}
                <section>
                    <SectionHeader label="Status" />
                    <SettingsRow title="Notification tone" subtitle={selections.statusTone} onClick={() => openModal('statusTone', 'Status notification tone', TONES)} />
                    <SettingsRow title="Vibrate" subtitle={selections.statusVibrate} onClick={() => openModal('statusVibrate', 'Vibrate', VIBRATE_OPTS)} />
                    <SettingsRow title="Use high priority notifications"
                        rightElement={<ToggleSwitch checked={toggles.statusPriority} onChange={() => toggle('statusPriority')} />} />
                    <SettingsRow title="Reactions" subtitle="Show notifications when you get likes on a status"
                        rightElement={<ToggleSwitch checked={toggles.statusReaction} onChange={() => toggle('statusReaction')} />} />
                </section>

                <div className="h-[1px] w-[90%] mx-auto bg-border-main/5 my-2" />

                {/* Home screen */}
                <section className="pb-10">
                    <SectionHeader label="Home screen notifications" />
                    <SettingsRow title="Clear count" subtitle="Badge clears completely after opening app"
                        rightElement={<ToggleSwitch checked={toggles.clearCount} onChange={() => toggle('clearCount')} />} />
                </section>
            </div>

            {/* Picker Modal */}
            {modal && (
                <PickerModal
                    title={modal.title}
                    options={modal.options}
                    selected={selections[modal.key]}
                    onSelect={(val) => {
                        dispatch(setSetting('notificationChoices', modal.key, val));
                        closeModal();
                    }}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default NotificationsSettingsScreen;
