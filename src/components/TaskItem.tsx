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
    <div className="flex items-center bg-white shadow-md rounded-md p-4 mb-2">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={handleComplete}
        className="mr-4 h-5 w-5 text-blue-500"
      />
      <span
        className={`flex-grow text-gray-800 ${task.completed ? "line-through text-gray-400" : ""
          }`}
      >
        {task.title}
      </span>
      <button
        onClick={handleDelete}
        className="text-red-500 hover:text-red-600 transition duration-200"
      >
        Eliminar
      </button>
    </div>
  );
}

export default TaskItem;
