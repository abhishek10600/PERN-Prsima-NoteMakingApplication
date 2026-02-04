import { useEffect, useState } from "react";
import type { TodoType } from "@/types/todo";
import { deleteTodo, toggleTodo, updateTodo } from "@/api/todo.api";
import { getUserCategories } from "@/api/category.api";
import type { CategoryType } from "@/types/category";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";

interface Props {
  todo: TodoType;
  onRefresh: () => void;
}

const TodoItem = ({ todo, onRefresh }: Props) => {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || "");
  const [categoryId, setCategoryId] = useState<string | undefined>(
    todo.category ? String(todo.category.id) : undefined,
  );

  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    if (!isEditing) return;

    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const data = await getUserCategories();
        setCategories(data);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [isEditing]);

  const handleToggle = async () => {
    if (loading) return;
    try {
      setLoading(true);
      await toggleTodo(todo.id);
      toast.success("Status updated");
      onRefresh();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (loading) return;
    if (!confirm("Delete this todo?")) return;

    try {
      setLoading(true);
      await deleteTodo(todo.id);
      toast.success("Todo deleted successfully");
      onRefresh();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!title.trim()) return toast.error("Title is required");

    try {
      setLoading(true);

      await updateTodo(todo.id, {
        title: title.trim(),
        description: description?.trim() || undefined,
        categoryId, // ✅ validated by updateTodoSchema
      });

      setIsEditing(false);
      toast.success("Todo updated successfully");
      onRefresh();
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle(todo.title);
    setDescription(todo.description || "");
    setCategoryId(todo.category ? String(todo.category.id) : undefined);
    setIsEditing(false);
  };

  return (
    <div className="rounded-xl border p-4 space-y-3 bg-background">
      {isEditing ? (
        <div className="space-y-3">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            disabled={loading}
          />

          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            disabled={loading}
          />

          {/* Category Select */}
          <Select
            value={categoryId}
            onValueChange={(val) => setCategoryId(val)}
            disabled={loadingCategories}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category (optional)" />
            </SelectTrigger>

            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2 justify-end">
            <Button
              size="sm"
              onClick={handleUpdate}
              disabled={loading}
              className="gap-1"
            >
              <Check size={16} />
              Save
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
              className="gap-1"
            >
              <X size={16} />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h3
              className={`font-medium leading-tight ${
                todo.completed ? "line-through text-muted-foreground" : ""
              }`}
            >
              {todo.title}
            </h3>

            {todo.description && (
              <p className="text-sm text-muted-foreground">
                {todo.description}
              </p>
            )}

            {todo.category && (
              <Badge
                variant="secondary"
                style={{ backgroundColor: todo.category.color }}
              >
                {todo.category.name}
              </Badge>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={handleToggle}
              disabled={loading}
            >
              <Check
                className={todo.completed ? "opacity-100" : "opacity-40"}
                size={16}
              />
            </Button>

            <Button
              size="icon"
              variant="outline"
              onClick={() => setIsEditing(true)}
              disabled={loading}
            >
              <Pencil size={16} />
            </Button>

            <Button
              size="icon"
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoItem;
