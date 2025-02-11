import { useState, FormEvent, useEffect } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";
import { ClipLoader } from "react-spinners";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setIsSubmitting(false);
        Swal.fire({
          icon: "success",
          title: "Inicio de sesión exitoso",
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((error) => {
        setIsSubmitting(false);
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error al iniciar sesión",
          text: "Correo electrónico o contraseña incorrectos",
        });
      });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={50} color={"#123abc"} loading={true} />
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Iniciar Sesión
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-blue-500"
            />
            <div
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                // Eye-off SVG icon
                <svg
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.958 9.958 0 011.125-4.575m15.75 0A9.958 9.958 0 0122 9c0 5.523-4.477 10-10 10a10.05 10.05 0 01-1.875-.175M9.172 9.172a4 4 0 005.656 5.656M15.535 8.465a4 4 0 00-5.656-5.656"
                  />
                </svg>
              ) : (
                // Eye SVG icon
                <svg
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition duration-200 flex items-center justify-center"
          >
            {isSubmitting ? (
              <ClipLoader size={20} color={"#fff"} loading={true} />
            ) : (
              "Iniciar Sesión"
            )}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          ¿No tienes una cuenta?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
