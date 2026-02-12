const STORAGE_KEY = 'molige_notifications';
const EVENT_NAME = 'molige:notifications';

const readStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const writeStorage = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event(EVENT_NAME));
};

export const getNotifications = () => readStorage();

export const getNotificationCount = (key) => {
  const data = readStorage();
  return Number(data[key] || 0);
};

export const incrementNotification = (key, amount = 1) => {
  if (!key) return;
  const data = readStorage();
  data[key] = Number(data[key] || 0) + amount;
  writeStorage(data);
};

export const clearNotification = (key) => {
  if (!key) return;
  const data = readStorage();
  if (data[key]) {
    delete data[key];
    writeStorage(data);
  }
};

export const notificationEventName = EVENT_NAME;
