const STORAGE_KEY = 'molige_notifications';
const EVENT_NAME = 'molige:notifications';
const DEFAULT_SCOPE = 'GLOBAL';

const resolveScope = (scope) => (scope ? String(scope).toUpperCase() : DEFAULT_SCOPE);
const buildKey = (scope) => `${STORAGE_KEY}:${resolveScope(scope)}`;

const readStorage = (scope) => {
  try {
    const raw = localStorage.getItem(buildKey(scope));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const writeStorage = (data, scope) => {
  localStorage.setItem(buildKey(scope), JSON.stringify(data));
  window.dispatchEvent(new Event(EVENT_NAME));
};

export const getNotifications = (scope) => readStorage(scope);

export const getNotificationCount = (key, scope) => {
  const data = readStorage(scope);
  return Number(data[key] || 0);
};

export const incrementNotification = (key, amount = 1, scope) => {
  if (!key) return;
  const data = readStorage(scope);
  data[key] = Number(data[key] || 0) + amount;
  writeStorage(data, scope);
};

export const setNotificationCount = (key, count = 0, scope) => {
  if (!key) return;
  const data = readStorage(scope);
  data[key] = Math.max(0, Number(count) || 0);
  writeStorage(data, scope);
};

export const clearNotification = (key, scope) => {
  if (!key) return;
  const data = readStorage(scope);
  if (data[key]) {
    delete data[key];
    writeStorage(data, scope);
  }
};

export const clearAllNotifications = (scope) => {
  writeStorage({}, scope);
};

export const syncStockAlerts = (articles, threshold = -5, scope) => {
  if (!Array.isArray(articles)) return;
  const count = articles.reduce((total, article) => {
    const quantity = Number(article?.quantite_stock ?? 0);
    if (Number.isNaN(quantity)) return total;
    return quantity <= threshold ? total + 1 : total;
  }, 0);
  setNotificationCount('admin.stocks', count, scope);
};

export const notificationEventName = EVENT_NAME;
