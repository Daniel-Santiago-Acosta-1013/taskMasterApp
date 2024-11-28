import { useState, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { addTaskAsync } from "../features/tasks/tasksSlice";
import useAuth from "../hooks/useAuth";
import { AppDispatch } from "../store";

function TaskForm() {
  const [title, setTitle] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useAuth();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (user) {
      dispatch(
        addTaskAsync({
          title,
          completed: false,
          userId: user.uid,
        })
      );
      setTitle("");
    } else {
      console.error("Usuario no autenticado");
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 flex-grow"
        placeholder="Nueva tarea"
      />
      <button type="submit" className="bg-blue-500 text-white p-2">
        Agregar
      </button>
    </form>
  );
}

export default TaskForm;
