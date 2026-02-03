import { getUserTodos } from "@/api/todo.api";
import Navbar from "@/components/General/Navbar";
import Todo from "@/components/HomePageComponents/Todo";
import CreateTodoDialog from "@/components/HomePageComponents/CreateTodoDialog";
import type { RootState } from "@/store/store";
import type { TodoType } from "@/types/todo";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const HomePage = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState<TodoType[]>([]);

  const fetchTodos = async () => {
    try {
      const response = await getUserTodos();
      setTodos(response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Hi {user?.username}</h1>
          <CreateTodoDialog onCreated={fetchTodos} />
        </div>

        {loading && <p>Loading todos...</p>}
        {!loading && todos.length === 0 && (
          <p className="text-muted-foreground">No todos yet.</p>
        )}

        <div className="grid gap-4">
          {todos.map((todo) => (
            <Todo key={todo.id} todo={todo} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
