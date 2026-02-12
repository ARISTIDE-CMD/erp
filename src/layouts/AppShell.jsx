import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Bell, ChevronLeft, ChevronRight } from 'lucide-react';
import { logout } from '@/services/auth.service';
import { clearAllNotifications, clearNotification, getNotifications, notificationEventName } from '@/lib/notifications';

const LogoMark = () => (
  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 4h7v7H4V4zm0 9h7v7H4v-7zm9-9h7v7h-7V4zm0 9h7v7h-7v-7z" />
  </svg>
);

export default function AppShell({
  title,
  user,
  roleLabel,
  navItems,
  children,
}) {
  const displayUser = user ?? { name: 'Utilisateur', role: roleLabel ?? '' };
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profile, setProfile] = useState(null);
  const [notifications, setNotifications] = useState({});
  const [showNotifications, setShowNotifications] = useState(false);
  const [visibleNotifications, setVisibleNotifications] = useState(null);
  const [isBellRinging, setIsBellRinging] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const notificationRef = useRef(null);
  const ringTimeoutRef = useRef(null);
  const prevTotalRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try {
      const stored = localStorage.getItem('molige_profile');
      if (stored) {
        setProfile(JSON.parse(stored));
      }
    } catch {
      setProfile(null);
    }
  }, []);

  const roleValue = String(profile?.role || displayUser.role || roleLabel || '').toUpperCase();
  const roleLabelNormalized =
    roleValue === 'ADMIN'
      ? 'Admin'
      : roleValue === 'GESTIONNAIRE'
        ? 'Gestionnaire'
        : displayUser.role || roleLabel || '';

  const notificationScope =
    roleValue.includes('ADMIN')
      ? 'ADMIN'
      : roleValue.includes('GESTIONNAIRE')
        ? 'GESTIONNAIRE'
        : 'GLOBAL';

  useEffect(() => {
    setNotifications(getNotifications(notificationScope));
  }, [notificationScope]);

  useEffect(() => {
    prevTotalRef.current = null;
  }, [notificationScope]);

  useEffect(() => {
    const handleUpdate = () => setNotifications(getNotifications(notificationScope));
    const handleStorage = (event) => {
      if (event.key && event.key.startsWith('molige_notifications:') && event.key.endsWith(notificationScope)) {
        handleUpdate();
      }
    };
    window.addEventListener(notificationEventName, handleUpdate);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener(notificationEventName, handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, [notificationScope]);

  useEffect(() => {
    navItems.forEach((item) => {
      if (item.notificationKey && location.pathname === item.to) {
        if (item.notificationKey !== 'admin.total') {
          clearNotification(item.notificationKey, notificationScope);
        }
      }
    });
  }, [location.pathname, navItems, notificationScope]);

  const computeNotificationTotal = (data) =>
    Object.entries(data).reduce((sum, [key, value]) => {
      if (key === 'admin.total') return sum;
      return sum + Number(value || 0);
    }, 0);

  const notificationTotal = computeNotificationTotal(notifications);

  const notificationItems = [
    { key: 'admin.clients', label: 'Nouveau(x) client(s)' },
    { key: 'admin.commandes', label: 'Nouvelle(s) commande(s)' },
    { key: 'admin.stocks', label: 'Stock critique' },
  ];

  const listNotifications =
    showNotifications && visibleNotifications
      ? Object.entries(notifications).reduce((acc, [key, value]) => {
          const current = Number(acc[key] || 0);
          const incoming = Number(value || 0);
          acc[key] = current + incoming;
          return acc;
        }, { ...visibleNotifications })
      : notifications;

  const activeNotifications = notificationItems
    .map((item) => ({ ...item, count: Number(listNotifications[item.key] || 0) }))
    .filter((item) => item.count > 0);

  useEffect(() => {
    if (!showNotifications) return;
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
        setVisibleNotifications(null);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  const playNotificationSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(880, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.0001, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.25);
      oscillator.onended = () => ctx.close();
    } catch {
      // ignore audio failures
    }
  };

  const triggerBell = () => {
    setIsBellRinging(true);
    playNotificationSound();
    if (ringTimeoutRef.current) clearTimeout(ringTimeoutRef.current);
    ringTimeoutRef.current = setTimeout(() => setIsBellRinging(false), 800);
  };

  useEffect(() => {
    if (prevTotalRef.current === null) {
      prevTotalRef.current = notificationTotal;
      return;
    }
    if (notificationTotal > prevTotalRef.current) {
      triggerBell();
    }
    prevTotalRef.current = notificationTotal;
  }, [notificationTotal]);

  useEffect(() => () => {
    if (ringTimeoutRef.current) clearTimeout(ringTimeoutRef.current);
  }, []);

  const displayName =
    profile?.full_name ||
    profile?.nom ||
    profile?.name ||
    profile?.email ||
    displayUser.name ||
    'Utilisateur';

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      localStorage.removeItem('molige_profile');
      navigate('/', { replace: true });
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="min-h-screen">
        <aside
          className={[
            'fixed left-0 top-0 h-screen bg-blue-900 text-white flex flex-col overflow-y-auto transition-[width] duration-200',
            isCollapsed ? 'w-20' : 'w-64',
          ].join(' ')}
        >
          <div className="px-5 py-6">
            <div className={`flex items-center w-full ${isCollapsed ? '' : 'gap-3'}`}>
              <div className="bg-blue-600 p-2 rounded-lg">
                <LogoMark />
              </div>
              {!isCollapsed && (
                <div className="leading-tight">
                  <div className="text-sm uppercase tracking-widest text-blue-200">Molige</div>
                  <div className="text-lg font-semibold">ERP</div>
                </div>
              )}
              <button
                onClick={() => setIsCollapsed((prev) => !prev)}
                className="ml-auto h-8 w-8 rounded-full bg-orange-500 text-white flex items-center justify-center shadow hover:bg-orange-600 transition-colors"
                aria-label={isCollapsed ? 'Agrandir la barre laterale' : 'Reduire la barre laterale'}
                title={isCollapsed ? 'Agrandir' : 'Reduire'}
              >
                {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>
            </div>
          </div>

          <div className={`px-5 pb-3 text-xs uppercase tracking-widest text-blue-300 ${isCollapsed ? 'text-center' : ''}`}>
            {!isCollapsed ? 'Navigation' : 'Nav'}
          </div>
          <nav className={`flex-1 ${isCollapsed ? 'px-2' : 'px-3'} space-y-1`}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const count = item.notificationKey
                ? item.notificationKey === 'admin.total'
                  ? notificationTotal
                  : notifications[item.notificationKey] || 0
                : 0;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      'relative flex items-center px-4 py-3 rounded-md text-sm font-medium border-l-4 transition-colors',
                      isCollapsed ? 'justify-center' : 'gap-3',
                      isActive
                        ? 'bg-blue-800 text-white border-orange-400'
                        : 'text-blue-100 hover:bg-blue-800/60 border-transparent',
                    ].join(' ')
                  }
                >
                  <Icon size={18} className="text-blue-100" />
                  {!isCollapsed && item.label}
                  {count > 0 && (
                    <span
                      className={
                        isCollapsed
                          ? 'absolute right-2 top-2 h-2 w-2 rounded-full bg-orange-400'
                          : 'ml-auto rounded-full bg-orange-500 px-2 py-0.5 text-xs font-semibold text-white'
                      }
                    >
                      {!isCollapsed ? (count > 9 ? '9+' : count) : ''}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {!isCollapsed && (
            <div className="px-6 pb-6 text-xs text-blue-200">
              Navigation rapide pour toutes les sections ERP.
            </div>
          )}
        </aside>

        <div className={`${isCollapsed ? 'ml-20' : 'ml-64'} min-h-screen flex flex-col transition-[margin] duration-200`}>
          <header className="bg-blue-50 border-b border-blue-100 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <LogoMark />
              </div>
              <div>
                <div className="text-blue-700 font-semibold">Molige ERP</div>
                {title && <div className="text-xs text-blue-400">{title}</div>}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative" ref={notificationRef}>
                <button
                  type="button"
                  onClick={() =>
                    setShowNotifications((value) => {
                      const next = !value;
                      if (next) {
                        setVisibleNotifications(notifications);
                        clearAllNotifications(notificationScope);
                      } else {
                        setVisibleNotifications(null);
                      }
                      return next;
                    })
                  }
                  className="relative flex items-center justify-center h-9 w-9 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell size={16} className={isBellRinging ? 'bell-ring' : ''} />
                  {notificationTotal > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 min-w-[20px] rounded-full bg-orange-500 px-1 text-[10px] font-semibold text-white flex items-center justify-center">
                      {notificationTotal > 9 ? '9+' : notificationTotal}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-64 rounded-lg border border-blue-100 bg-white shadow-lg p-3 text-sm text-gray-700 z-50">
                    <div className="text-xs font-semibold text-blue-600 mb-2">Notifications</div>
                    {activeNotifications.length === 0 ? (
                      <div className="text-xs text-gray-500">Aucune notification.</div>
                    ) : (
                      <ul className="space-y-2">
                        {activeNotifications.map((item) => (
                          <li key={item.key} className="flex items-center justify-between">
                            <span>{item.label}</span>
                            <span className="text-orange-600 font-semibold">{item.count}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-blue-900">{displayName}</div>
                <div className="text-xs text-blue-500">{roleLabelNormalized}</div>
              </div>
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                <span className="flex items-center gap-2">
                  {loggingOut && (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  )}
                  {loggingOut ? 'Deconnexion...' : 'Deconnexion'}
                </span>
              </button>
            </div>
          </header>

          <main className="flex-1 bg-white px-6 py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
