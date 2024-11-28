import { db } from "../../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { Task } from "./tasksSlice";

export const fetchTasks = async (userId: string): Promise<Task[]> => {
  const q = query(collection(db, "tasks"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<Task, "id">),
  }));
};

export const addTask = async (task: Omit<Task, "id">): Promise<Task> => {
  const docRef = await addDoc(collection(db, "tasks"), task);
  return { id: docRef.id, ...task };
};

export const updateTask = async (task: Task): Promise<void> => {
  const docRef = doc(db, "tasks", task.id);
  const { id, ...taskData } = task;
  await updateDoc(docRef, taskData);
};

export const deleteTask = async (id: string): Promise<void> => {
  const docRef = doc(db, "tasks", id);
  await deleteDoc(docRef);
};
