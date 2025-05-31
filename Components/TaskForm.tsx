// task-manager-app/Components/TaskForm.tsx
'use client';

import { useState } from 'react';
import { toast } from 'react-toastify'; // Assurez-vous que toast est importé ici

// Définir le type de la prop onTaskAdded
interface TaskFormProps {
  onTaskAdded: (newTask: any) => void; // La fonction doit accepter la nouvelle tâche
}

export default function TaskForm({ onTaskAdded }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Le titre de la tâche ne peut pas être vide.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });

      if (res.ok) {
        const newTask = await res.json(); // L'API doit retourner la tâche créée
        toast.success('Tâche ajoutée avec succès !');
        setTitle('');
        setDescription('');
        // Appeler la fonction de rappel du parent avec la nouvelle tâche
        if (onTaskAdded) {
          onTaskAdded(newTask);
        }
      } else {
        const errorData = await res.json();
        toast.error(`Erreur lors de l'ajout de la tâche : ${errorData.message || res.statusText}`);
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout de la tâche :', error);
      toast.error('Une erreur inattendue est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md flex flex-col gap-4 mx-auto"
    >
      <div>
        <input
          type="text"
          placeholder="Titre"
          className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      <div>
        <textarea
          id="description"
          placeholder="Description"
          className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          disabled={loading}
          rows={4}
        ></textarea>
      </div>
      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-gradient-to-tr from-purple-600 via-blue-500 to-indigo-600 text-white px-4 py-2 rounded font-semibold hover:scale-105 transition flex-1"
          disabled={loading}
        >
          {loading ? "Ajout en cours..." : "Ajouter la Tâche"}
        </button>
      </div>
    </form>
  );
}
