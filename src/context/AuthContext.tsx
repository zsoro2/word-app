import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { User, LoginCredentials, SignupCredentials } from "../types";
import {
  getCurrentUser,
  login as appwriteLogin,
  logout as appwriteLogout,
  createAccount,
  updateUserName as appwriteUpdateName,
} from "../lib/appwrite";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateName: (name: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const loggedInUser = await appwriteLogin(credentials);
    setUser(loggedInUser);
  };

  const signup = async (credentials: SignupCredentials) => {
    const newUser = await createAccount(credentials);
    setUser(newUser);
  };

  const logout = async () => {
    await appwriteLogout();
    setUser(null);
  };

  const updateName = async (name: string) => {
    const updatedUser = await appwriteUpdateName(name);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateName,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

