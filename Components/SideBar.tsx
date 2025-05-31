"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/tasks", label: "Tâches" },
    { href: "/history", label: "Historiques" },
    { href: "/stats", label: "Statistiques" },
    { href: "/settings", label: "Paramètres" },
  ];

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" }); // Redirige vers la page d'accueil
  };

  return (
    <aside className="bg-blue-700 text-white w-64 min-h-screen flex flex-col py-8 px-4">
      <nav className="flex flex-col gap-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded px-3 py-2 hover:bg-white hover:text-blue-600 text-xl transition ${
              pathname === link.href ? "bg-white text-blue-700 font-bold" : ""
            }`}
          >
            {link.label}
          </Link>
        ))}
        <button
          onClick={handleSignOut}
          className="w-full text-left hover:bg-red-600 rounded px-3 py-2"
        >
          Déconnexion
        </button>
      </nav>
    </aside>
  );
}
