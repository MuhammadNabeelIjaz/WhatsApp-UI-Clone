import { useState, useCallback } from 'react';

export const usePermissions = () => {
  const [permissionState, setPermissionState] = useState({});

  const requestCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(t => t.stop());
      setPermissionState(p => ({ ...p, camera: 'granted' }));
      return { granted: true };
    } catch {
      setPermissionState(p => ({ ...p, camera: 'denied' }));
      return { granted: false };
    }
  }, []);

  const requestMicrophone = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissionState(p => ({ ...p, microphone: 'granted' }));
      return { granted: true, stream };
    } catch {
      setPermissionState(p => ({ ...p, microphone: 'denied' }));
      return { granted: false };
    }
  }, []);

  const requestLocation = useCallback(() => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) { resolve({ granted: false }); return; }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPermissionState(p => ({ ...p, geolocation: 'granted' }));
          resolve({ granted: true, coords: pos.coords });
        },
        () => {
          setPermissionState(p => ({ ...p, geolocation: 'denied' }));
          resolve({ granted: false });
        }
      );
    });
  }, []);

  const requestGallery = useCallback(() => {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*,video/*';
      input.multiple = true;
      input.onchange = (e) => resolve({ granted: true, files: Array.from(e.target.files) });
      input.oncancel = () => resolve({ granted: false, files: [] });
      input.click();
    });
  }, []);

  const requestDocument = useCallback(() => {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '*/*';
      input.multiple = true;
      input.onchange = (e) => resolve({ granted: true, files: Array.from(e.target.files) });
      input.oncancel = () => resolve({ granted: false, files: [] });
      input.click();
    });
  }, []);

  const requestAudio = useCallback(() => {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'audio/*';
      input.onchange = (e) => resolve({ granted: true, files: Array.from(e.target.files) });
      input.oncancel = () => resolve({ granted: false, files: [] });
      input.click();
    });
  }, []);

  const requestContacts = useCallback(async () => {
    if ('contacts' in navigator && 'ContactsManager' in window) {
      try {
        const contacts = await navigator.contacts.select(['name', 'tel'], { multiple: true });
        return { granted: true, contacts };
      } catch { return { granted: false }; }
    }
    return { granted: false, fallback: true };
  }, []);

  return {
    permissionState,
    requestCamera,
    requestMicrophone,
    requestLocation,
    requestGallery,
    requestDocument,
    requestAudio,
    requestContacts,
  };
};

export default usePermissions;
