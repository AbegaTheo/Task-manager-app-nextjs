// lib/prisma.ts
import { PrismaClient } from '@prisma/client'; // Importer PrismaClient depuis le package @prisma/client

// Créer une instance de PrismaClient
// Utiliser une instance globale pour éviter de créer plusieurs connexions à la base de données
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined // Définir le type de la variable global
}

// Vérifier si l'environnement est de développement
export const prisma =
  globalForPrisma.prisma ?? // Si l'instance n'existe pas, en créer une nouvelle
  // Si l'instance existe déjà, l'utiliser
  new PrismaClient({
    log: ['query'], // Pour voir les requêtes dans la console
  })

// Si l'environnement est de développement, assigner l'instance à la variable globale
// Cela permet de garder une seule instance de PrismaClient en production
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma; // Exporter l'instance de PrismaClient pour l'utiliser dans d'autres fichiers