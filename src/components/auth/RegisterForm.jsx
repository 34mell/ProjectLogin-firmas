import React, { useState } from 'react';
import { Mail, Lock, User, Github } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Divider } from '../ui/Divider';
import { useNavigate } from "react-router";
import { SocialButton } from '../ui/SocialButton';


export const RegisterForm = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

    let navigate = useNavigate();
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

    const handleRegister = async (formData) => {
    setIsLoading(true);
    try {
      const result = await registerUser(formData);
      console.log('Registro exitoso:', result);

      // Redirigir al login o dashboard
      navigate('/login');
    } catch (error) {
      alert(error.message); // Reemplaza esto con un toast si usas uno
    } finally {
      setIsLoading(false);
    }
  };

  
  const validateForm = () => {
    const newErrors = {};
    
    // Full name validation
    if (!formData.nombre) {
      newErrors.nombre = 'Name is required';
    }

    // Full name validation
    if (!formData.apellido) {
      newErrors.apellido = 'Lastname is required';
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Terms acceptance validation
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full">
      <Input
        label="Nombre"
        type="text"
        name="nombre"
        icon={<User size={18} />}
        required
        autoComplete="nombre"
        value={formData.nombre}
        onChange={handleChange}
        error={errors.nombre}
      />

      <Input
        label="Apellido"
        type="text"
        name="apellido"
        icon={<User size={18} />}
        required
        autoComplete="apellido"
        value={formData.apellido}
        onChange={handleChange}
        error={errors.apellido}
      />
      
      <Input
        label="Email"
        type="email"
        name="email"
        icon={<Mail size={18} />}
        required
        autoComplete="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
      />
      
      <Input
        label="Password"
        type="password"
        name="password"
        icon={<Lock size={18} />}
        required
        autoComplete="new-password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
      />
      
      <Input
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        icon={<Lock size={18} />}
        required
        autoComplete="new-password"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
      />
      
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </div>
        <div className="ml-3">
          <label className="text-sm text-gray-600">
            I accept the{' '}
            <Button variant="link" type="button" className="p-0">
              Terms and Conditions
            </Button>
          </label>
          {errors.acceptTerms && (
            <p className="mt-1 text-sm text-red-600">{errors.acceptTerms}</p>
          )}
        </div>
      </div>
      
      <Button
        type="submit"
        fullWidth
        isLoading={isLoading}
        className="mt-6"
      >
        Create Account
      </Button>
      
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Button variant="link" type="button" className="font-medium"onClick={()=> {navigate("/Login")}}>
          Sign in
        </Button>
      </p>
    </form>
  );
};