import Sidebar from '@/Components/SideBar';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const userName = session?.user?.name || session?.user?.email || "Invité";
  const userEmail = session?.user?.email || "";

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-5xl font-extrabold mb-5 text-indigo-700 drop-shadow">
          Paramètres
        </h1>
        <p className="mb-6 font-extrabold text-indigo-700 drop-shadow">
          Bienvenue, {userName} !
        </p>
        <div className="bg-white rounded shadow p-6 max-w-xl">
          <h2 className="text-xl font-semibold mb-4">Profil utilisateur</h2>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Nom</label>
            <input
              type="text"
              value={userName}
              disabled
              className="w-full border rounded p-2 bg-gray-100"
              placeholder="Nom d'utilisateur"
              title="Nom d'utilisateur"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="user-email"
              className="block text-gray-700 font-medium mb-1"
            >
              Email
            </label>
            <input
              id="user-email"
              type="email"
              value={userEmail}
              disabled
              className="w-full border rounded p-2 bg-gray-100"
              placeholder="Adresse email"
              title="Adresse email"
            />
          </div>

          <h2 className="text-xl font-semibold mb-4">Sécurité</h2>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mb-4"
            // onClick={handleChangePassword} // À implémenter plus tard
            disabled
          >
            Changer le mot de passe (à venir)
          </button>

          <h2 className="text-xl font-semibold mb-4 mt-8">Danger</h2>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            // onClick={handleDeleteAccount} // À implémenter plus tard
            disabled
          >
            Supprimer mon compte (à venir)
          </button>
        </div>
      </main>
    </div>
  );
}