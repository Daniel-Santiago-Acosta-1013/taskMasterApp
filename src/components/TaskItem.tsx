import { useDispatch } from "react-redux";
import { updateTaskAsync, deleteTaskAsync, Task } from "../features/tasks/tasksSlice";
import { AppDispatch } from "../store";

interface TaskItemProps {
  task: Task;
}

function TaskItem({ task }: TaskItemProps) {
  const dispatch = useDispatch<AppDispatch>();

  const handleComplete = () => {
    dispatch(updateTaskAsync({ ...task, completed: !task.completed }));
  };

  const handleDelete = () => {
    dispatch(deleteTaskAsync(task.id));
  };

  return (
    <div className="flex items-center">
      <input type="checkbox" checked={task.completed} onChange={handleComplete} />
      <span className={`flex-grow ${task.completed ? "line-through" : ""}`}>{task.title}</span>
      <button onClick={handleDelete} className="text-red-500">
        Eliminar
      </button>
    </div>
  );
}

export default TaskItem;
