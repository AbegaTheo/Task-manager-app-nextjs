import Link from "next/link";
import React from "react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 flex items-center justify-center p-5">
      <div className="bg-white shadow-2xl rounded-3xl max-w-7xl w-full flex flex-col md:flex-row overflow-hidden">
        {/* Contenu de gauche */}
        <div className="md:w-1/2 p-3 bg-gradient-to-tr from-purple-600 via-blue-500 to-indigo-600 text-white flex flex-col justify-center items-center">
          <h1 className="text-4xl font-bold mb-5 text-center">
            Bienvenue sur Task Manager
          </h1>
          <Image
            priority
            src="/Images/logo_2.png"
            width={500}
            height={500}
            alt="To-do App Illustration"
            className="w-3/4 h-auto text-center mx-auto mb-5"
            style={{ maxWidth: "50%", height: "auto" }}
          />
          <p className="text-2xl m-3 font-bold text-center">
            Gérez vos tâches facilement, <br /> restez organisé et productif
            chaque jour !
          </p>
        </div>
        {/* Contenu de droite */}
        <div className="md:w-1/2 px-5 py-5 flex flex-col justify-between">
          <h2 className="text-4xl font-semibold mb-4 text-center text-gray-800">
            Rejoins-nous dès maintenant
          </h2>
          <p className="text-md mb-5 font-bold text-center text-gray-500">
            Créez un compte gratuit et commencez à gérer vos tâches en toute
            simplicité.
          </p>
          <Image
            width={500}
            height={500}
            priority
            src="/Images/image_5.jpg"
            alt="To-do App Illustration"
            className="w-3/4 h-auto text-center mx-auto mb-5"
            style={{ maxWidth: "100%", height: "100%" }}
          />
          <div className="flex flex-col md:flex-row justify-center items-center gap-10 mt-5">
            <Link href="/auth">
              <button className="px-6 py-3 font-bold text-2xl cursor-pointer bg-gradient-to-tr from-purple-600 via-blue-500 to-indigo-600 text-white rounded-full hover:bg-indigo-600 transition">
                Démarrer maintenant ! 🚀
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};
