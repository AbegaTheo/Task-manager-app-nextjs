import { NextResponse } from "next/server" // Importation de NextResponse depuis next/server
import { prisma } from "@/lib/prisma" // Importation de l'instance PrismaClient depuis le fichier prisma.ts
import bcrypt from "bcrypt" // Importation de bcrypt pour le hachage des mots de passe

// METHODE POST
// Cette fonction gère la requête POST pour l'inscription d'un nouvel utilisateur
// Elle vérifie si l'utilisateur existe déjà, hache le mot de passe et crée un nouvel utilisateur dans la base de données
export async function POST(req: Request) {
  const { name, email, password } = await req.json() // Récupération des données du corps de la requête
  // Vérification des champs requis
   if (!name || !email || !password) {
    return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 })
   }
  // Vérification de la longueur du mot de passe
  if (password.length < 6) {
    return NextResponse.json({ error: "Le mot de passe doit avoir au moins 6 caractères" }, { status: 400 })
  }
  // Vérification de la confirmation du mot de passe
  // if (password !== confirmedPassword) {
  //   return NextResponse.json({ error: "Les mots de passe ne correspondent pas" }, { status: 400 })
  // }
  // Vérification de la validité de l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 })
  }

  // Vérification de l'existence de l'utilisateur dans la base de données
  // On utilise findUnique pour vérifier si l'email existe déjà
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: "Cet Utilisateur existe déjà" }, { status: 400 })
  }

  // Hachage du mot de passe
  // On utilise bcrypt pour hacher le mot de passe avant de l'enregistrer dans la base de données
  const hashedPassword = await bcrypt.hash(password, 10)

  // Création de l'utilisateur dans la base de données
  // On utilise create pour ajouter un nouvel utilisateur avec les données fournies
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      confirmedPassword: hashedPassword, // Stocke le même hash pour confirmedPassword
    },
  })

  // Réponse de succès
  // On renvoie une réponse JSON avec un message de succès et un statut 201 (Créé)
  return NextResponse.json({ message: "Utilisateur créé" }, { status: 201 })
}
