import React, { useRef, useEffect, useState } from 'react';
import { Icons } from '@constants/icons';

const CameraOverlay = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [facingMode, setFacingMode] = useState('user');
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [captured, setCaptured] = useState(null);
  const [error, setError] = useState(null);

  const startStream = async (mode) => {
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: mode }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (_e) {
      setError('Camera access denied or unavailable.');
    }
  };

  useEffect(() => {
    startStream(facingMode);
    navigator.mediaDevices.enumerateDevices().then(devices => {
      const cams = devices.filter(d => d.kind === 'videoinput');
      setHasMultipleCameras(cams.length > 1);
    });
    return () => { if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop()); };
  }, [facingMode]);

  const capture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg');
    setCaptured(dataUrl);
  };

  const sendCapture = () => {
    onCapture?.(captured);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-[3000] bg-black flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-4 z-10">
        <button onClick={onClose} className="p-2 text-white hover:bg-white/10 rounded-full transition-all">
          <Icons.X size={26} />
        </button>
        {hasMultipleCameras && !captured && (
          <button
            onClick={() => setFacingMode(f => f === 'user' ? 'environment' : 'user')}
            className="p-2 text-white hover:bg-white/10 rounded-full transition-all"
          >
            <Icons.RotateCcw size={22} />
          </button>
        )}
      </div>

      {/* Camera preview / captured image */}
      <div className="flex-1 relative overflow-hidden">
        {captured ? (
          <img src={captured} alt="Captured" className="w-full h-full object-contain" />
        ) : error ? (
          <div className="flex items-center justify-center h-full text-white/60 text-sm px-8 text-center">{error}</div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
          />
        )}
      </div>

      {/* Bottom controls */}
      <div className="pb-10 pt-6 flex items-center justify-center gap-12">
        {captured ? (
          <>
            <button onClick={() => setCaptured(null)} className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white">
              <Icons.RotateCcw size={22} />
            </button>
            <button onClick={sendCapture} className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-white shadow-xl">
              <Icons.Send size={26} />
            </button>
          </>
        ) : (
          <button
            onClick={capture}
            className="w-[72px] h-[72px] rounded-full border-[4px] border-white bg-white/20 hover:bg-white/30 transition-all active:scale-90 flex items-center justify-center"
          >
            <div className="w-14 h-14 rounded-full bg-white" />
          </button>
        )}
      </div>
    </div>
  );
};

export default CameraOverlay;
