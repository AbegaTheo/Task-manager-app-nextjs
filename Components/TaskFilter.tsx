import { useState } from "react";

export default function TaskFilter({ onFilter }: { onFilter: (filters: { title: string; date: string; status: string }) => void }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('all');

  // Filtrage en temps réel sur le titre
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    onFilter({ title: e.target.value, date, status });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
    onFilter({ title, date: e.target.value, status });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
    onFilter({ title, date, status: e.target.value });
  };

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter({ title, date, status });
  };

  return (
    <form onSubmit={handleFilter} className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-4 rounded-xl shadow">
      <input
        type="text"
        placeholder="Rechercher par titre..."
        value={title}
        onChange={handleTitleChange}
        className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
      />
      <input
        type="date"
        value={date}
        onChange={handleDateChange}
        className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
        placeholder="Date"
        title="Date"
      />
      <select
        id="status-select"
        aria-label="Statut"
        value={status}
        onChange={handleStatusChange}
        className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
      >
        <option value="all">Tous</option>
        <option value="completed">Accomplies</option>
        <option value="pending">En cours</option>
      </select>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
        Filtrer
      </button>
    </form>
  );
}