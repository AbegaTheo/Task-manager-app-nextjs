import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  title: "Task Manager",
  description: "Application de gestion de tâches",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr-FR">
      <body>
        {children}
        <ToastContainer position="top-right" autoClose={5000} />
      </body>
    </html>
  );
}
