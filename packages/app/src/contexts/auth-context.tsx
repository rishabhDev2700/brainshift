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
  refreshToken: string | null;
  user: User | null;
  login: (token: string, refreshToken: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken'));
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
        setRefreshToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      }
    }
  }, [token]);

  const login = (newToken: string, newRefreshToken: string) => {
    setToken(newToken);
    setRefreshToken(newRefreshToken);
    localStorage.setItem('token', newToken);
    localStorage.setItem('refreshToken', newRefreshToken);
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
    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    toast.success("Logged out successfully");
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ token, refreshToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};