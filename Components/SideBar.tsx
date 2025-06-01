"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  CheckSquare, 
  History, 
  BarChart3, 
  Settings, 
  LogOut 
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/tasks", label: "Tâches", icon: CheckSquare },
    { href: "/history", label: "Historiques", icon: History },
    { href: "/stats", label: "Statistiques", icon: BarChart3 },
    { href: "/settings", label: "Paramètres", icon: Settings },
  ];

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" }); // Redirige vers la page d'accueil
  };

  return (
    <aside className="bg-indigo-700  text-white w-64 min-h-screen flex flex-col py-8 px-4">
      <nav className="flex flex-col gap-4">
        {links.map((link) => {
          const IconComponent = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded px-3 py-2 hover:bg-white hover:text-blue-600 text-xl transition flex items-center gap-3 ${
                pathname === link.href ? "bg-white text-blue-700 font-bold" : ""
              }`}
            >
              <IconComponent size={20} />
              {link.label}
            </Link>
          );
        })}
        <button
          onClick={handleSignOut}
          className="w-full text-left hover:bg-red-600 rounded px-3 py-2 flex items-center gap-3 text-xl transition"
        >
          <LogOut size={20} />
          Déconnexion
        </button>
      </nav>
    </aside>
  );
}
