import React, { useState } from 'react';

export default function MoligeERPLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Connexion:', { username, password });
        // Ajoutez ici votre logique de connexion
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
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Nom d'utilisateur */}
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Nom d'utilisateur
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Entrez votre nom d'utilisateur"
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

                    {/* Bouton de connexion */}
                    <button
                        type="submit"
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-md transition-colors duration-200 shadow-sm"
                    >
                        Se connecter
                    </button>
                </form>
            </div>
        </div>
    );
}