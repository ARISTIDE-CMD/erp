import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '@/services/auth.service';
import { getMyProfile } from '@/services/profile.service';

export default function MoligeERPLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            const profile = await getMyProfile();

            if (!profile) {
                throw new Error("Profil introuvable. Contactez l'administrateur.");
            }

            const roleValue = String(profile.role || '').toUpperCase();
            const isAdmin = roleValue === 'ADMIN';
            const isManager = roleValue === 'GESTIONNAIRE';

            localStorage.setItem('molige_profile', JSON.stringify(profile));

            const target = isAdmin
                ? '/admin/dashboard'
                : isManager
                    ? '/gestionnaire/dashboard'
                    : null;

            if (!target) {
                throw new Error('Role non reconnu. Contactez l’administrateur.');
            }

            const displayName = profile.full_name || profile.nom || profile.email || 'Utilisateur';

            navigate('/welcome', {
                replace: true,
                state: { target, displayName },
            });

        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
                {/* Logo et titre */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="bg-blue-500 rounded-lg p-2.5 flex items-center justify-center">
                        <svg
                            className="w-7 h-7 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M4 4h7v7H4V4zm0 9h7v7H4v-7zm9-9h7v7h-7V4zm0 9h7v7h-7v-7z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-semibold text-blue-500">Molige ERP</h1>
                </div>

                {/* Formulaire */}
                <form onSubmit={handleLogin} className="space-y-5">
                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Entrez votre email"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Mot de passe */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Mot de passe
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Entrez votre mot de passe"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {error && (
                        <div className="text-sm text-orange-600 bg-orange-50 border border-orange-100 rounded-md px-3 py-2">
                            {error}
                        </div>
                    )}

                    {/* Bouton de connexion */}
                    <button
                        type="submit"
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-md transition-colors duration-200 shadow-sm flex items-center justify-center gap-2 disabled:opacity-70"
                        disabled={loading}
                    >
                        {loading && (
                            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        )}
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>
            </div>
        </div>
    );
}
