import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { compare } from 'bcryptjs'
import { prisma } from '@/lib/prisma' // Assure-toi que ce chemin est correct
import type { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email et mot de passe requis");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Utilisateur non trouvé");
        }

        const isValid = await compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Mot de passe incorrect");
        }

        return {
          ...user,
          id: String(user.id),
        };
      },
    }),
  ],
  pages: {
    signIn: "/login", // page de connexion personnalisée
  },
  secret: process.env.NEXTAUTH_SECRET,

  // AJOUTE CE CALLBACK :
  callbacks: {
    async session({ session, token, user }) {
      // Ajoute l'id du user dans la session côté client
      if (session.user && token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
