// task-manager-app/app/tasks/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/Components/SideBar';
import TaskList from '@/Components/TaskList';
import TaskForm from '@/Components/TaskForm';
import { Task } from '@/lib/types'; // Importer le type Task
import { toast } from 'react-toastify'; // Importer toast si vous l'utilisez ici

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour charger les tâches (utilisée pour le chargement initial et en cas d'erreur)
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      // Appeler votre route API qui renvoie les tâches de l'utilisateur connecté.
      // Assurez-vous que cette route API (/api/tasks) utilise getServerSession et prisma.
      const res = await fetch('/api/tasks'); // Remplacez par l'URL correcte de votre API si différente
      if (!res.ok) {
        throw new Error(`Error fetching tasks: ${res.statusText}`);
      }
      const data: Task[] = await res.json();
      setTasks(data);
    } catch (err: any) {
      console.error("Failed to fetch tasks:", err);
      setError("Failed to load tasks.");
      toast.error("Erreur lors du chargement des tâches."); // Notification d'erreur
    } finally {
      setLoading(false);
    }
  };

  // Charger les tâches au montage initial
  useEffect(() => {
    fetchTasks();
  }, []);

  // --- Fonctions de gestion des actions (Appel API + Mise à jour de l'état) ---

  // Gère l'ajout d'une nouvelle tâche
  // L'API devrait retourner la tâche nouvellement créée avec son ID, etc.
  const handleTaskAdded = (newTask: Task) => {
    // Ajouter la nouvelle tâche à la fin du tableau d'état
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  // Gère la complétion d'une tâche
  const handleCompleteTask = async (id: number) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "PATCH" });
      if (!res.ok) {
         throw new Error(`Error completing task: ${res.statusText}`);
      }
      // Mettre à jour l'état local : trouver la tâche et changer son statut
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === id ? { ...task, status: 'completed', completedAt: new Date().toISOString() } : task // Assurez-vous que l'API met à jour completedAt ou mettez-le ici
        )
      );
      toast.success("Tâche terminée !");
    } catch (err: any) {
      console.error("Failed to complete task:", err);
      toast.error("Erreur lors de la complétion.");
      // Optionnel: refetch en cas d'erreur pour synchroniser si la mise à jour locale a échoué
      // fetchTasks();
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
        // Mettre à jour l'état local : trouver la tâche et changer son statut
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === id ? { ...task, status: 'pending', completedAt: null } : task
          )
        );
        toast.info("Tâche remise en cours.");
     } catch (err: any) {
        console.error("Failed to uncomplete task:", err);
        toast.error("Erreur lors de l'annulation.");
        // Optionnel: refetch en cas d'erreur
        // fetchTasks();
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
        // Mettre à jour l'état local : filtrer la tâche supprimée
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
        toast.error("Tâche supprimée !");
      } catch (err: any) {
        console.error("Failed to delete task:", err);
        toast.error("Erreur lors de la suppression.");
        // Optionnel: refetch en cas d'erreur
        // fetchTasks();
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
       // Assumer que l'API retourne la tâche mise à jour pour une meilleure précision
       // Si l'API ne retourne pas la tâche, vous pouvez construire l'objet mis à jour ici
       const updatedTask = await res.json();
       // Mettre à jour l'état local : trouver la tâche et la remplacer par la version mise à jour
       setTasks(prevTasks =>
         prevTasks.map(task =>
           task.id === id ? updatedTask : task
         )
       );
       toast.success("Tâche modifiée !");
     } catch (err: any) {
       console.error("Failed to save task edit:", err);
       toast.error("Erreur lors de la modification.");
       // Optionnel: refetch en cas d'erreur
       // fetchTasks();
     }
  };


  // Optionnel: Afficher un message de chargement ou d'erreur
  if (loading) return <div className="flex min-h-screen bg-gray-100 justify-center items-center">Loading tasks...</div>;
  if (error) return <div className="flex min-h-screen bg-gray-100 justify-center items-center text-red-500">Error: {error}</div>;


  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar /> {/* Sidebar peut être serveur ou client */}
      <main className="flex-1 p-8">
        <h1 className="text-5xl font-bold mb-8">Mes Tâches</h1>
        <div className="mb-8">
          <h3 className="text-3xl text-center font-bold mb-5">Ajouter une nouvelle tâche</h3>
          {/* Passer la fonction handleTaskAdded à TaskForm */}
          {/* TaskForm devra appeler cette fonction avec la nouvelle tâche retournée par l'API */}
          <TaskForm onTaskAdded={handleTaskAdded} />
        </div>
        {/* Passer la liste des tâches et les fonctions d'action à TaskList */}
        <TaskList
          tasks={tasks}
          onCompleteTask={handleCompleteTask}
          onUncompleteTask={handleUncompleteTask}
          onDeleteTask={handleDeleteTask}
          onSaveEdit={handleSaveEdit}
          // onTaskUpdated n'est plus nécessaire ici car les actions sont gérées par le parent
        />
      </main>
    </div>
  );
}
