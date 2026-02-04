import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  createTodoSchema,
  type CreateTodoFormData,
} from "@/validations/todo.schema";
import { createTodo } from "@/api/todo.api";
import { getUserCategories, createCategory } from "@/api/category.api";
import type { CategoryType } from "@/types/category";
import { Spinner } from "../ui/spinner";
import { PlusCircleIcon } from "lucide-react";
import { toast } from "react-toastify";

const CreateTodoDialog = ({ onCreated }: { onCreated: () => void }) => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#22c55e");
  const [creatingCategory, setCreatingCategory] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTodoFormData>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      categoryId: undefined,
    },
  });

  const fetchCategories = async () => {
    const data = await getUserCategories();
    setCategories(data);
    setLoadingCategories(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return alert("Category name is required");

    try {
      setCreatingCategory(true);
      const newCat = await createCategory({
        name: newCategoryName,
        color: newCategoryColor,
      });

      toast.success("New Category Created");

      setCategories((prev) => [...prev, newCat]);
      setValue("categoryId", String(newCat.id), { shouldValidate: true });

      setNewCategoryName("");
      setNewCategoryColor("#22c55e");
      setShowCreateCategory(false);
    } finally {
      setCreatingCategory(false);
    }
  };

  const onSubmit = async (data: CreateTodoFormData) => {
    await createTodo(data);
    toast.success("Todo created");
    reset();
    onCreated();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-green-600 cursor-pointer hover:bg-green-800 flex items-center gap-2">
          <PlusCircleIcon size={18} />
          Add Todo
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Todo</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 flex flex-col gap-2"
        >
          {/* Title */}
          <div className="flex flex-col gap-2">
            <Label>Title</Label>
            <Input {...register("title")} placeholder="Create Title" />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <Label>Description (Optional)</Label>
            <Input
              {...register("description")}
              placeholder="Create Description"
            />
          </div>

          {/* Due Date */}
          <div className="flex flex-col gap-2">
            <Label>Due Date (Optional)</Label>
            <Input type="datetime-local" {...register("dueDate")} />
            {errors.dueDate && (
              <p className="text-red-500 text-sm">{errors.dueDate.message}</p>
            )}
          </div>

          {/* Category Select */}
          <div className="flex flex-col gap-2">
            <Label>Category (Optional)</Label>

            <Select
              onValueChange={(value) => {
                if (value === "__create__") {
                  setShowCreateCategory(true);
                } else {
                  setValue("categoryId", value, { shouldValidate: true });
                }
              }}
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

                <SelectItem value="__create__">
                  + Create new category
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Inline Create Category */}
          {showCreateCategory && (
            <div className="border rounded-lg p-3 space-y-3 bg-muted">
              <div className="flex flex-col gap-2">
                <Label>New Category Name</Label>
                <Input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Work, Personal, Gym..."
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Color</Label>
                <Input
                  type="color"
                  value={newCategoryColor}
                  onChange={(e) => setNewCategoryColor(e.target.value)}
                  className="h-10 p-1"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handleCreateCategory}
                  disabled={creatingCategory}
                >
                  {creatingCategory ? <Spinner /> : "Create Category"}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowCreateCategory(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full cursor-pointer"
          >
            {isSubmitting ? <Spinner /> : "Create Todo"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTodoDialog;
