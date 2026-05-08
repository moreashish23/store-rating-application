import {
  createContext,
  useContext,
  useReducer,
  useEffect,
} from "react";
import type { ReactNode } from "react";
import type{ User, AuthState } from "../types";

interface AuthContextType extends AuthState {
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

type AuthAction =
  | { type: "LOGIN"; payload: { user: User; token: string } }
  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; payload: User }
  | { type: "SET_LOADING"; payload: boolean };

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case "LOGOUT":
      return { user: null, token: null, isAuthenticated: false, isLoading: false };
    case "UPDATE_USER":
      return { ...state, user: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        dispatch({ type: "LOGIN", payload: { user, token } });
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch({ type: "SET_LOADING", payload: false });
      }
    } else {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const login = (user: User, token: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    dispatch({ type: "LOGIN", payload: { user, token } });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  };

  const updateUser = (user: User) => {
    localStorage.setItem("user", JSON.stringify(user));
    dispatch({ type: "UPDATE_USER", payload: user });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};