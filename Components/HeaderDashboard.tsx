// task-manager-app/Components/HeaderDashboard.tsx
'use client'; // Indique que c'est un composant client

// Supprimer les imports serveur
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';

import Clock from './Clock'; // Clock doit aussi être un composant client s'il gère le temps dynamiquement

// Définir les props attendues
interface HeaderDashboardProps {
  userName: string; // Le nom de l'utilisateur sera passé en prop
}

// Le composant devient une fonction normale (pas async)
export default function HeaderDashboard({ userName }: HeaderDashboardProps) {
  // Supprimer la logique de récupération de session
  // const session = await getServerSession(authOptions);
  // const userName = session?.user?.name || session?.user?.email || "Invité";

  return (
    <header className="flex justify-between items-center mb-4">
      <h2 className="text-5xl flex items-center gap-2 font-extrabold mb-4 text-indigo-700 drop-shadow">
        Bienvenue, {userName} <span>👋</span>
      </h2>
      <Clock /> {/* Assurez-vous que Clock.tsx est aussi un composant client ('use client') */}
    </header>
  );
}
