// task-manager-app/app/dashboard/page.tsx
// Ce fichier est un composant serveur par défaut (pas de 'use client')

import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

// Importer le nouveau composant client
import ClientDashboardPageContent from './ClientDashboardPageContent';

// Ce composant est async car il récupère la session côté serveur
export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // Rediriger si l'utilisateur n'est pas connecté (logique de protection de route)
  if (!session) {
    redirect('/auth');
  }

  // Récupérer le nom de l'utilisateur côté serveur
  const userName = session?.user?.name || session?.user?.email || "Invité";

  // Rendre le composant client, en lui passant les données récupérées côté serveur
  return (
    <ClientDashboardPageContent userName={userName} />
  );
}
