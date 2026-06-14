// src/components/chat/AttachmentMenu.jsx
import React, { useState } from 'react';
import { Icons } from '@constants/icons';
import { usePermissions } from '@shared/hooks/usePermissions';
import CameraOverlay from './CameraOverlay';
import LocationPreviewSheet from './LocationPreviewSheet';
import ContactPickerSheet from './ContactPickerSheet';

const AttachmentMenu = ({ isOpen, onClose, onAttach, onPoll, onEvent, onLabels }) => {
  const { requestGallery, requestDocument, requestAudio } = usePermissions();
  const [showCamera,   setShowCamera]   = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [showContacts, setShowContacts] = useState(false);

  // ── Inline overlays (stay mounted, no onClose yet) ──────────────────────
  if (showCamera) return (
    <CameraOverlay
      onCapture={(dataUrl) => { onAttach?.({ type: 'image', src: dataUrl }); onClose?.(); }}
      onClose={() => { setShowCamera(false); onClose?.(); }}
    />
  );

  if (showLocation) return (
    <LocationPreviewSheet
      onSend={(loc) => { onAttach?.({ type: 'location', ...loc }); onClose?.(); }}
      onClose={() => { setShowLocation(false); onClose?.(); }}
    />
  );

  if (showContacts) return (
    <ContactPickerSheet
      onSend={(contact) => onAttach?.({ type: 'contact', ...contact })}
      onClose={() => { setShowContacts(false); onClose?.(); }}
    />
  );

  if (!isOpen) return null;

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleCamera = () => {
    // Don't call onClose — stay in AttachmentMenu context, swap to CameraOverlay
    setShowCamera(true);
  };

  const handleLocation = () => {
    setShowLocation(true);
  };

  const handleContact = () => {
    setShowContacts(true);
  };

  const handleGallery = async () => {
    onClose?.();
    const res = await requestGallery();
    if (res.granted && res.files?.length) {
      res.files.forEach(f => {
        const url = URL.createObjectURL(f);
        onAttach?.({ type: f.type.startsWith('video') ? 'video' : 'image', src: url, name: f.name });
      });
    }
  };

  const handleDocument = async () => {
    onClose?.();
    const res = await requestDocument();
    if (res.granted && res.files?.length) {
      res.files.forEach(f => onAttach?.({ type: 'document', name: f.name, size: f.size }));
    }
  };

  const handleAudio = async () => {
    onClose?.();
    const res = await requestAudio();
    if (res.granted && res.files?.length) {
      onAttach?.({ type: 'audio', name: res.files[0].name });
    }
  };

  const items = [
    { icon: <Icons.Image     size={24} />, label: 'Gallery',  color: '#bf59cf', onClick: handleGallery  },
    { icon: <Icons.Camera    size={24} />, label: 'Camera',   color: '#ff2e74', onClick: handleCamera   },
    { icon: <Icons.MapPin    size={24} />, label: 'Location', color: '#1fa855', onClick: handleLocation },
    { icon: <Icons.User      size={24} />, label: 'Contact',  color: '#009de2', onClick: handleContact  },
    { icon: <Icons.FileText  size={24} />, label: 'Document', color: '#7f66ff', onClick: handleDocument },
    { icon: <Icons.Headphones size={24}/>, label: 'Audio',    color: '#ff7a19', onClick: handleAudio    },
    { icon: <Icons.BarChart2 size={24} />, label: 'Poll',     color: '#00bfa5', onClick: () => { onClose?.(); onPoll?.();   } },
    { icon: <Icons.Calendar  size={24} />, label: 'Event',    color: '#009688', onClick: () => { onClose?.(); onEvent?.();  } },
    { icon: <Icons.Tag       size={24} />, label: 'Labels',   color: '#e67e22', onClick: () => { onClose?.(); onLabels?.(); } },
  ];

  return (
    <>
      <div className="fixed inset-0 z-[40]" onClick={onClose} />
      <div className="absolute bottom-[80px] left-2 right-2 bg-bg-hover rounded-[24px] p-5 shadow-2xl grid grid-cols-4 gap-x-2 gap-y-5 animate-fade-in z-50 border border-border-main/10 backdrop-blur-xl">
        {items.map((item, index) => (
          <div
            key={index}
            onClick={item.onClick}
            className="flex flex-col items-center gap-2 cursor-pointer group"
          >
            <div
              className="w-[48px] h-[48px] rounded-full flex items-center justify-center text-white transition-all duration-200 group-hover:scale-110 active:scale-95 shadow-lg shadow-black/20"
              style={{ backgroundColor: item.color }}
            >
              {item.icon}
            </div>
            <span className="text-[11px] text-text-secondary font-medium tracking-wide text-center leading-tight">{item.label}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default AttachmentMenu;
