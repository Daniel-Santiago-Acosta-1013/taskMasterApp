import { useDispatch } from "react-redux";
import { useState } from "react";
import { updateTaskAsync, deleteTaskAsync, Task } from "../features/tasks/tasksSlice";
import { AppDispatch } from "../store";

interface TaskItemProps {
  task: Task;
}

function TaskItem({ task }: TaskItemProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);

  const handleComplete = () => {
    dispatch(updateTaskAsync({ ...task, completed: !task.completed }));
  };

  const handleDelete = () => {
    dispatch(deleteTaskAsync(task.id));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    dispatch(updateTaskAsync({ ...task, title: newTitle }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNewTitle(task.title);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center bg-white shadow-md rounded-md p-4 mb-2">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={handleComplete}
        className="mr-4 h-5 w-5 text-blue-500"
      />
      {isEditing ? (
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="flex-grow border border-gray-300 rounded-md px-2 py-1"
        />
      ) : (
        <span
          className={`flex-grow text-gray-800 ${
            task.completed ? "line-through text-gray-400" : ""
          }`}
        >
          {task.title}
        </span>
      )}
      {isEditing ? (
        <>
          <button
            onClick={handleSave}
            className="text-green-500 hover:text-green-600 transition duration-200 ml-2"
          >
            Guardar
          </button>
          <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-600 transition duration-200 ml-2"
          >
            Cancelar
          </button>
        </>
      ) : (
        <>
          <button
            onClick={handleEdit}
            className="text-blue-500 hover:text-blue-600 transition duration-200 ml-2"
          >
            Editar
          </button>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-600 transition duration-200 ml-2"
          >
            Eliminar
          </button>
        </>
      )}
    </div>
  );
}

export default TaskItem;
