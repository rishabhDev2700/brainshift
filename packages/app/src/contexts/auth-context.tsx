import { createContext, useState, type ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: number;
  fullName: string;
  email: string;
  emailVerified: boolean;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      try {
        const decodedToken: { sub: number; fullName: string; email: string; emailVerified: boolean } = jwtDecode(token);
        setUser({
          id: decodedToken.sub,
          fullName: decodedToken.fullName,
          email: decodedToken.email,
          emailVerified: decodedToken.emailVerified,
        });
      } catch (error) {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
      }
    }
  }, [token]);

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    const decodedToken: { sub: number; fullName: string; email: string; emailVerified: boolean } = jwtDecode(newToken);
    setUser({
      id: decodedToken.sub,
      fullName: decodedToken.fullName,
      email: decodedToken.email,
      emailVerified: decodedToken.emailVerified,
    });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    toast.success("Logged out successfully");
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};