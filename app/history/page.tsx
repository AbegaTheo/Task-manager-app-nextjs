import Sidebar from '@/Components/SideBar';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);
  const userName = session?.user?.name || session?.user?.email || "Invité";

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-5xl font-extrabold mb-5 text-indigo-700 drop-shadow">
          Historiques
        </h1>
        <p className="mb-6 text-indigo-700 font-extrabold drop-shadow">
          Bienvenue, {userName} !
        </p>
        {/* Ici tu pourras afficher l’historique des actions sur les tâches */}
        <div className="bg-white rounded shadow p-4">
          <p>Historique des actions à venir...</p>
        </div>
      </main>
    </div>
  );
}