import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchTasks, addTask, updateTask, deleteTask } from "./tasksAPI";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  userId: string;
}

interface TasksState {
  tasks: Task[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  status: "idle",
  error: null,
};

// Thunks asíncronos
export const fetchTasksAsync = createAsyncThunk<Task[], string>(
  "tasks/fetchTasks",
  async (userId) => {
    const tasks = await fetchTasks(userId);
    return tasks;
  }
);

export const addTaskAsync = createAsyncThunk<Task, Omit<Task, "id">>(
  "tasks/addTask",
  async (task) => {
    const newTask = await addTask(task);
    return newTask;
  }
);

export const updateTaskAsync = createAsyncThunk<Task, Task>(
  "tasks/updateTask",
  async (task) => {
    await updateTask(task);
    return task;
  }
);

export const deleteTaskAsync = createAsyncThunk<string, string>(
  "tasks/deleteTask",
  async (id) => {
    await deleteTask(id);
    return id;
  }
);

// Slice
const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    // Reducers síncronos si los necesitas
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksAsync.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.tasks = action.payload;
        state.status = "succeeded";
      })
      .addCase(addTaskAsync.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTaskAsync.fulfilled, (state, action: PayloadAction<Task>) => {
        const index = state.tasks.findIndex((task) => task.id === action.payload.id);
        if (index >= 0) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(deleteTaskAsync.fulfilled, (state, action: PayloadAction<string>) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      })
      .addMatcher(
        (action) => action.type.startsWith("tasks/") && action.type.endsWith("/pending"),
        (state) => {
          state.status = "loading";
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("tasks/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.error.message || "Algo salió mal";
        }
      );
  },
});

export default tasksSlice.reducer;
