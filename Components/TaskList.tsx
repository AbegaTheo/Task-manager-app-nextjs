// task-manager-app/Components/TaskList.tsx
'use client'
import React, { useState, useEffect } from 'react'
import TaskFilters from './TaskFilter'
import { FaCheck, FaUndo, FaEdit, FaTrash } from "react-icons/fa";
// Supprimer l'import de toast ici, car les notifications sont gérées dans le parent
// import { toast } from 'react-toastify'
// Assurez-vous que le type Task est importé si nécessaire, ou utilisez la définition locale si elle est correcte et cohérente
// import { Task } from '@/lib/types'; // <-- Décommenter si vous utilisez un type centralisé

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  completedAt: string | null;
  userId: number;
}

interface TaskListProps {
  tasks: Task[];
  // Définir les props pour les fonctions d'action passées par le parent
  onCompleteTask: (id: number) => Promise<void>; // Fonction pour terminer une tâche
  onUncompleteTask: (id: number) => Promise<void>; // Fonction pour annuler la complétion
  onDeleteTask: (id: number) => Promise<void>; // Fonction pour supprimer une tâche
  onSaveEdit: (id: number, title: string, description: string) => Promise<void>; // Fonction pour sauvegarder la modification
}

// Recevoir les props (la liste des tâches et les handlers d'action)
export default function TaskList({
  tasks,
  onCompleteTask,
  onUncompleteTask,
  onDeleteTask,
  onSaveEdit,
}: TaskListProps) {
  // filteredTasks et la logique de filtrage restent ici
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);// Cet état contiendra les tâches triées ET filtrées
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Ajouter un état pour stocker les filtres actuels
  const [currentFilters, setCurrentFilters] = useState({
    title: "",
    date: "",
    status: "all",
  });


  // Utiliser useEffect pour trier et filtrer les tâches lorsque la prop tasks ou les filtres changent
  useEffect(() => {
    // 1. Créer une copie triée de la prop tasks (du plus récent au plus ancien)
    const sorted = [...tasks].sort((a, b) => {
      // Convertir les dates en objets Date ou timestamps pour une comparaison fiable
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA; // Pour trier du plus récent au plus ancien
    });

    // 2. Appliquer les filtres à la liste triée
    let result = sorted;

    if (currentFilters.status !== "all") {
      result = result.filter((t) => t.status === currentFilters.status);
    }
    if (currentFilters.date) {
      result = result.filter((t) => t.createdAt.startsWith(currentFilters.date));
    }
    if (currentFilters.title) {
      result = result.filter((t) =>
        t.title.toLowerCase().includes(currentFilters.title.toLowerCase())
      );
    }

    // 3. Mettre à jour l'état filteredTasks
    setFilteredTasks(result);

  }, [tasks, currentFilters]); // Dépendances: la prop tasks et l'état des filtres


  // Filtrage - Cette fonction met simplement à jour l'état des filtres
  const applyFilters = (filters: {
    title: string;
    date: string;
    status: string;
  }) => {
    setCurrentFilters(filters); // La mise à jour de cet état déclenchera le useEffect
  };

  // Les fonctions d'action appellent maintenant les props passées par le parent
  const handleCompleteClick = (id: number) => {
    onCompleteTask(id); // Appelle la fonction du parent
  };

  const handleUncompleteClick = (id: number) => {
    onUncompleteTask(id); // Appelle la fonction du parent
  };

  const handleDeleteClick = (id: number) => {
    onDeleteTask(id); // Appelle la fonction du parent
  };

  // Modifier la fonction startEdit (reste locale)
  const startEdit = (task: Task) => {
    setEditTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  // Modifier la fonction saveEdit pour appeler la prop onSaveEdit
  const handleSaveEditClick = async (id: number) => {
    // Appeler la fonction de sauvegarde du parent
    await onSaveEdit(id, editTitle, editDescription);
    // Réinitialiser l'état d'édition après la sauvegarde
    setEditTaskId(null);
    setEditTitle("");
    setEditDescription("");
  };

  // Les statistiques sont calculées à partir de la prop tasks (la liste complète non filtrée)
  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = tasks.length - completed;

  // Afficher un message si la prop tasks est vide (avant filtrage)
  if (!tasks || tasks.length === 0)
    return (
      <p className="text-center text-blue-500 font-bold">
        Aucune tâche pour le moment.
      </p>
    );


  return (
    <div className="space-y-6 mt-6">
      <div className="flex gap-4 items-center">
        <TaskFilters onFilter={applyFilters} />
        {/* Afficher les statistiques basées sur la prop tasks */}
        <span className="text-blue-600 text-2xl font-bold">📊 Total : {tasks.length}</span>
        <span className="text-green-600 text-2xl font-bold">✅ Terminé : {completed}</span>
        <span className="text-yellow-600 text-2xl font-bold">📋 En cours : {pending}</span>
      </div>

      {/* Mapper sur filteredTasks pour afficher la liste triée et filtrée */}
      {filteredTasks.map((task) => (
         <div
          key={task.id}
          className={`
            bg-white border-l-4
            ${task.status === "completed" ? "border-green-500" : "border-yellow-400"}
            rounded-xl shadow-md p-6 transition hover:shadow-lg hover:-translate-y-1
          `}
        >
          {editTaskId === task.id ? (
            <div>
              <input
                className="border rounded p-2 mb-2 w-full"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Titre de la tâche"
              />
              <textarea
                className="border rounded p-2 mb-2 w-full"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Description de la tâche"
              />
              <button
                onClick={() => handleSaveEditClick(task.id)} // Appelle le handler du parent
                className="bg-green-600 text-white px-4 py-2 rounded mr-2 hover:bg-green-700 transition"
              >
                Valider
              </button>
              <button
                onClick={() => setEditTaskId(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
              >
                Annuler
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <h3
                  className={`text-xl font-bold ${
                    task.status === "completed" ? "line-through text-gray-400" : "text-gray-800"
                  }`}
                >
                  {task.title}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${task.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"}
                  `}
                >
                  {task.status === "completed" ? "Terminée" : "En cours"}
                </span>
              </div>
              <p className="text-gray-600 mb-2">{task.description}</p>
              <div className="flex items-center text-xs text-gray-400 mb-2 gap-4">
                <span>Créée le : {new Date(task.createdAt).toLocaleDateString()}</span>
                {task.completedAt && (
                  <span>Terminée le : {new Date(task.completedAt).toLocaleDateString()}</span>
                )}
              </div>
              <div className="flex gap-2 mt-2">
                {task.status !== "completed" ? (
                  <button
                    onClick={() => handleCompleteClick(task.id)} // Appelle le handler du parent
                    className="flex items-center gap-1 text-white bg-green-600 px-3 py-1 rounded hover:bg-green-700 transition"
                    title="Terminer"
                  >
                    <FaCheck /> Terminer
                  </button>
                ) : (
                  <button
                    onClick={() => handleUncompleteClick(task.id)} // Appelle le handler du parent
                    className="flex items-center gap-1 text-white bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 transition"
                    title="Annuler"
                  >
                    <FaUndo /> Annuler
                  </button>
                )}
                <button
                  onClick={() => startEdit(task)} // Appelle startEdit (locale)
                  className="flex items-center gap-1 text-white bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600 transition"
                  title="Modifier"
                >
                  <FaEdit /> Modifier
                </button>
                <button
                  onClick={() => handleDeleteClick(task.id)} // Appelle le handler du parent
                  className="flex items-center gap-1 text-white bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
                  title="Supprimer"
                >
                  <FaTrash /> Supprimer
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
