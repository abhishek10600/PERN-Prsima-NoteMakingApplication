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
import { getUserCategories } from "@/api/category.api";
import type { CategoryType } from "@/types/category";
import { Spinner } from "../ui/spinner";
import { PlusCircleIcon } from "lucide-react";

const CreateTodoDialog = ({ onCreated }: { onCreated: () => void }) => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

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

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getUserCategories();
      setCategories(data);
      setLoadingCategories(false);
    };
    fetchCategories();
  }, []);

  const onSubmit = async (data: CreateTodoFormData) => {
    await createTodo(data);
    reset();
    onCreated();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-green-600 cursor-pointer hover:bg-green-800 flex items-center justify-center">
          <PlusCircleIcon />
          Add Todo
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Todo</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <Label>Title</Label>
            <Input {...register("title")} />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Input {...register("description")} />
          </div>

          {/* Due Date */}
          <div>
            <Label>Due Date</Label>
            <Input type="datetime-local" {...register("dueDate")} />
            {errors.dueDate && (
              <p className="text-red-500 text-sm">{errors.dueDate.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <Label>Category</Label>
            <Select
              onValueChange={(value) =>
                setValue("categoryId", value, {
                  shouldValidate: true,
                })
              }
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
          </div>

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
