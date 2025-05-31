/* export type Task = {
  id: number;
  title: string;
  description: string;
  status: 'done' | 'pending' | 'in-progress';
  createdAt: string; // ou Date si tu ne sérialises pas
  completedAt: string | null;
  userId: number;
  date?: string; // si tu utilises .date dans le filtrage
}; */


interface TaskFormProps {
  editTask?: Task | null;
  onTaskAdded?: () => void;
  onEditEnd?: () => void;
}

export type Task = {
  id: number;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  completedAt: string | null;
  userId: number;
};