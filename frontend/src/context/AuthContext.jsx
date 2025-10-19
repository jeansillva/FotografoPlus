import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const getInitialAuth = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const qToken = params.get("token");
      const qName = params.get("name");
      const qEmail = params.get("email");

      if (qToken) {
        const userData = { name: decodeURIComponent(qName || ""), email: decodeURIComponent(qEmail || "") };
        localStorage.setItem("token", qToken);
        localStorage.setItem("user", JSON.stringify(userData));
        return { token: qToken, user: userData };
      }
    } catch (err) {
    }

    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    return { token: storedToken, user: storedUser ? JSON.parse(storedUser) : null };
  };

  const initial = getInitialAuth();
  const [token, setToken] = useState(initial.token);
  const [user, setUser] = useState(initial.user);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("token")) {
        const newUrl = window.location.pathname; 
        window.history.replaceState({}, document.title, newUrl);
      }
    } catch (err) {}
  }, []);

  const login = (userData, jwt) => {
    if (userData) localStorage.setItem("user", JSON.stringify(userData));
    if (jwt) localStorage.setItem("token", jwt);
    setUser(userData || null);
    setToken(jwt || null);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}