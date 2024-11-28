import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";

function Home() {
  const user = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut();
    navigate("/login");
  };

  if (user === null) {
    navigate("/login");
    return null;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl">Bienvenido, {user.email}</h1>
      <button onClick={handleLogout} className="text-blue-500">
        Cerrar sesión
      </button>
      <TaskForm />
      <TaskList />
    </div>
  );
}

export default Home;
