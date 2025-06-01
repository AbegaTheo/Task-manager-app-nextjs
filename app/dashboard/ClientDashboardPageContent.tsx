// task-manager-app/app/dashboard/ClientDashboardPageContent.tsx
'use client'; // C'est le composant client principal

import { useState, useEffect } from 'react';
import Sidebar from '@/Components/SideBar';
import HeaderDashboard from '@/Components/HeaderDashboard';
import StatsDashboard from '@/Components/StatsDashboard';
import RecentTasks from '@/Components/RecentTasks';
import TaskForm from '@/Components/TaskForm';
// Importer le composant TaskFilters
import TaskFilters from '@/Components/TaskFilter'; // <-- Ajouter cette ligne
import { Task } from '@/lib/types'; // Importer le type Task
import { toast } from 'react-toastify'; // Importer toast

// Définir les props pour ce composant client
interface ClientDashboardPageContentProps {
  userName: string; // Ce composant reçoit le nom de l'utilisateur du composant serveur parent
}

// Définir le type pour l'état des filtres
interface DashboardFilters {
  title: string;
  date: string;
  status: string;
}


// C'est la fonction principale du composant client
export default function ClientDashboardPageContent({ userName }: ClientDashboardPageContentProps) {
  const [tasks, setTasks] = useState<Task[]>([]); // Liste complète des tâches
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Ajouter l'état pour les filtres du tableau de bord
  const [dashboardFilters, setDashboardFilters] = useState<DashboardFilters>({
    title: "",
    date: "",
    status: "all",
  });


  // Fonction pour charger les tâches (utilisée pour le chargement initial et en cas d'erreur)
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/tasks'); // Remplacez par l'URL correcte de votre API
      if (!res.ok) {
        throw new Error(`Error fetching tasks: ${res.statusText}`);
      }
      const data: Task[] = await res.json();
      setTasks(data); // Stocker la liste complète
    } catch (err: any) {
      console.error("Failed to fetch tasks:", err);
      setError("Failed to load tasks.");
      toast.error("Erreur lors du chargement des tâches.");
    } finally {
      setLoading(false);
    }
  };

  // Charger les tâches au montage initial du composant
  useEffect(() => {
    fetchTasks();
  }, []); // Le tableau vide [] assure que cela ne s'exécute qu'une fois au montage

  // --- Fonctions de gestion des actions (Appel API + Mise à jour de l'état) ---
  // Ces fonctions restent ici pour mettre à jour l'état 'tasks'

  // Gère l'ajout d'une nouvelle tâche
  const handleTaskAdded = (newTask: Task) => {
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  // Gère la complétion d'une tâche
  const handleCompleteTask = async (id: number) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "PATCH" });
      if (!res.ok) {
         throw new Error(`Error completing task: ${res.statusText}`);
      }
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === id ? { ...task, status: 'completed', completedAt: new Date().toISOString() } : task
        )
      );
      toast.success("Tâche terminée !");
    } catch (err: any) {
      console.error("Failed to complete task:", err);
      toast.error("Erreur lors de la complétion.");
    }
  };

  // Gère l'annulation de la complétion d'une tâche
  const handleUncompleteTask = async (id: number) => {
     try {
        const res = await fetch(`/api/tasks/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "pending" }),
        });
        if (!res.ok) {
           throw new Error(`Error uncompleting task: ${res.statusText}`);
        }
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === id ? { ...task, status: 'pending', completedAt: null } : task
          )
        );
        toast.info("Tâche remise en cours.");
     } catch (err: any) {
        console.error("Failed to uncomplete task:", err);
        toast.error("Erreur lors de l'annulation.");
     }
  };

  // Gère la suppression d'une tâche
  const handleDeleteTask = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
      try {
        const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
        if (!res.ok) {
           throw new Error(`Error deleting task: ${res.statusText}`);
        }
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
        toast.error("Tâche supprimée avec succès !");
      } catch (err: any) {
        console.error("Failed to delete task:", err);
        toast.error("Erreur lors de la suppression.");
      }
    }
  };

  // Gère la modification d'une tâche
  const handleSaveEdit = async (id: number, title: string, description: string) => {
     try {
       const res = await fetch(`/api/tasks/${id}`, {
         method: "PUT",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ title, description }),
       });
       if (!res.ok) {
          throw new Error(`Error saving task edit: ${res.statusText}`);
       }
       const updatedTask = await res.json();
       setTasks(prevTasks =>
         prevTasks.map(task =>
           task.id === id ? updatedTask : task
         )
       );
       toast.success("Tâche modifiée avec succès !");
     } catch (err: any) {
       console.error("Failed to save task edit:", err);
       toast.error("Erreur lors de la modification.");
     }
  };

  // Fonction pour gérer les changements de filtre
  const handleDashboardFilterChange = (filters: DashboardFilters) => {
    setDashboardFilters(filters); // Mettre à jour l'état des filtres
  };

  // --- Logique de filtrage et de sélection des tâches récentes à afficher ---
  // Cette logique s'exécute à chaque re-rendu (quand tasks ou dashboardFilters changent)

  let tasksToDisplay = tasks; // Commencer avec la liste complète

  // Appliquer les filtres
  if (dashboardFilters.status !== "all") {
    tasksToDisplay = tasksToDisplay.filter((t) => t.status === dashboardFilters.status);
  }
  if (dashboardFilters.date) {
    tasksToDisplay = tasksToDisplay.filter((t) => t.createdAt.startsWith(dashboardFilters.date));
  }
  if (dashboardFilters.title) {
    tasksToDisplay = tasksToDisplay.filter((t) =>
      t.title.toLowerCase().includes(dashboardFilters.title.toLowerCase())
    );
  }

  // Trier par date de création (du plus récent au plus ancien)
  tasksToDisplay = tasksToDisplay.slice().sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });

  // Limiter aux 5 tâches les plus récentes (ou le nombre souhaité pour "RecentTasks")
  tasksToDisplay = tasksToDisplay.slice(0, 5);


  // Calculer les statistiques à partir de l'état local des tâches (la liste complète)
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const pending = total - completed;

  // Optionnel: Afficher un message de chargement ou d'erreur
  if (loading) return (
    <div className="flex min-h-screen bg-gray-100 justify-center items-center">
      Téléchargement des tâches en cours...
    </div>
  );
  if (error) return <div className="flex min-h-screen bg-gray-100 justify-center items-center text-red-500">Error: {error}</div>;


  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar /> {/* Sidebar peut être serveur ou client */}
      <main className="flex-1 p-5">
        <HeaderDashboard userName={userName} />
        {/* Passer les statistiques calculées à partir de l'état */}
        <StatsDashboard total={total} completed={completed} pending={pending} />
        <div className="flex flex-col md:flex-row gap-5">
          <div className="p-2 flex-1 h-full">
            {/* Ajouter la barre de filtres ici */}
            {/* Passer la fonction de gestion des filtres */}
            <div className="mb-18">
              {" "}
              {/* Ajouter une marge au-dessus */}
              <TaskFilters onFilter={handleDashboardFilterChange} />
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-center text-2xl px-4 mb-2">
                Ajouter une nouvelle tâche
              </h3>
              {/* Passer la fonction handleTaskAdded à TaskForm */}
              <TaskForm onTaskAdded={handleTaskAdded} />
            </div>
          </div>

          {/* Passer la liste FILTRÉE et LIMITÉE à RecentTasks */}
          <RecentTasks
            tasks={tasksToDisplay} // <-- Passer la liste filtrée et limitée
            onCompleteTask={handleCompleteTask}
            onUncompleteTask={handleUncompleteTask}
            onDeleteTask={handleDeleteTask}
            onSaveEdit={handleSaveEdit}
          />
        </div>
      </main>
    </div>
  );
}
