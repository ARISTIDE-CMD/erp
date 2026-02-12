import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardWaveLoader from '@/components/DashboardWaveLoader';

const resolveTargetFromProfile = () => {
  try {
    const raw = localStorage.getItem('molige_profile');
    if (!raw) return '/';
    const profile = JSON.parse(raw);
    const role = String(profile?.role || '').toUpperCase();
    if (role === 'ADMIN') return '/admin/dashboard';
    if (role === 'GESTIONNAIRE') return '/gestionnaire/dashboard';
  } catch {
    return '/';
  }
  return '/';
};

export default function WelcomeAfterLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const fallbackTarget = resolveTargetFromProfile();
  const target = location.state?.target || fallbackTarget;
  const displayName = location.state?.displayName || 'Utilisateur';
  const mode = location.state?.mode || 'login';
  const message =
    mode === 'logout'
      ? `A bientot ${displayName}, deconnexion en cours...`
      : `Bienvenue ${displayName}, chargement de votre espace...`;

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(target, { replace: true });
    }, 1500);
    return () => clearTimeout(timer);
  }, [navigate, target]);

  return (
    <DashboardWaveLoader
      label={message}
      fullScreen
      showLogo
    />
  );
}
