import { useEffect } from "react";
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

  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (user === null) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center p-4">
          <h1 className="text-xl font-bold text-gray-800">TaskMaster</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Hola, {user.email}</span>
            <button
              onClick={handleLogout}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        <div className="max-w-lg mx-auto">
          <TaskForm />
          <TaskList />
        </div>
      </main>
    </div>
  );
}

export default Home;
