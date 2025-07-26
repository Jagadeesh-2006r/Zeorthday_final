import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  avatar?: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: string;
  department?: string;
  year?: string;
  rollNumber?: string;
  employeeId?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Simple localStorage for registered users
const USERS_KEY = "campus_portal_users";

const getStoredUsers = () => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

const saveUser = (userData: RegisterData) => {
  const users = getStoredUsers();
  const newUser = {
    id: Date.now().toString(),
    ...userData,
  };
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return newUser;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check hardcoded demo users first
    if (email === "demo@university.edu" && password === "password") {
      setUser({
        id: "1",
        name: "Demo Student",
        email: "demo@university.edu",
        role: "student",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      });
      setIsLoading(false);
      return true;
    } else if (email === "admin@university.edu" && password === "admin123") {
      setUser({
        id: "2",
        name: "Admin User",
        email: "admin@university.edu",
        role: "admin",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      });
      setIsLoading(false);
      return true;
    } else if (
      email === "faculty@university.edu" &&
      password === "faculty123"
    ) {
      setUser({
        id: "3",
        name: "Dr. Sarah Johnson",
        email: "faculty@university.edu",
        role: "faculty",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      });
      setIsLoading(false);
      return true;
    }

    // Check registered users
    const registeredUsers = getStoredUsers();
    const foundUser = registeredUsers.find(
      (u: any) => u.email === email && u.password === password
    );

    if (foundUser) {
      setUser({
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role === "admin" ? "admin" : "student",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      });
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      // Check if email already exists
      const existingUsers = getStoredUsers();
      const emailExists = existingUsers.some(
        (u: any) => u.email === userData.email
      );

      if (emailExists) {
        setIsLoading(false);
        return false;
      }

      // Save new user
      const newUser = saveUser(userData);

      // Auto-login after registration
      setUser({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role === "admin" ? "admin" : "student",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      });

      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
