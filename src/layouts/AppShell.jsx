import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { logout } from '@/services/auth.service';

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
  const navigate = useNavigate();

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

  const displayName =
    profile?.full_name ||
    profile?.nom ||
    profile?.name ||
    profile?.email ||
    displayUser.name ||
    'Utilisateur';

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      localStorage.removeItem('molige_profile');
      navigate('/');
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
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      'flex items-center px-4 py-3 rounded-md text-sm font-medium border-l-4 transition-colors',
                      isCollapsed ? 'justify-center' : 'gap-3',
                      isActive
                        ? 'bg-blue-800 text-white border-orange-400'
                        : 'text-blue-100 hover:bg-blue-800/60 border-transparent',
                    ].join(' ')
                  }
                >
                  <Icon size={18} className="text-blue-100" />
                  {!isCollapsed && item.label}
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
              <div className="text-right">
                <div className="text-sm font-semibold text-blue-900">{displayName}</div>
                <div className="text-xs text-blue-500">{roleLabelNormalized}</div>
              </div>
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                onClick={handleLogout}
              >
                Deconnexion
              </button>
            </div>
          </header>

          <main className="flex-1 bg-white px-6 py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
