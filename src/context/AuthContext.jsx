import React, { createContext, useState, useEffect, useContext } from 'react';
import { isAuthenticated, getCurrentUser, logout, recoverSession } from '../components/services/authService';

// Crear el contexto
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  
  useEffect(() => {
    // Verificar autenticación al cargar
    const checkAuth = async () => {
      let isAuth = isAuthenticated();
      if (!isAuth) {
        const recovered = await recoverSession();
        isAuth = recovered;
      }
      
      setAuthenticated(isAuth);

      if (isAuth) {
        const user = getCurrentUser();
        setCurrentUser(user);
      }
      setLoading(false);
    };

    // Manejar eventos de error de autenticación (token expirado, etc)
    const handleAuthError = (event) => {
      logout();
      setCurrentUser(null);
      setAuthenticated(false);
      alert(event.detail.message);
    };

    // Registrar el listener para errores de autenticación
    window.addEventListener('auth-error', handleAuthError);
    
    checkAuth();

    // Limpieza al desmontar
    return () => {
      window.removeEventListener('auth-error', handleAuthError);
    };
  }, []);

  const login = (userData) => {
    setCurrentUser(userData.user);
    setAuthenticated(true);
  };

  const signOut = () => {
    logout();
    setCurrentUser(null);
    setAuthenticated(false);
  };

  const value = {
    currentUser,
    authenticated,
    loading,
    login,
    logout: signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  return useContext(AuthContext);
};
