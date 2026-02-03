import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TodoType } from "@/types/todo";

const Todo = ({ todo }: { todo: TodoType }) => {
  return (
    <Card className="hover:shadow-md transition">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{todo.title}</CardTitle>

        <Badge variant={todo.completed ? "default" : "secondary"}>
          {todo.completed ? "Completed" : "Pending"}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-2">
        {todo.description && (
          <p className="text-sm text-muted-foreground">{todo.description}</p>
        )}

        {todo.category && (
          <span
            className="inline-block text-xs px-2 py-1 rounded-full"
            style={{
              backgroundColor: todo.category.color + "30",
              color: todo.category.color,
            }}
          >
            {todo.category.name}
          </span>
        )}

        {todo.dueDate && (
          <p className="text-xs text-muted-foreground">
            Due: {new Date(todo.dueDate).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default Todo;
