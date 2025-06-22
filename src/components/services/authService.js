
import axios from 'axios';

export async function loginUser({ email, password }) {
  try {
    const response = await axios.post('http://localhost:3000/api/login', {
      email,
      password
    });

    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error al iniciar sesión';
  }
}


export async function registerUser({ nombre, apellido, email, password }) {
  try {
    const response = await axios.post('http://localhost:3000/api/register', {
      nombre,
      apellido,
      email,
      password
    });

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error al registrarse';
  }
}
