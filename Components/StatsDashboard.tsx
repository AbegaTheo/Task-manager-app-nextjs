
export default function StatsDashboard({
  total,
  completed,
  pending,
}: {
  total: number;
  completed: number;
  pending: number;
}) {
    // Ces props sont passées depuis la page Dashboard
  return (
    <div className="flex gap-6 mb-8">
      <div className="bg-white rounded shadow p-4 flex-1 text-center">
        <div className="text-gray-600 text-xl font-bold">Tâches totales</div>
        <div className="text-7xl font-bold">{total}</div>
      </div>
      <div className="bg-green-100 rounded shadow p-4 flex-1 text-center">
        <div className="text-gray-600 text-xl font-bold">Accomplies</div>
        <div className="text-7xl font-bold text-green-600">{completed}</div>
      </div>
      <div className="bg-yellow-100 rounded shadow p-4 flex-1 text-center">
        <div className="text-gray-600 text-xl font-bold">En cours</div>
        <div className="text-7xl font-bold text-yellow-600">{pending}</div>
      </div>
    </div>
  );
}
