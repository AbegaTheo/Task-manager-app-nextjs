// task-manager-app/Components/RecentTasks.tsx
'use client' // Assurez-vous que c'est un composant client
import React, { useState, useEffect } from 'react';
import { Task } from "@/lib/types"; // Importer le type Task
import { FaCheck, FaUndo, FaEdit, FaTrash } from "react-icons/fa"; // Importer les icônes

interface RecentTasksProps {
  tasks: Task[];
  // Définir les props pour les fonctions d'action passées par le parent
  onCompleteTask: (id: number) => Promise<void>; // Fonction pour terminer une tâche
  onUncompleteTask: (id: number) => Promise<void>; // Fonction pour annuler la complétion
  onDeleteTask: (id: number) => Promise<void>; // Fonction pour supprimer une tâche
  onSaveEdit: (id: number, title: string, description: string) => Promise<void>; // Fonction pour sauvegarder la modification
}

// Recevoir les nouvelles props (la liste des tâches et les handlers d'action)
export default function RecentTasks({
  tasks,
  onCompleteTask,
  onUncompleteTask,
  onDeleteTask,
  onSaveEdit,
}: RecentTasksProps) {
  // Nous n'avons plus besoin de l'état local taskList ici
  // const [taskList, setTaskList] = useState<Task[]>([]);
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

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

  // Afficher un message si la prop tasks est vide
  if (!tasks || tasks.length === 0)
    return (
      <div className="bg-white rounded shadow p-2 flex-1 h-full">
        <h3 className="font-bold text-center text-2xl px-2 mb-2">Tâches Récentes</h3>
        <p className="text-center text-gray-500">Aucune tâche pour le moment.</p>
      </div>
    );

  // Afficher les tâches (vous pouvez trier ou limiter ici si nécessaire)
  const tasksToDisplay = tasks.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4); // Exemple: les 5 plus récentes

  return (
    <div className="bg-green-200 rounded-3xl shadow p-4 flex-1 h-full">
      <h3 className="font-bold text-center text-2xl px-2 mb-2">Tâches Récentes</h3>
      <div className="space-y-2">
        {tasksToDisplay.map((task) => (
           <div
            key={task.id}
            className={`
              bg-gray-50 border-l-4
              ${task.status === "completed" ? "border-green-500" : "border-yellow-400"}
              rounded-lg shadow-sm p-2 transition hover:shadow-md
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
                  className="bg-green-600 text-white px-3 py-1 rounded mr-2 text-sm hover:bg-green-700 transition"
                >
                  Valider
                </button>
                <button
                  onClick={() => setEditTaskId(null)}
                  className="bg-gray-400 text-white px-3 py-1 rounded text-sm hover:bg-gray-500 transition"
                >
                  Annuler
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-1">
                  <h4
                    className={`text-lg font-semibold ${
                      task.status === "completed" ? "line-through text-gray-500" : "text-gray-800"
                    }`}
                  >
                    {task.title}
                  </h4>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold
                      ${task.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"}
                    `}
                  >
                    {task.status === "completed" ? "Terminée" : "En cours"}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{task.description}</p>
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
                      className="flex items-center gap-1 text-white bg-green-600 px-2 py-1 rounded text-sm hover:bg-green-700 transition"
                      title="Terminer"
                    >
                      <FaCheck />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUncompleteClick(task.id)} // Appelle le handler du parent
                      className="flex items-center gap-1 text-white bg-blue-600 px-2 py-1 rounded text-sm hover:bg-blue-700 transition"
                      title="Annuler"
                    >
                      <FaUndo />
                    </button>
                  )}
                  <button
                    onClick={() => startEdit(task)} // Appelle startEdit (locale)
                    className="flex items-center gap-1 text-white bg-yellow-500 px-2 py-1 rounded text-sm hover:bg-yellow-600 transition"
                    title="Modifier"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(task.id)} // Appelle le handler du parent
                    className="flex items-center gap-1 text-white bg-red-600 px-2 py-1 rounded text-sm hover:bg-red-700 transition"
                    title="Supprimer"
                  >
                    <FaTrash />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
