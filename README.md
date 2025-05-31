# ✅ Next.js Task Manager App avec Authentification

Une application web moderne de gestion de tâches, permettant à chaque utilisateur de créer, visualiser, modifier et supprimer ses propres tâches de manière sécurisée.

---

## 🎯 Objectif principal du projet

Le but est de proposer une application de gestion de tâches simple, intuitive et sécurisée, où chaque utilisateur peut :

- Créer un compte
- Se connecter
- Gérer ses propres tâches de manière privée

Cette application offre une interface responsive, moderne, avec de belles animations et une expérience utilisateur fluide.

---

## 🧠 Problème résolu

Dans un monde où les tâches s'accumulent et les post-its volent partout 🌀, cette app vient apporter :

- Une centralisation des tâches personnelles
- Une séparation sécurisée des tâches entre utilisateurs
- Une organisation visuelle claire grâce à des priorités et statuts
- Une interface agréable pour améliorer la productivité

---

## 🚀 Fonctionnalités clés

- 🔐 Authentification sécurisée avec **NextAuth.js**
- ✍️ Création de tâches avec :
  - Description
  - Statut (**En cours**, **Accomplie**)
- ✅ Édition et suppression des tâches
- 📊 Statistiques des tâches par utilisateur
- 🎨 Interface moderne avec **Tailwind CSS** et **icônes**
- 💾 Stockage des données avec **SQLite + Prisma**
- 🎯 Dashboard personnel (privé) pour chaque utilisateur

---

## 🛠️ Technologies utilisées

- [Next.js 14 (App Router)](https://nextjs.org/)
- [React 18](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Prisma ORM](https://www.prisma.io/)
- [SQLite](https://www.sqlite.org/)
- [TypeScript](https://www.typescriptlang.org/)

---

## ⚙️ Prérequis

Avant de lancer le projet, assure-toi d'avoir :

- Node.js ≥ 18
- npm ou yarn installé
- Un environnement de développement local (VSCode recommandé)

### Installation des dépendances

```bash
npm install
# ou
yarn install
```

---

## 🧪 Lancer le projet en local

### Étapes de configuration :

1. **Créer un fichier `.env`** à la racine avec les variables suivantes :

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET=ton_super_secret
NEXTAUTH_URL=http://localhost:3000
```

2. **Initialiser la base de données :**

```bash
npx prisma migrate dev --name init
```

3. **Lancer le serveur de développement :**

```bash
npm run dev
# ou
yarn dev
```

👉 Accède ensuite à `http://localhost:3000`

---

## 🤝 Contribuer

Les contributions sont les bienvenues !

1. Forke le projet
2. Crée une nouvelle branche : `git checkout -b feature/ma-fonctionnalite`
3. Fais tes modifications puis un commit : `git commit -m "Ajoute une fonctionnalité cool"`
4. Push ta branche : `git push origin feature/ma-fonctionnalite`
5. Ouvre une **pull request** 🚀

---

## 📄 Licence

Ce projet est open-source sous licence MIT.

---

## ✨ Auteur

Développé par **Abel AGOH**