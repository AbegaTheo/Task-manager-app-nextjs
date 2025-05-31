import Sidebar from '@/Components/SideBar';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { FaTasks, FaCheckCircle, FaHourglassHalf } from 'react-icons/fa';

export default async function StatsPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  const user = await prisma.user.findUnique({ where: { email: session.user?.email ?? undefined } });
  const tasks = await prisma.task.findMany({ where: { userId: user?.id } });

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const pending = total - completed;
  const userName = session?.user?.name || session?.user?.email || "Invité";

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="text-5xl font-extrabold mb-5 text-indigo-700 drop-shadow">Statistiques</h1>
        <p className="mb-8 text-lg text-gray-700">Bienvenue, <span className="font-semibold text-indigo-600">{userName}</span> !</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center hover:scale-105 transition">
            <FaTasks className="text-4xl text-indigo-500 mb-2" />
            <div className="text-5xl font-bold">{total}</div>
            <div className="text-gray-600 mt-1">Tâches totales</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center hover:scale-105 transition">
            <FaCheckCircle className="text-4xl text-green-500 mb-2" />
            <div className="text-5xl font-bold text-green-600">{completed}</div>
            <div className="text-gray-600 mt-1">Accomplies</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center hover:scale-105 transition">
            <FaHourglassHalf className="text-4xl text-yellow-500 mb-2" />
            <div className="text-5xl font-bold text-yellow-600">{pending}</div>
            <div className="text-gray-600 mt-1">En cours</div>
          </div>
        </div>
      </main>
    </div>
  );
}