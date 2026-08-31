// src/features/chat/pages/UserInfoPanel.jsx
// Dispatcher — routes to type-specific info panel.
// Target: ~80 lines. DO NOT add logic here; add it to the sub-panels.
import React from 'react';
import { useFakeLoading } from '@shared/hooks';
import { UserInfoSkeleton } from '@shared/ui/display/Skeletons';
import Toast from '@shared/ui/feedback/Toast';
import { useSelector } from 'react-redux';
import { selectToast } from '@core/store/slices/uiSlice';
import MediaGalleryScreen from './MediaGalleryScreen';
import MediaLinksDocsPanel from '../components/MediaLinksDocsPanel';
import DMInfoPanel from '../components/user-info/DMInfoPanel';
import GroupInfoPanel from '../components/user-info/GroupInfoPanel';
import BroadcastInfoPanel from '../components/user-info/BroadcastInfoPanel';

// Channel/Community screens live in their own features — lazy to avoid cross-feature coupling
const ChannelInfoScreen = React.lazy(() =>
  import('@features/status/pages/ChannelInfoScreen').then(m => ({ default: m.default }))
);
const CommunityInfoScreen = React.lazy(() =>
  import('@features/community/pages/CommunityInfoScreen').then(m => ({ default: m.default }))
);

const UserInfoPanel = ({ chat, onBack, onStartChat }) => {
  const toast = useSelector(selectToast);
  const isLoading = useFakeLoading(350);

  const [showMedia, setShowMedia] = React.useState(false);
  const [showMediaLinksDoc, setShowMediaLinksDoc] = React.useState(false);

  if (isLoading) return <UserInfoSkeleton />;
  if (showMedia) return <MediaGalleryScreen chat={chat} onBack={() => setShowMedia(false)} />;
  if (showMediaLinksDoc) return <MediaLinksDocsPanel chat={chat} mediaCount={24} onClose={() => setShowMediaLinksDoc(false)} />;

  const sharedProps = {
    chat,
    onBack,
    onShowMedia: () => setShowMedia(true),
    onShowMediaLinksDoc: () => setShowMediaLinksDoc(true),
  };

  const renderPanel = () => {
    if (chat?.isChannel) return (
      <React.Suspense fallback={<UserInfoSkeleton />}>
        <ChannelInfoScreen channel={chat} onBack={onBack} />
      </React.Suspense>
    );
    if (chat?.isCommunity || chat?.isCommunityAnnouncement) return (
      <React.Suspense fallback={<UserInfoSkeleton />}>
        <CommunityInfoScreen community={chat} onBack={onBack} />
      </React.Suspense>
    );
    if (chat?.isGroup) return <GroupInfoPanel {...sharedProps} />;
    if (chat?.isBroadcast) return <BroadcastInfoPanel {...sharedProps} />;
    return <DMInfoPanel {...sharedProps} onStartChat={onStartChat} />;
  };

  return (
    <div className="absolute inset-0 z-[1000] flex flex-col animate-fade-in bg-bg-surface">
      {renderPanel()}
      {toast && <Toast message={toast.message} visible={!!toast} type={toast.type} />}
    </div>
  );
};

export default UserInfoPanel;
