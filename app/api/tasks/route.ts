import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// GET : Liste des tâches
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    // Toujours retourner un tableau JSON
    return NextResponse.json([], { status: 200 });
  }
  const tasks = await prisma.task.findMany({
    where: { userId: Number(session.user.id) },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(tasks);
}

// POST : Ajouter une tâche
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const { title, description } = await req.json();
  const task = await prisma.task.create({
    data: {
      title,
      description,
      userId: Number(session.user.id),
      status: "pending",
      createdAt: new Date(),
    },
  });
  return NextResponse.json(task);
}