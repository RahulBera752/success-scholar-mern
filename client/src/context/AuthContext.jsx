import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, getToken } from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!getToken());

  useEffect(() => {
    if (!getToken()) return;
    api('/auth/me', { auth: true })
      .then((d) => setUser(d.user))
      .catch(() => localStorage.removeItem('ss_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password, accountType) => {
    const d = await api('/auth/login', { method: 'POST', body: { email, password, accountType } });
    localStorage.setItem('ss_token', d.token);
    setUser(d.user);
    return d.user;
  }, []);

  const register = useCallback(async (form) => {
    const d = await api('/auth/register', { method: 'POST', body: form });
    localStorage.setItem('ss_token', d.token);
    setUser(d.user);
    return d.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ss_token');
    setUser(null);
  }, []);

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
