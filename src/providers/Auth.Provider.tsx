import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

// Define the shape of your User object
export interface User {
  id: number;
  username: string;
  email: string;
  // add other fields you need here (e.g., role, avatar)
}

// Define what our context will expose to the rest of the app
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logOut: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>; // Exposed so SignIn can update the user state
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  required?: boolean;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, required = false }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Keeps track of the initial backend check
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        // Check with Django to see if a valid session cookie exists
        const response = await fetch("http://127.0.0.1:8000/api/auth/user/", {
          method: "GET",
          // 'include' is crucial! It tells the browser to send HttpOnly cookies to the backend.
          credentials: "include", 
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to verify session:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserSession();
  }, []);

  useEffect(() => {
    // Only trigger navigation if we've finished loading and confirmed there is no user
    if (!isLoading && !user && required) {
      navigate("/signIn");
    }
  }, [user, required, isLoading, navigate]);

  const logOut = async () => {
    try {
      // Tell Django to destroy the session/cookie on the backend
      await fetch("http://127.0.0.1:8000/api/auth/logout/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // Clear local state and navigate away regardless of API success/failure
      setUser(null);
      navigate("/");
    }
  };

  // Prevent flashing protected content before the backend responds
  if (isLoading && required) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500 animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, logOut, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

// Custom hook to ensure AuthContext is used properly
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};