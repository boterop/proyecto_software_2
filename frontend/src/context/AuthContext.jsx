/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  fetchCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../services/authApi";
import { getStoredToken } from "../services/authStorage";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const restore = async () => {
      if (!getStoredToken()) {
        if (!cancelled) {
          setUser(null);
          setBootstrapping(false);
        }
        return;
      }
      try {
        const me = await fetchCurrentUser();
        if (!cancelled) {
          setUser(me);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setBootstrapping(false);
        }
      }
    };

    restore();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await loginUser({ email, password });
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    await registerUser({ name, email, password });
    return login(email, password);
  }, [login]);

  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      bootstrapping,
      login,
      register,
      logout,
    }),
    [user, bootstrapping, login, register, logout],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};


