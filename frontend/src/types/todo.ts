export interface Category {
  id: number;
  name: string;
  color: string;
}

export interface TodoType {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  category?: Category | null;
  createdAt: string;
}
