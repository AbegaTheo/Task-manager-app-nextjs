import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// Étendre le type SessionUser pour inclure 'id'
type SessionUserWithId = {
  id: number;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

// PATCH : Marquer une tâche comme complétée
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const id = parseInt(params.id, 10);
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) return NextResponse.json({ error: "Tâche non trouvée" }, { status: 404 });
  if (task.userId !== Number(session.user.id)) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  let status = "completed";
  let completedAt: Date | null = new Date();
  if (body.status === "pending") {
    status = "pending";
    completedAt = null;
  }

  const updated = await prisma.task.update({
    where: { id },
    data: {
      status,
      completedAt,
    },
  });

  return NextResponse.json(updated);
}

// PUT : Modifier une tâche (titre et description)
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const id = parseInt(params.id, 10);
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return NextResponse.json({ error: "Tâche non trouvée" }, { status: 404 });
    const user = {
      ...session.user,
      id: parseInt(session.user.id as string, 10),
    } as SessionUserWithId;
    if (task.userId !== user.id) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

    const { title, description } = await req.json();

    const updated = await prisma.task.update({
      where: { id },
      data: { title, description },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE : Supprimer une tâche
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const id = parseInt(params.id, 10);
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return NextResponse.json({ error: "Tâche non trouvée" }, { status: 404 });
    const user = {
      ...session.user,
      id: parseInt(session.user.id as string, 10),
    } as SessionUserWithId;
    if (task.userId !== user.id) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

    await prisma.task.delete({ where: { id } });

    return NextResponse.json({ message: "Tâche supprimée" });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}