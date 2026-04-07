// src/core/utils/notificationService.js — Session 14, Upgrade 4E
// Thin wrapper around the browser Notification API.

export const requestNotificationPermission = async () => {
  if (typeof Notification === 'undefined') return 'unsupported';
  if (Notification.permission === 'granted' || Notification.permission === 'denied') {
    return Notification.permission;
  }
  return Notification.requestPermission();
};

export const notifyNewMessage = (chat, text) => {
  if (typeof Notification === 'undefined') return;
  if (Notification.permission !== 'granted') return;
  try {
    new Notification(chat?.name || 'New message', {
      body: text || 'New message',
      icon: chat?.avatar || '/icon.png',
    });
  } catch {
    // Notification construction can fail in some environments (e.g. SW required) — ignore.
  }
};
