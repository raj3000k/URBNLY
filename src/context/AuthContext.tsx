import { createContext, useContext, useState, useEffect } from "react";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "customer" | "owner";
  company?: string;
  currentPropertyId?: string;
  lookingForRoommate?: boolean;
  preferences?: {
    sleepSchedule?: string;
    cleanliness?: string;
    foodPreference?: string;
    socialStyle?: string;
    workMode?: string;
    budgetPreference?: string;
  };
};

type AuthContextType = {
  user: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const normalizeStoredUser = (value: unknown): User | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<User>;

  if (!candidate.id || !candidate.name || !candidate.email) {
    return null;
  }

  return {
    id: String(candidate.id),
    name: String(candidate.name),
    email: String(candidate.email),
    role: candidate.role === "owner" ? "owner" : "customer",
    company: typeof candidate.company === "string" ? candidate.company : "",
    currentPropertyId:
      typeof candidate.currentPropertyId === "string" ? candidate.currentPropertyId : "",
    lookingForRoommate: Boolean(candidate.lookingForRoommate),
    preferences:
      candidate.preferences && typeof candidate.preferences === "object"
        ? candidate.preferences
        : undefined,
  };
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = normalizeStoredUser(JSON.parse(storedUser));

        if (parsedUser) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setUser(parsedUser);
          localStorage.setItem("user", JSON.stringify(parsedUser));
        } else {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = (user: User, token: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const updateUser = (user: User) => {
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
