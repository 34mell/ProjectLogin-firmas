import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { Sparkles } from 'lucide-react';
import { loginUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';
export const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  let navigate = useNavigate();
  // Maneja el inicio de sesión 
  const handleLogin = async (credentials) => {
        try {
      const result = await loginUser(credentials);
      console.log('acceso exitoso', result);

      // Redirigir al login o dashboard
      navigate('/Principal');
    } catch (error) {
      alert(error.message); // Reemplaza esto con un toast si usas uno
    } finally {
      setIsLoading(false);
    }
  };
  
  
  return (
    <div className="max-w-md w-full mx-auto animate-fadeIn">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-all hover:shadow-2xl">
        <div className="px-6 py-8 sm:px-10">
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mb-4">
              <Sparkles size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to your account to continue
            </p>
          </div>
          
          <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};