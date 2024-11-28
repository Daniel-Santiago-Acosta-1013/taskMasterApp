import { useState, useEffect } from "react";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";

const useAuth = (): { user: User | null; loading: boolean } => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { user, loading };
};

export default useAuth;
