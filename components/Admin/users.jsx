import { useState } from 'react';
import { Edit, Trash2, UserPlus, X } from 'lucide-react';

export default function GestionUtilisateurs() {
  const [showModal, setShowModal] = useState(false);
  const [users] = useState([
    { id: 1, nom: 'Diallo Awa', login: 'admin.awa', role: 'Administrateur' },
    { id: 2, nom: 'Kone Idris', login: 'gestion.idris', role: 'Gestionnaire' },
    { id: 3, nom: 'Traore Mariam', login: 'gestion.mariam', role: 'Gestionnaire' },
  ]);

  const roleBadge = (role) =>
    role === 'Administrateur'
      ? 'bg-blue-100 text-blue-700'
      : 'bg-orange-100 text-orange-700';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-blue-700">Gestion des utilisateurs</h1>
          <p className="text-sm text-gray-500">Administrez les acces et roles de l'equipe.</p>
        </div>
        <button
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
          onClick={() => setShowModal(true)}
        >
          <UserPlus size={18} />
          Ajouter un utilisateur
        </button>
      </div>

      <div className="bg-white rounded-lg border border-blue-50 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-blue-50/40">
                  <td className="px-6 py-4 text-sm text-gray-900">{user.nom}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{user.login}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${roleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="text-blue-500 hover:text-blue-700" title="Modifier">
                        <Edit size={18} />
                      </button>
                      <button className="text-orange-500 hover:text-orange-600" title="Supprimer">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-blue-50">
              <h2 className="text-lg font-semibold text-blue-700">Nouvel utilisateur</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nom complet"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Login</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Identifiant"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
                <input
                  type="password"
                  className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="********"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Administrateur</option>
                  <option>Gestionnaire</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-blue-50 flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-md text-blue-600 border border-blue-200 hover:bg-blue-50"
                onClick={() => setShowModal(false)}
              >
                Annuler
              </button>
              <button className="px-4 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white">
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
