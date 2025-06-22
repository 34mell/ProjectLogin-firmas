import React, { useState } from 'react';
import { RegisterForm } from './RegisterForm';
import { registerUser } from '../services/authService';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleRegister = async (userData) => {
    try {
      const result = await registerUser(userData);
      console.log('Registro exitoso:', result);

      // Redirigir al login o dashboard
      navigate('/login');
    } catch (error) {
      alert(error); // Reemplaza esto con un toast si usas uno
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
            <h2 className="text-2xl font-bold text-gray-900">Create an account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Join us and start your journey
            </p>
          </div>
          
          <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};