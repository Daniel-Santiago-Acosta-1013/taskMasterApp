import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTasksAsync, Task } from "../features/tasks/tasksSlice";
import TaskItem from "./TaskItem";
import useAuth from "../hooks/useAuth";
import { RootState, AppDispatch } from "../store";

function TaskList() {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const dispatch = useDispatch<AppDispatch>();
  const user = useAuth();

  useEffect(() => {
    if (user) {
      dispatch(fetchTasksAsync(user.uid));
    }
  }, [user, dispatch]);

  return (
    <div>
      {tasks.map((task: Task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}

export default TaskList;
