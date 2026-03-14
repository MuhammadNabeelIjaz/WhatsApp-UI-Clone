
/**
 * SectionHeader — accent-colored uppercase section label used in settings screens.
 * Appears in NotificationsSettingsScreen, StorageSettingsScreen, ChatsSettingsScreen,
 * PrivacySettingsScreen, RequestAccountInfo, InviteSettingsScreen, etc.
 *
 * Props:
 *   label     — section title string
 *   className — extra classes
 */
const SectionHeader = ({ label, className = '' }) => (
    <h3 className={`px-5 pt-4 pb-2 text-[13px] font-bold text-accent uppercase tracking-wider ${className}`}>
        {label}
    </h3>
);

export default SectionHeader;
